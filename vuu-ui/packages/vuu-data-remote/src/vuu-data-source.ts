import {
  DataSource,
  DataSourceCallbackMessage,
  DataSourceConfig,
  DataSourceConstructorProps,
  DataSourceStatus,
  DataSourceVisualLinkCreatedMessage,
  OptimizeStrategy,
  Selection,
  ServerAPI,
  SubscribeCallback,
  SubscribeProps,
  TableSchema,
} from "@finos/vuu-data-types";
import {
  LinkDescriptorWithLabel,
  VuuAggregation,
  VuuCreateVisualLink,
  VuuDataRowDto,
  VuuGroupBy,
  VuuMenu,
  VuuRange,
  VuuRowDataItemType,
  VuuRpcMenuRequest,
  VuuRpcRequest,
  VuuRpcResponse,
  VuuRpcViewportRequest,
  VuuSort,
  VuuTable,
} from "@finos/vuu-protocol-types";

import {
  BaseDataSource,
  combineFilters,
  debounce,
  isViewportMenusAction,
  isVisualLinksAction,
  itemsOrOrderChanged,
  logger,
  selectionCount,
  throttle,
  uuid,
  vuuAddRowRequest,
  vuuDeleteRowRequest,
  vuuEditCellRequest,
} from "@finos/vuu-utils";
import ConnectionManager from "./ConnectionManager";
import { isDataSourceConfigMessage } from "./data-source";

import { MenuRpcResponse } from "@finos/vuu-data-types";

type RangeRequest = (range: VuuRange) => void;

const { info } = logger("VuuDataSource");

/*-----------------------------------------------------------------
 A RemoteDataSource manages a single subscription via the ServerProxy
  ----------------------------------------------------------------*/
export class VuuDataSource extends BaseDataSource implements DataSource {
  private bufferSize: number;
  private server: ServerAPI | null = null;
  private configChangePending: DataSourceConfig | undefined;
  rangeRequest: RangeRequest;

  #groupBy: VuuGroupBy = [];
  #pendingVisualLink?: LinkDescriptorWithLabel;
  #links: LinkDescriptorWithLabel[] | undefined;
  #menu: VuuMenu | undefined;
  #optimize: OptimizeStrategy = "throttle";
  #range: VuuRange = { from: 0, to: 0 };
  #selectedRowsCount = 0;
  #status: DataSourceStatus = "initialising";
  #tableSchema: TableSchema | undefined;

  public table: VuuTable;

  constructor(props: DataSourceConstructorProps) {
    super(props);

    const { bufferSize = 100, table, visualLink } = props;

    if (!table)
      throw Error("RemoteDataSource constructor called without table");

    this.bufferSize = bufferSize;
    this.table = table;

    this.#pendingVisualLink = visualLink;

    // this.rangeRequest = this.throttleRangeRequest;
    this.rangeRequest = this.rawRangeRequest;
  }

  async subscribe(subscribeProps: SubscribeProps, callback: SubscribeCallback) {
    super.subscribe(subscribeProps, callback);

    const { viewport = this.viewport || (this.viewport = uuid()) } =
      subscribeProps;

    if (this.#status === "disabled" || this.#status === "disabling") {
      this.enable(callback);
      return;
    }

    if (
      this.#status !== "initialising" &&
      this.#status !== "unsubscribed"
      // We can subscribe to a disabled dataSource. No request will be
      // sent to server to create a new VP, just to enable the existing one.
      // The current subscribing client becomes the subscription owner
    ) {
      return;
    }

    this.#status = "subscribing";

    this.server = await ConnectionManager.serverAPI;

    const { bufferSize } = this;

    // TODO make this async and await response here
    this.server?.subscribe(
      {
        ...this._config,
        bufferSize,
        viewport,
        table: this.table,
        range: this._range,
        title: this._title,
      },
      this.handleMessageFromServer,
    );
  }

  handleMessageFromServer = (message: DataSourceCallbackMessage) => {
    if (message.type === "subscribed") {
      this.#status = "subscribed";
      this.tableSchema = message.tableSchema;
      this._clientCallback?.(message);
      if (this.#pendingVisualLink) {
        this.visualLink = this.#pendingVisualLink;
        this.#pendingVisualLink = undefined;
      }
      this.emit("subscribed", message);
    } else if (message.type === "disabled") {
      this.#status = "disabled";
    } else if (message.type === "enabled") {
      this.#status = "enabled";
    } else if (isDataSourceConfigMessage(message)) {
      // This is an ACK for a CHANGE_VP message. Nothing to do here. We need
      // to wait for data to be returned before we can consider the change
      // to be in effect.
      return;
    } else if (message.type === "debounce-begin") {
      this.optimize = "debounce";
    } else {
      if (
        message.type === "viewport-update" &&
        message.size !== undefined &&
        message.size !== this._size
      ) {
        this._size = message.size;
        this.emit("resize", message.size);
      } else if (message.type === "viewport-clear") {
        this._size = 0;
        this.emit("resize", 0);
      }
      // This is used to remove any progress indication from the UI. We wait for actual data rather than
      // just the CHANGE_VP_SUCCESS ack as there is often a delay between receiving the ack and the data.
      // It may be a SIZE only message, eg in the case of removing a groupBy column from a multi-column
      // groupby, where no tree nodes are expanded.
      if (this.configChangePending) {
        this.setConfigPending();
      }

      if (isViewportMenusAction(message)) {
        this.#menu = message.menu;
      } else if (isVisualLinksAction(message)) {
        this.#links = message.links as LinkDescriptorWithLabel[];
      } else {
        this._clientCallback?.(message);
      }

      if (this.optimize === "debounce") {
        this.revertDebounce();
      }
    }
  };

  unsubscribe() {
    if (this.#status !== "unsubscribed") {
      info?.(`unsubscribe #${this.viewport}`);
      if (this.viewport) {
        this.server?.unsubscribe(this.viewport);
        this.emit("unsubscribed", this.viewport);
      }
      this.server?.destroy(this.viewport);
      this.server = null;
      this.removeAllListeners();
      this.#status = "unsubscribed";
      this.viewport = "";
      this.range = { from: 0, to: 0 };
    }
  }

  suspend() {
    if (this.#status !== "unsubscribed") {
      info?.(`suspend #${this.viewport}, current status ${this.#status}`);
      if (this.viewport) {
        this.#status = "suspended";
        this.server?.send({
          type: "suspend",
          viewport: this.viewport,
        });
        this.emit("suspended", this.viewport);
      }
    }
  }

  resume(callback?: SubscribeCallback) {
    const isDisabled = this.#status.startsWith("disabl");
    const isSuspended = this.#status === "suspended";
    info?.(`resume #${this.viewport}, current status ${this.#status}`);
    if (callback) {
      this._clientCallback = callback;
    }
    if (this.viewport) {
      if (isDisabled) {
        this.enable();
      } else if (isSuspended) {
        this.server?.send({
          type: "resume",
          viewport: this.viewport,
        });
        this.#status = "subscribed";
        this.emit("resumed", this.viewport);
      }
    }
  }

  disable() {
    info?.(`disable #${this.viewport}, current status ${this.#status}`);
    if (this.viewport) {
      this.#status = "disabling";
      this.server?.send({
        viewport: this.viewport,
        type: "disable",
      });
      this.emit("disabled", this.viewport);
    }
  }

  enable(callback?: SubscribeCallback) {
    info?.(`enable #${this.viewport}, current status ${this.#status}`);
    if (
      this.viewport &&
      (this.#status === "disabled" || this.#status === "disabling")
    ) {
      this.#status = "enabling";
      if (callback) {
        this._clientCallback = callback;
      }
      this.server?.send({
        viewport: this.viewport,
        type: "enable",
      });
      this.emit("enabled", this.viewport);
    }
  }

  select(selected: Selection) {
    //TODO this isn't always going to be correct - need to count
    // selection block items
    this.#selectedRowsCount = selectionCount(selected);
    if (this.viewport) {
      this.server?.send({
        viewport: this.viewport,
        type: "select",
        selected,
      });
      this.emit("row-selection", selected, this.#selectedRowsCount);
    }
  }

  openTreeNode(key: string) {
    if (this.viewport) {
      this.server?.send({
        viewport: this.viewport,
        type: "openTreeNode",
        key,
      });
    }
  }

  closeTreeNode(key: string) {
    if (this.viewport) {
      this.server?.send({
        viewport: this.viewport,
        type: "closeTreeNode",
        key,
      });
    }
  }

  get tableSchema() {
    return this.#tableSchema;
  }

  set tableSchema(tableSchema: TableSchema | undefined) {
    this.#tableSchema = tableSchema;
    // TOSO emit an event
  }

  get links() {
    return this.#links;
  }

  get menu() {
    return this.#menu;
  }

  get status() {
    return this.#status;
  }

  get optimize() {
    return this.#optimize;
  }

  set optimize(optimize: OptimizeStrategy) {
    if (optimize !== this.#optimize) {
      this.#optimize = optimize;
      switch (optimize) {
        case "none":
          this.rangeRequest = this.rawRangeRequest;
          break;
        case "debounce":
          this.rangeRequest = this.debounceRangeRequest;
          break;
        case "throttle":
          this.rangeRequest = this.throttleRangeRequest;
          break;
      }
      this.emit("optimize", optimize);
    }
  }

  private revertDebounce = debounce(() => {
    this.optimize = "throttle";
  }, 100);

  get selectedRowsCount() {
    return this.#selectedRowsCount;
  }

  private rawRangeRequest: RangeRequest = (range) => {
    if (this.viewport && this.server) {
      this.server.send({
        viewport: this.viewport,
        type: "setViewRange",
        range,
      });
    }
  };

  private debounceRangeRequest: RangeRequest = debounce((range: VuuRange) => {
    if (this.viewport && this.server) {
      this.server.send({
        viewport: this.viewport,
        type: "setViewRange",
        range,
      });
    }
  }, 50);

  private throttleRangeRequest: RangeRequest = throttle((range: VuuRange) => {
    if (this.viewport && this.server) {
      this.server.send({
        viewport: this.viewport,
        type: "setViewRange",
        range,
      });
    }
  }, 80);

  get config() {
    return super.config;
  }

  set config(config: DataSourceConfig) {
    const previousConfig = this._config;
    super.config = config;

    if (this._config !== previousConfig) {
      const newConfig = combineFilters(this._config);
      this.server?.send({
        viewport: this.viewport,
        type: "config",
        config: newConfig,
      });
    }
  }

  // We can remove this entirely once columns is handlwed liek filters
  // ie just sugar for setting config
  get columns() {
    return super.columns;
  }

  set columns(columns: string[]) {
    const previousConfig = this._config;
    super.columns = columns;

    if (previousConfig !== this._config) {
      const message = {
        viewport: this.viewport,
        type: "setColumns",
        columns,
      } as const;
      this.server?.send(message);
    }
  }

  get aggregations() {
    return this._config.aggregations;
  }

  set aggregations(aggregations: VuuAggregation[]) {
    this._config = {
      ...this._config,
      aggregations,
    };
    if (this.viewport) {
      this.server?.send({
        viewport: this.viewport,
        type: "aggregate",
        aggregations,
      });
    }
    this.emit("config", this._config);
  }

  get sort() {
    return this._config.sort;
  }

  set sort(sort: VuuSort) {
    // TODO should we wait until server ACK before we assign #sort ?
    this._config = {
      ...this._config,
      sort,
    };
    if (this.viewport) {
      const message = {
        viewport: this.viewport,
        type: "sort",
        sort,
      } as const;
      this.server?.send(message);
    }
    this.emit("config", this._config);
  }

  get groupBy() {
    return this._config.groupBy;
  }

  set groupBy(groupBy: VuuGroupBy) {
    if (itemsOrOrderChanged(this.groupBy, groupBy)) {
      const wasGrouped = this.groupBy.length > 0;

      this.config = {
        ...this._config,
        groupBy,
      };

      if (!wasGrouped && groupBy.length > 0 && this.viewport) {
        this._clientCallback?.({
          clientViewportId: this.viewport,
          mode: "batch",
          type: "viewport-update",
          size: 0,
          rows: [],
        });
      }
      this.setConfigPending({ groupBy });
    }
  }

  get title() {
    return this._title ?? `${this.table.module} ${this.table.table}`;
  }

  set title(title: string) {
    this._title = title;
    if (this.viewport && title) {
      // This message doesn't actually trigger a message to Vuu server
      // it will be used to recompute visual link labels
      this.server?.send({
        type: "setTitle",
        title,
        viewport: this.viewport,
      });
    }
    this.emit("title-changed", this.viewport ?? "'", title);
  }

  get visualLink() {
    return this._config.visualLink;
  }

  set visualLink(visualLink: LinkDescriptorWithLabel | undefined) {
    this._config = {
      ...this._config,
      visualLink,
    };

    if (visualLink) {
      const {
        parentClientVpId,
        link: { fromColumn, toColumn },
      } = visualLink;

      if (this.viewport) {
        this.server
          ?.rpcCall<DataSourceVisualLinkCreatedMessage>({
            childColumnName: fromColumn,
            childVpId: this.viewport,
            parentColumnName: toColumn,
            parentVpId: parentClientVpId,
            type: "CREATE_VISUAL_LINK",
          } as VuuCreateVisualLink)
          .then((response) => {
            this.emit("visual-link-created", response);
          });
      }
    } else {
      if (this.viewport) {
        this.server
          ?.rpcCall({
            type: "REMOVE_VISUAL_LINK",
            childVpId: this.viewport,
          })
          .then(() => {
            this.emit("visual-link-removed");
          });
      }
    }

    this.emit("config", this._config);
  }

  private setConfigPending(config?: DataSourceConfig) {
    const pendingConfig = this.configChangePending;
    this.configChangePending = config;

    if (config !== undefined) {
      this.emit("config", config, false);
    } else {
      this.emit("config", pendingConfig, true);
    }
  }

  async remoteProcedureCall<T extends VuuRpcResponse = VuuRpcResponse>() {
    return Promise.reject<T>();
  }

  /**  @deprecated */
  async rpcCall<T extends VuuRpcResponse = VuuRpcResponse>(
    rpcRequest: Omit<VuuRpcRequest, "vpId">,
  ) {
    if (this.viewport && this.server) {
      return this.server?.rpcCall<T>({
        ...rpcRequest,
        vpId: this.viewport,
      } as VuuRpcViewportRequest);
    } else {
      throw Error(`rpcCall server or viewport are undefined`);
    }
  }

  /**  @deprecated */
  async menuRpcCall(rpcRequest: Omit<VuuRpcRequest, "vpId">) {
    if (this.viewport) {
      return this.server?.rpcCall<MenuRpcResponse>({
        ...rpcRequest,
        vpId: this.viewport,
      } as VuuRpcMenuRequest);
    }
  }

  applyEdit(rowKey: string, columnName: string, value: VuuRowDataItemType) {
    return this.menuRpcCall(vuuEditCellRequest(rowKey, columnName, value)).then(
      (response) => {
        if (response?.error) {
          return response.error;
        } else {
          return true;
        }
      },
    );
  }

  insertRow(rowKey: string, data: VuuDataRowDto) {
    return this.menuRpcCall(vuuAddRowRequest(rowKey, data)).then((response) => {
      if (response?.error) {
        return response.error;
      } else {
        return true;
      }
    });
  }
  deleteRow(rowKey: string) {
    return this.menuRpcCall(vuuDeleteRowRequest(rowKey)).then((response) => {
      if (response?.error) {
        return response.error;
      } else {
        return true;
      }
    });
  }
}
