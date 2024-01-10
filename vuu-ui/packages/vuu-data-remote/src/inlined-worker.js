export const workerSourceCode = `
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// ../vuu-utils/src/array-utils.ts
function partition(array, test, pass = [], fail = []) {
  for (let i = 0, len = array.length; i < len; i++) {
    (test(array[i], i) ? pass : fail).push(array[i]);
  }
  return [pass, fail];
}

// ../vuu-utils/src/column-utils.ts
var metadataKeys = {
  IDX: 0,
  RENDER_IDX: 1,
  IS_LEAF: 2,
  IS_EXPANDED: 3,
  DEPTH: 4,
  COUNT: 5,
  KEY: 6,
  SELECTED: 7,
  count: 8,
  // TODO following only used in datamodel
  PARENT_IDX: "parent_idx",
  IDX_POINTER: "idx_pointer",
  FILTER_COUNT: "filter_count",
  NEXT_FILTER_IDX: "next_filter_idx"
};
var { DEPTH, IS_LEAF } = metadataKeys;

// ../vuu-utils/src/cookie-utils.ts
var getCookieValue = (name) => {
  var _a, _b;
  if (((_a = globalThis.document) == null ? void 0 : _a.cookie) !== void 0) {
    return (_b = globalThis.document.cookie.split("; ").find((row) => row.startsWith(\`\${name}=\`))) == null ? void 0 : _b.split("=")[1];
  }
};

// ../vuu-utils/src/range-utils.ts
function getFullRange({ from, to }, bufferSize = 0, rowCount = Number.MAX_SAFE_INTEGER) {
  if (bufferSize === 0) {
    if (rowCount < from) {
      return { from: 0, to: 0 };
    } else {
      return { from, to: Math.min(to, rowCount) };
    }
  } else if (from === 0) {
    return { from, to: Math.min(to + bufferSize, rowCount) };
  } else {
    const rangeSize = to - from;
    const buff = Math.round(bufferSize / 2);
    const shortfallBefore = from - buff < 0;
    const shortFallAfter = rowCount - (to + buff) < 0;
    if (shortfallBefore && shortFallAfter) {
      return { from: 0, to: rowCount };
    } else if (shortfallBefore) {
      return { from: 0, to: rangeSize + bufferSize };
    } else if (shortFallAfter) {
      return {
        from: Math.max(0, rowCount - (rangeSize + bufferSize)),
        to: rowCount
      };
    } else {
      return { from: from - buff, to: to + buff };
    }
  }
}
var withinRange = (value, { from, to }) => value >= from && value < to;
var WindowRange = class _WindowRange {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }
  isWithin(index) {
    return withinRange(index, this);
  }
  //find the overlap of this range and a new one
  overlap(from, to) {
    return from >= this.to || to < this.from ? [0, 0] : [Math.max(from, this.from), Math.min(to, this.to)];
  }
  copy() {
    return new _WindowRange(this.from, this.to);
  }
};

// ../vuu-utils/src/datasource-utils.ts
var isConnectionStatusMessage = (msg) => msg.type === "connection-status";
var isConnectionQualityMetrics = (msg) => msg.type === "connection-metrics";
var isViewporttMessage = (msg) => "viewport" in msg;

// ../vuu-utils/src/logging-utils.ts
var logLevels = ["error", "warn", "info", "debug"];
var isValidLogLevel = (value) => typeof value === "string" && logLevels.includes(value);
var DEFAULT_LOG_LEVEL = "error";
var NO_OP = () => void 0;
var DEFAULT_DEBUG_LEVEL = false ? "error" : "info";
var { loggingLevel = DEFAULT_DEBUG_LEVEL } = getLoggingSettings();
var logger = (category) => {
  const debugEnabled5 = loggingLevel === "debug";
  const infoEnabled5 = debugEnabled5 || loggingLevel === "info";
  const warnEnabled = infoEnabled5 || loggingLevel === "warn";
  const errorEnabled = warnEnabled || loggingLevel === "error";
  const info5 = infoEnabled5 ? (message) => console.info(\`[\${category}] \${message}\`) : NO_OP;
  const warn4 = warnEnabled ? (message) => console.warn(\`[\${category}] \${message}\`) : NO_OP;
  const debug5 = debugEnabled5 ? (message) => console.debug(\`[\${category}] \${message}\`) : NO_OP;
  const error4 = errorEnabled ? (message) => console.error(\`[\${category}] \${message}\`) : NO_OP;
  if (false) {
    return {
      errorEnabled,
      error: error4
    };
  } else {
    return {
      debugEnabled: debugEnabled5,
      infoEnabled: infoEnabled5,
      warnEnabled,
      errorEnabled,
      info: info5,
      warn: warn4,
      debug: debug5,
      error: error4
    };
  }
};
function getLoggingSettings() {
  if (typeof loggingSettings !== "undefined") {
    return loggingSettings;
  } else {
    return {
      loggingLevel: getLoggingLevelFromCookie()
    };
  }
}
function getLoggingLevelFromCookie() {
  const value = getCookieValue("vuu-logging-level");
  if (isValidLogLevel(value)) {
    return value;
  } else {
    return DEFAULT_LOG_LEVEL;
  }
}

// ../vuu-utils/src/debug-utils.ts
var { debug, debugEnabled } = logger("range-monitor");
var RangeMonitor = class {
  constructor(source) {
    this.source = source;
    this.range = { from: 0, to: 0 };
    this.timestamp = 0;
  }
  isSet() {
    return this.timestamp !== 0;
  }
  set({ from, to }) {
    const { timestamp } = this;
    this.range.from = from;
    this.range.to = to;
    this.timestamp = performance.now();
    if (timestamp) {
      debugEnabled && debug(
        \`<\${this.source}> [\${from}-\${to}], \${(this.timestamp - timestamp).toFixed(0)} ms elapsed\`
      );
    } else {
      return 0;
    }
  }
};

// ../vuu-utils/src/keyset.ts
var KeySet = class {
  constructor(range) {
    this.keys = /* @__PURE__ */ new Map();
    this.free = [];
    this.nextKeyValue = 0;
    this.reset(range);
  }
  next() {
    if (this.free.length > 0) {
      return this.free.shift();
    } else {
      return this.nextKeyValue++;
    }
  }
  reset({ from, to }) {
    this.keys.forEach((keyValue, rowIndex) => {
      if (rowIndex < from || rowIndex >= to) {
        this.free.push(keyValue);
        this.keys.delete(rowIndex);
      }
    });
    const size = to - from;
    if (this.keys.size + this.free.length > size) {
      this.free.length = Math.max(0, size - this.keys.size);
    }
    for (let rowIndex = from; rowIndex < to; rowIndex++) {
      if (!this.keys.has(rowIndex)) {
        const nextKeyValue = this.next();
        this.keys.set(rowIndex, nextKeyValue);
      }
    }
    if (this.nextKeyValue > this.keys.size) {
      this.nextKeyValue = this.keys.size;
    }
  }
  keyFor(rowIndex) {
    const key = this.keys.get(rowIndex);
    if (key === void 0) {
      console.log(\`key not found
        keys: \${this.toDebugString()}
        free : \${this.free.join(",")}  
      \`);
      throw Error(\`KeySet, no key found for rowIndex \${rowIndex}\`);
    }
    return key;
  }
  toDebugString() {
    return Array.from(this.keys.entries()).map(([k, v]) => \`\${k}=>\${v}\`).join(",");
  }
};

// ../vuu-utils/src/selection-utils.ts
var { SELECTED } = metadataKeys;
var RowSelected = {
  False: 0,
  True: 1,
  First: 2,
  Last: 4
};
var rangeIncludes = (range, index) => index >= range[0] && index <= range[1];
var SINGLE_SELECTED_ROW = RowSelected.True + RowSelected.First + RowSelected.Last;
var FIRST_SELECTED_ROW_OF_BLOCK = RowSelected.True + RowSelected.First;
var LAST_SELECTED_ROW_OF_BLOCK = RowSelected.True + RowSelected.Last;
var getSelectionStatus = (selected, itemIndex) => {
  for (const item of selected) {
    if (typeof item === "number") {
      if (item === itemIndex) {
        return SINGLE_SELECTED_ROW;
      }
    } else if (rangeIncludes(item, itemIndex)) {
      if (itemIndex === item[0]) {
        return FIRST_SELECTED_ROW_OF_BLOCK;
      } else if (itemIndex === item[1]) {
        return LAST_SELECTED_ROW_OF_BLOCK;
      } else {
        return RowSelected.True;
      }
    }
  }
  return RowSelected.False;
};
var expandSelection = (selected) => {
  if (selected.every((selectedItem) => typeof selectedItem === "number")) {
    return selected;
  }
  const expandedSelected = [];
  for (const selectedItem of selected) {
    if (typeof selectedItem === "number") {
      expandedSelected.push(selectedItem);
    } else {
      for (let i = selectedItem[0]; i <= selectedItem[1]; i++) {
        expandedSelected.push(i);
      }
    }
  }
  return expandedSelected;
};

// src/data-source.ts
var isSessionTableActionMessage = (messageBody) => messageBody.type === "VIEW_PORT_MENU_RESP" && messageBody.action !== null && isSessionTable(messageBody.action.table);
var isSessionTable = (table) => {
  if (table !== null && typeof table === "object" && "table" in table && "module" in table) {
    return table.table.startsWith("session");
  }
  return false;
};

// src/message-utils.ts
var MENU_RPC_TYPES = [
  "VIEW_PORT_MENUS_SELECT_RPC",
  "VIEW_PORT_MENU_TABLE_RPC",
  "VIEW_PORT_MENU_ROW_RPC",
  "VIEW_PORT_MENU_CELL_RPC",
  "VP_EDIT_CELL_RPC",
  "VP_EDIT_ROW_RPC",
  "VP_EDIT_ADD_ROW_RPC",
  "VP_EDIT_DELETE_CELL_RPC",
  "VP_EDIT_DELETE_ROW_RPC",
  "VP_EDIT_SUBMIT_FORM_RPC"
];
var isVuuMenuRpcRequest = (message) => MENU_RPC_TYPES.includes(message["type"]);
var isVuuRpcRequest = (message) => message["type"] === "VIEW_PORT_RPC_CALL";
var stripRequestId = ({
  requestId,
  ...rest
}) => [requestId, rest];
var getFirstAndLastRows = (rows) => {
  let firstRow = rows.at(0);
  if (firstRow.updateType === "SIZE") {
    if (rows.length === 1) {
      return rows;
    } else {
      firstRow = rows.at(1);
    }
  }
  const lastRow = rows.at(-1);
  return [firstRow, lastRow];
};
var groupRowsByViewport = (rows) => {
  const result = {};
  for (const row of rows) {
    const rowsForViewport = result[row.viewPortId] || (result[row.viewPortId] = []);
    rowsForViewport.push(row);
  }
  return result;
};
var createSchemaFromTableMetadata = ({
  columns,
  dataTypes,
  key,
  table
}) => {
  return {
    table,
    columns: columns.map((col, idx) => ({
      name: col,
      serverDataType: dataTypes[idx]
    })),
    key
  };
};

// src/server-proxy/messages.ts
var CHANGE_VP_SUCCESS = "CHANGE_VP_SUCCESS";
var CLOSE_TREE_NODE = "CLOSE_TREE_NODE";
var CLOSE_TREE_SUCCESS = "CLOSE_TREE_SUCCESS";
var CREATE_VP = "CREATE_VP";
var DISABLE_VP = "DISABLE_VP";
var DISABLE_VP_SUCCESS = "DISABLE_VP_SUCCESS";
var ENABLE_VP = "ENABLE_VP";
var ENABLE_VP_SUCCESS = "ENABLE_VP_SUCCESS";
var GET_VP_VISUAL_LINKS = "GET_VP_VISUAL_LINKS";
var GET_VIEW_PORT_MENUS = "GET_VIEW_PORT_MENUS";
var HB = "HB";
var HB_RESP = "HB_RESP";
var LOGIN = "LOGIN";
var OPEN_TREE_NODE = "OPEN_TREE_NODE";
var OPEN_TREE_SUCCESS = "OPEN_TREE_SUCCESS";
var REMOVE_VP = "REMOVE_VP";
var SET_SELECTION_SUCCESS = "SET_SELECTION_SUCCESS";

// src/server-proxy/rpc-services.ts
var getRpcServiceModule = (service) => {
  switch (service) {
    case "TypeAheadRpcHandler":
      return "TYPEAHEAD";
    default:
      return "SIMUL";
  }
};

// src/server-proxy/array-backed-moving-window.ts
var EMPTY_ARRAY = [];
var log = logger("array-backed-moving-window");
function dataIsUnchanged(newRow, existingRow) {
  if (!existingRow) {
    return false;
  }
  if (existingRow.data.length !== newRow.data.length) {
    return false;
  }
  if (existingRow.sel !== newRow.sel) {
    return false;
  }
  for (let i = 0; i < existingRow.data.length; i++) {
    if (existingRow.data[i] !== newRow.data[i]) {
      return false;
    }
  }
  return true;
}
var _range;
var ArrayBackedMovingWindow = class {
  // Note, the buffer is already accounted for in the range passed in here
  constructor({ from: clientFrom, to: clientTo }, { from, to }, bufferSize) {
    __privateAdd(this, _range, void 0);
    this.setRowCount = (rowCount) => {
      var _a;
      (_a = log.info) == null ? void 0 : _a.call(log, \`setRowCount \${rowCount}\`);
      if (rowCount < this.internalData.length) {
        this.internalData.length = rowCount;
      }
      if (rowCount < this.rowCount) {
        this.rowsWithinRange = 0;
        const end = Math.min(rowCount, this.clientRange.to);
        for (let i = this.clientRange.from; i < end; i++) {
          const rowIndex = i - __privateGet(this, _range).from;
          if (this.internalData[rowIndex] !== void 0) {
            this.rowsWithinRange += 1;
          }
        }
      }
      this.rowCount = rowCount;
    };
    this.bufferBreakout = (from, to) => {
      const bufferPerimeter = this.bufferSize * 0.25;
      if (__privateGet(this, _range).to - to < bufferPerimeter) {
        return true;
      } else if (__privateGet(this, _range).from > 0 && from - __privateGet(this, _range).from < bufferPerimeter) {
        return true;
      } else {
        return false;
      }
    };
    this.bufferSize = bufferSize;
    this.clientRange = new WindowRange(clientFrom, clientTo);
    __privateSet(this, _range, new WindowRange(from, to));
    this.internalData = new Array(bufferSize);
    this.rowsWithinRange = 0;
    this.rowCount = 0;
  }
  get range() {
    return __privateGet(this, _range);
  }
  // TODO we shpuld probably have a hasAllClientRowsWithinRange
  get hasAllRowsWithinRange() {
    return this.rowsWithinRange === this.clientRange.to - this.clientRange.from || // this.rowsWithinRange === this.range.to - this.range.from ||
    this.rowCount > 0 && this.clientRange.from + this.rowsWithinRange === this.rowCount;
  }
  // Check to see if set of rows is outside the current viewport range, indicating
  // that veiwport is being scrolled quickly and server is not able to keep up.
  outOfRange(firstIndex, lastIndex) {
    const { from, to } = this.range;
    if (lastIndex < from) {
      return true;
    }
    if (firstIndex >= to) {
      return true;
    }
  }
  setAtIndex(row) {
    const { rowIndex: index } = row;
    const internalIndex = index - __privateGet(this, _range).from;
    if (dataIsUnchanged(row, this.internalData[internalIndex])) {
      return false;
    }
    const isWithinClientRange = this.isWithinClientRange(index);
    if (isWithinClientRange || this.isWithinRange(index)) {
      if (!this.internalData[internalIndex] && isWithinClientRange) {
        this.rowsWithinRange += 1;
      }
      this.internalData[internalIndex] = row;
    }
    return isWithinClientRange;
  }
  getAtIndex(index) {
    return __privateGet(this, _range).isWithin(index) && this.internalData[index - __privateGet(this, _range).from] != null ? this.internalData[index - __privateGet(this, _range).from] : void 0;
  }
  isWithinRange(index) {
    return __privateGet(this, _range).isWithin(index);
  }
  isWithinClientRange(index) {
    return this.clientRange.isWithin(index);
  }
  // Returns [false] or [serverDataRequired, clientRows, holdingRows]
  setClientRange(from, to) {
    var _a;
    (_a = log.debug) == null ? void 0 : _a.call(log, \`setClientRange \${from} - \${to}\`);
    const currentFrom = this.clientRange.from;
    const currentTo = Math.min(this.clientRange.to, this.rowCount);
    if (from === currentFrom && to === currentTo) {
      return [
        false,
        EMPTY_ARRAY
        /*, EMPTY_ARRAY*/
      ];
    }
    const originalRange = this.clientRange.copy();
    this.clientRange.from = from;
    this.clientRange.to = to;
    this.rowsWithinRange = 0;
    for (let i = from; i < to; i++) {
      const internalIndex = i - __privateGet(this, _range).from;
      if (this.internalData[internalIndex]) {
        this.rowsWithinRange += 1;
      }
    }
    let clientRows = EMPTY_ARRAY;
    const offset = __privateGet(this, _range).from;
    if (this.hasAllRowsWithinRange) {
      if (to > originalRange.to) {
        const start = Math.max(from, originalRange.to);
        clientRows = this.internalData.slice(start - offset, to - offset);
      } else {
        const end = Math.min(originalRange.from, to);
        clientRows = this.internalData.slice(from - offset, end - offset);
      }
    }
    const serverDataRequired = this.bufferBreakout(from, to);
    return [serverDataRequired, clientRows];
  }
  setRange(from, to) {
    var _a, _b;
    if (from !== __privateGet(this, _range).from || to !== __privateGet(this, _range).to) {
      (_a = log.debug) == null ? void 0 : _a.call(log, \`setRange \${from} - \${to}\`);
      const [overlapFrom, overlapTo] = __privateGet(this, _range).overlap(from, to);
      const newData = new Array(to - from);
      this.rowsWithinRange = 0;
      for (let i = overlapFrom; i < overlapTo; i++) {
        const data = this.getAtIndex(i);
        if (data) {
          const index = i - from;
          newData[index] = data;
          if (this.isWithinClientRange(i)) {
            this.rowsWithinRange += 1;
          }
        }
      }
      this.internalData = newData;
      __privateGet(this, _range).from = from;
      __privateGet(this, _range).to = to;
    } else {
      (_b = log.debug) == null ? void 0 : _b.call(log, \`setRange \${from} - \${to} IGNORED because not changed\`);
    }
  }
  //TODO temp
  get data() {
    return this.internalData;
  }
  getData() {
    var _a;
    const { from, to } = __privateGet(this, _range);
    const { from: clientFrom, to: clientTo } = this.clientRange;
    const startOffset = Math.max(0, clientFrom - from);
    const endOffset = Math.min(
      to - from,
      to,
      clientTo - from,
      (_a = this.rowCount) != null ? _a : to
    );
    return this.internalData.slice(startOffset, endOffset);
  }
  clear() {
    var _a;
    (_a = log.debug) == null ? void 0 : _a.call(log, "clear");
    this.internalData.length = 0;
    this.rowsWithinRange = 0;
    this.setRowCount(0);
  }
  // used only for debugging
  getCurrentDataRange() {
    const rows = this.internalData;
    const len = rows.length;
    let [firstRow] = this.internalData;
    let lastRow = this.internalData[len - 1];
    if (firstRow && lastRow) {
      return [firstRow.rowIndex, lastRow.rowIndex];
    } else {
      for (let i = 0; i < len; i++) {
        if (rows[i] !== void 0) {
          firstRow = rows[i];
          break;
        }
      }
      for (let i = len - 1; i >= 0; i--) {
        if (rows[i] !== void 0) {
          lastRow = rows[i];
          break;
        }
      }
      if (firstRow && lastRow) {
        return [firstRow.rowIndex, lastRow.rowIndex];
      } else {
        return [-1, -1];
      }
    }
  }
};
_range = new WeakMap();

// src/server-proxy/viewport.ts
var EMPTY_GROUPBY = [];
var { debug: debug2, debugEnabled: debugEnabled2, error, info, infoEnabled, warn } = logger("viewport");
var isLeafUpdate = ({ rowKey, updateType }) => updateType === "U" && !rowKey.startsWith("\$root");
var NO_DATA_UPDATE = [
  void 0,
  void 0
];
var NO_UPDATE_STATUS = {
  count: 0,
  mode: void 0,
  size: 0,
  ts: 0
};
var Viewport = class {
  constructor({
    aggregations,
    bufferSize = 50,
    columns,
    filter,
    groupBy = [],
    table,
    range,
    sort,
    title,
    viewport,
    visualLink
  }, postMessageToClient) {
    /** batchMode is irrelevant for Vuu Table, it was introduced to try and improve rendering performance of AgGrid */
    this.batchMode = true;
    this.hasUpdates = false;
    this.pendingUpdates = [];
    this.pendingOperations = /* @__PURE__ */ new Map();
    this.pendingRangeRequests = [];
    this.rowCountChanged = false;
    this.selectedRows = [];
    this.useBatchMode = true;
    this.lastUpdateStatus = NO_UPDATE_STATUS;
    this.updateThrottleTimer = void 0;
    this.rangeMonitor = new RangeMonitor("ViewPort");
    this.disabled = false;
    this.isTree = false;
    // TODO roll disabled/suspended into status
    this.status = "";
    this.suspended = false;
    this.suspendTimer = null;
    // Records SIZE only updates
    this.setLastSizeOnlyUpdateSize = (size) => {
      this.lastUpdateStatus.size = size;
    };
    this.setLastUpdate = (mode) => {
      const { ts: lastTS, mode: lastMode } = this.lastUpdateStatus;
      let elapsedTime = 0;
      if (lastMode === mode) {
        const ts = Date.now();
        this.lastUpdateStatus.count += 1;
        this.lastUpdateStatus.ts = ts;
        elapsedTime = lastTS === 0 ? 0 : ts - lastTS;
      } else {
        this.lastUpdateStatus.count = 1;
        this.lastUpdateStatus.ts = 0;
        elapsedTime = 0;
      }
      this.lastUpdateStatus.mode = mode;
      return elapsedTime;
    };
    this.rangeRequestAlreadyPending = (range) => {
      const { bufferSize } = this;
      const bufferThreshold = bufferSize * 0.25;
      let { from: stillPendingFrom } = range;
      for (const { from, to } of this.pendingRangeRequests) {
        if (stillPendingFrom >= from && stillPendingFrom < to) {
          if (range.to + bufferThreshold <= to) {
            return true;
          } else {
            stillPendingFrom = to;
          }
        }
      }
      return false;
    };
    this.sendThrottledSizeMessage = () => {
      this.updateThrottleTimer = void 0;
      this.lastUpdateStatus.count = 3;
      this.postMessageToClient({
        clientViewportId: this.clientViewportId,
        mode: "size-only",
        size: this.lastUpdateStatus.size,
        type: "viewport-update"
      });
    };
    // If we are receiving multiple SIZE updates but no data, table is loading rows
    // outside of our viewport. We can safely throttle these requests. Doing so will
    // alleviate pressure on UI DataTable.
    this.shouldThrottleMessage = (mode) => {
      const elapsedTime = this.setLastUpdate(mode);
      return mode === "size-only" && elapsedTime > 0 && elapsedTime < 500 && this.lastUpdateStatus.count > 3;
    };
    this.throttleMessage = (mode) => {
      if (this.shouldThrottleMessage(mode)) {
        info == null ? void 0 : info("throttling updates setTimeout to 2000");
        if (this.updateThrottleTimer === void 0) {
          this.updateThrottleTimer = setTimeout(
            this.sendThrottledSizeMessage,
            2e3
          );
        }
        return true;
      } else if (this.updateThrottleTimer !== void 0) {
        clearTimeout(this.updateThrottleTimer);
        this.updateThrottleTimer = void 0;
      }
      return false;
    };
    this.getNewRowCount = () => {
      if (this.rowCountChanged && this.dataWindow) {
        this.rowCountChanged = false;
        return this.dataWindow.rowCount;
      }
    };
    this.aggregations = aggregations;
    this.bufferSize = bufferSize;
    this.clientRange = range;
    this.clientViewportId = viewport;
    this.columns = columns;
    this.filter = filter;
    this.groupBy = groupBy;
    this.keys = new KeySet(range);
    this.pendingLinkedParent = visualLink;
    this.table = table;
    this.sort = sort;
    this.title = title;
    infoEnabled && (info == null ? void 0 : info(
      \`constructor #\${viewport} \${table.table} bufferSize=\${bufferSize}\`
    ));
    this.dataWindow = new ArrayBackedMovingWindow(
      this.clientRange,
      range,
      this.bufferSize
    );
    this.postMessageToClient = postMessageToClient;
  }
  get hasUpdatesToProcess() {
    if (this.suspended) {
      return false;
    }
    return this.rowCountChanged || this.hasUpdates;
  }
  get size() {
    var _a;
    return (_a = this.dataWindow.rowCount) != null ? _a : 0;
  }
  subscribe() {
    const { filter } = this.filter;
    this.status = this.status === "subscribed" ? "resubscribing" : "subscribing";
    return {
      type: CREATE_VP,
      table: this.table,
      range: getFullRange(this.clientRange, this.bufferSize),
      aggregations: this.aggregations,
      columns: this.columns,
      sort: this.sort,
      groupBy: this.groupBy,
      filterSpec: { filter }
    };
  }
  handleSubscribed({
    viewPortId,
    aggregations,
    columns,
    filterSpec: filter,
    range,
    sort,
    groupBy
  }, tableSchema) {
    this.serverViewportId = viewPortId;
    this.status = "subscribed";
    this.aggregations = aggregations;
    this.columns = columns;
    this.groupBy = groupBy;
    this.isTree = groupBy && groupBy.length > 0;
    this.dataWindow.setRange(range.from, range.to);
    return {
      aggregations,
      type: "subscribed",
      clientViewportId: this.clientViewportId,
      columns,
      filter,
      groupBy,
      range,
      sort,
      tableSchema
    };
  }
  awaitOperation(requestId, msg) {
    this.pendingOperations.set(requestId, msg);
  }
  // Return a message if we need to communicate this to client UI
  completeOperation(requestId, ...params) {
    var _a;
    const { clientViewportId, pendingOperations } = this;
    const pendingOperation = pendingOperations.get(requestId);
    if (!pendingOperation) {
      error(
        \`no matching operation found to complete for requestId \${requestId}\`
      );
      return;
    }
    const { type } = pendingOperation;
    info == null ? void 0 : info(\`completeOperation \${type}\`);
    pendingOperations.delete(requestId);
    if (type === "CHANGE_VP_RANGE") {
      const [from, to] = params;
      (_a = this.dataWindow) == null ? void 0 : _a.setRange(from, to);
      for (let i = this.pendingRangeRequests.length - 1; i >= 0; i--) {
        const pendingRangeRequest = this.pendingRangeRequests[i];
        if (pendingRangeRequest.requestId === requestId) {
          pendingRangeRequest.acked = true;
          break;
        } else {
          warn == null ? void 0 : warn("range requests sent faster than they are being ACKed");
        }
      }
    } else if (type === "config") {
      const { aggregations, columns, filter, groupBy, sort } = pendingOperation.data;
      this.aggregations = aggregations;
      this.columns = columns;
      this.filter = filter;
      this.groupBy = groupBy;
      this.sort = sort;
      if (groupBy.length > 0) {
        this.isTree = true;
      } else if (this.isTree) {
        this.isTree = false;
      }
      debug2 == null ? void 0 : debug2(\`config change confirmed, isTree : \${this.isTree}\`);
      return {
        clientViewportId,
        type,
        config: pendingOperation.data
      };
    } else if (type === "groupBy") {
      this.isTree = pendingOperation.data.length > 0;
      this.groupBy = pendingOperation.data;
      debug2 == null ? void 0 : debug2(\`groupBy change confirmed, isTree : \${this.isTree}\`);
      return {
        clientViewportId,
        type,
        groupBy: pendingOperation.data
      };
    } else if (type === "columns") {
      this.columns = pendingOperation.data;
      return {
        clientViewportId,
        type,
        columns: pendingOperation.data
      };
    } else if (type === "filter") {
      this.filter = pendingOperation.data;
      return {
        clientViewportId,
        type,
        filter: pendingOperation.data
      };
    } else if (type === "aggregate") {
      this.aggregations = pendingOperation.data;
      return {
        clientViewportId,
        type: "aggregate",
        aggregations: this.aggregations
      };
    } else if (type === "sort") {
      this.sort = pendingOperation.data;
      return {
        clientViewportId,
        type,
        sort: this.sort
      };
    } else if (type === "selection") {
    } else if (type === "disable") {
      this.disabled = true;
      return {
        type: "disabled",
        clientViewportId
      };
    } else if (type === "enable") {
      this.disabled = false;
      return {
        type: "enabled",
        clientViewportId
      };
    } else if (type === "CREATE_VISUAL_LINK") {
      const [colName, parentViewportId, parentColName] = params;
      this.linkedParent = {
        colName,
        parentViewportId,
        parentColName
      };
      this.pendingLinkedParent = void 0;
      return {
        type: "vuu-link-created",
        clientViewportId,
        colName,
        parentViewportId,
        parentColName
      };
    } else if (type === "REMOVE_VISUAL_LINK") {
      this.linkedParent = void 0;
      return {
        type: "vuu-link-removed",
        clientViewportId
      };
    }
  }
  // TODO when a range request arrives, consider the viewport to be scrolling
  // until data arrives and we have the full range.
  // When not scrolling, any server data is an update
  // When scrolling, we are in batch mode
  rangeRequest(requestId, range) {
    if (debugEnabled2) {
      this.rangeMonitor.set(range);
    }
    const type = "CHANGE_VP_RANGE";
    if (this.dataWindow) {
      const [serverDataRequired, clientRows] = this.dataWindow.setClientRange(
        range.from,
        range.to
      );
      let debounceRequest;
      const maxRange = this.dataWindow.rowCount || void 0;
      const serverRequest = serverDataRequired && !this.rangeRequestAlreadyPending(range) ? {
        type,
        viewPortId: this.serverViewportId,
        ...getFullRange(range, this.bufferSize, maxRange)
      } : null;
      if (serverRequest) {
        debugEnabled2 && (debug2 == null ? void 0 : debug2(
          \`create CHANGE_VP_RANGE: [\${serverRequest.from} - \${serverRequest.to}]\`
        ));
        this.awaitOperation(requestId, { type });
        const pendingRequest = this.pendingRangeRequests.at(-1);
        if (pendingRequest) {
          if (pendingRequest.acked) {
            console.warn("Range Request before previous request is filled");
          } else {
            const { from, to } = pendingRequest;
            if (this.dataWindow.outOfRange(from, to)) {
              debounceRequest = {
                clientViewportId: this.clientViewportId,
                type: "debounce-begin"
              };
            } else {
              warn == null ? void 0 : warn("Range Request before previous request is acked");
            }
          }
        }
        this.pendingRangeRequests.push({ ...serverRequest, requestId });
        if (this.useBatchMode) {
          this.batchMode = true;
        }
      } else if (clientRows.length > 0) {
        this.batchMode = false;
      }
      this.keys.reset(this.dataWindow.clientRange);
      const toClient = this.isTree ? toClientRowTree : toClientRow;
      if (clientRows.length) {
        return [
          serverRequest,
          clientRows.map((row) => {
            return toClient(row, this.keys, this.selectedRows);
          })
        ];
      } else if (debounceRequest) {
        return [serverRequest, void 0, debounceRequest];
      } else {
        return [serverRequest];
      }
    } else {
      return [null];
    }
  }
  setLinks(links) {
    this.links = links;
    return [
      {
        type: "vuu-links",
        links,
        clientViewportId: this.clientViewportId
      },
      this.pendingLinkedParent
    ];
  }
  setMenu(menu) {
    return {
      type: "vuu-menu",
      menu,
      clientViewportId: this.clientViewportId
    };
  }
  openTreeNode(requestId, message) {
    if (this.useBatchMode) {
      this.batchMode = true;
    }
    return {
      type: OPEN_TREE_NODE,
      vpId: this.serverViewportId,
      treeKey: message.key
    };
  }
  closeTreeNode(requestId, message) {
    if (this.useBatchMode) {
      this.batchMode = true;
    }
    return {
      type: CLOSE_TREE_NODE,
      vpId: this.serverViewportId,
      treeKey: message.key
    };
  }
  createLink(requestId, colName, parentVpId, parentColumnName) {
    const message = {
      type: "CREATE_VISUAL_LINK",
      parentVpId,
      childVpId: this.serverViewportId,
      parentColumnName,
      childColumnName: colName
    };
    this.awaitOperation(requestId, message);
    if (this.useBatchMode) {
      this.batchMode = true;
    }
    return message;
  }
  removeLink(requestId) {
    const message = {
      type: "REMOVE_VISUAL_LINK",
      childVpId: this.serverViewportId
    };
    this.awaitOperation(requestId, message);
    return message;
  }
  suspend() {
    this.suspended = true;
    info == null ? void 0 : info("suspend");
  }
  resume() {
    this.suspended = false;
    if (debugEnabled2) {
      debug2 == null ? void 0 : debug2(\`resume: \${this.currentData()}\`);
    }
    return [this.size, this.currentData()];
  }
  currentData() {
    const out = [];
    if (this.dataWindow) {
      const records = this.dataWindow.getData();
      const { keys } = this;
      const toClient = this.isTree ? toClientRowTree : toClientRow;
      for (const row of records) {
        if (row) {
          out.push(toClient(row, keys, this.selectedRows));
        }
      }
    }
    return out;
  }
  enable(requestId) {
    this.awaitOperation(requestId, { type: "enable" });
    info == null ? void 0 : info(\`enable: \${this.serverViewportId}\`);
    return {
      type: ENABLE_VP,
      viewPortId: this.serverViewportId
    };
  }
  disable(requestId) {
    this.awaitOperation(requestId, { type: "disable" });
    info == null ? void 0 : info(\`disable: \${this.serverViewportId}\`);
    this.suspended = false;
    return {
      type: DISABLE_VP,
      viewPortId: this.serverViewportId
    };
  }
  columnRequest(requestId, columns) {
    this.awaitOperation(requestId, {
      type: "columns",
      data: columns
    });
    debug2 == null ? void 0 : debug2(\`columnRequest: \${columns}\`);
    return this.createRequest({ columns });
  }
  filterRequest(requestId, dataSourceFilter) {
    this.awaitOperation(requestId, {
      type: "filter",
      data: dataSourceFilter
    });
    if (this.useBatchMode) {
      this.batchMode = true;
    }
    const { filter } = dataSourceFilter;
    info == null ? void 0 : info(\`filterRequest: \${filter}\`);
    return this.createRequest({ filterSpec: { filter } });
  }
  setConfig(requestId, config) {
    this.awaitOperation(requestId, { type: "config", data: config });
    const { filter, ...remainingConfig } = config;
    if (this.useBatchMode) {
      this.batchMode = true;
    }
    debugEnabled2 ? debug2 == null ? void 0 : debug2(\`setConfig \${JSON.stringify(config)}\`) : info == null ? void 0 : info(\`setConfig\`);
    return this.createRequest(
      {
        ...remainingConfig,
        filterSpec: typeof (filter == null ? void 0 : filter.filter) === "string" ? {
          filter: filter.filter
        } : {
          filter: ""
        }
      },
      true
    );
  }
  aggregateRequest(requestId, aggregations) {
    this.awaitOperation(requestId, { type: "aggregate", data: aggregations });
    info == null ? void 0 : info(\`aggregateRequest: \${aggregations}\`);
    return this.createRequest({ aggregations });
  }
  sortRequest(requestId, sort) {
    this.awaitOperation(requestId, { type: "sort", data: sort });
    info == null ? void 0 : info(\`sortRequest: \${JSON.stringify(sort.sortDefs)}\`);
    return this.createRequest({ sort });
  }
  groupByRequest(requestId, groupBy = EMPTY_GROUPBY) {
    var _a;
    this.awaitOperation(requestId, { type: "groupBy", data: groupBy });
    if (this.useBatchMode) {
      this.batchMode = true;
    }
    if (!this.isTree) {
      (_a = this.dataWindow) == null ? void 0 : _a.clear();
    }
    return this.createRequest({ groupBy });
  }
  selectRequest(requestId, selected) {
    this.selectedRows = selected;
    this.awaitOperation(requestId, { type: "selection", data: selected });
    info == null ? void 0 : info(\`selectRequest: \${selected}\`);
    return {
      type: "SET_SELECTION",
      vpId: this.serverViewportId,
      selection: expandSelection(selected)
    };
  }
  removePendingRangeRequest(firstIndex, lastIndex) {
    for (let i = this.pendingRangeRequests.length - 1; i >= 0; i--) {
      const { from, to } = this.pendingRangeRequests[i];
      let isLast = true;
      if (firstIndex >= from && firstIndex < to || lastIndex > from && lastIndex < to) {
        if (!isLast) {
          console.warn(
            "removePendingRangeRequest TABLE_ROWS are not for latest request"
          );
        }
        this.pendingRangeRequests.splice(i, 1);
        break;
      } else {
        isLast = false;
      }
    }
  }
  updateRows(rows) {
    var _a, _b, _c;
    const [firstRow, lastRow] = getFirstAndLastRows(rows);
    if (firstRow && lastRow) {
      this.removePendingRangeRequest(firstRow.rowIndex, lastRow.rowIndex);
    }
    if (rows.length === 1) {
      if (firstRow.vpSize === 0 && this.disabled) {
        debug2 == null ? void 0 : debug2(
          \`ignore a SIZE=0 message on disabled viewport (\${rows.length} rows)\`
        );
        return;
      } else if (firstRow.updateType === "SIZE") {
        this.setLastSizeOnlyUpdateSize(firstRow.vpSize);
      }
    }
    for (const row of rows) {
      if (this.isTree && isLeafUpdate(row)) {
        continue;
      } else {
        if (row.updateType === "SIZE" || ((_a = this.dataWindow) == null ? void 0 : _a.rowCount) !== row.vpSize) {
          (_b = this.dataWindow) == null ? void 0 : _b.setRowCount(row.vpSize);
          this.rowCountChanged = true;
        }
        if (row.updateType === "U") {
          if ((_c = this.dataWindow) == null ? void 0 : _c.setAtIndex(row)) {
            this.hasUpdates = true;
            if (!this.batchMode) {
              this.pendingUpdates.push(row);
            }
          }
        }
      }
    }
  }
  // This is called only after new data has been received from server - data
  // returned direcly from buffer does not use this.
  getClientRows() {
    let out = void 0;
    let mode = "size-only";
    if (!this.hasUpdates && !this.rowCountChanged) {
      return NO_DATA_UPDATE;
    }
    if (this.hasUpdates) {
      const { keys, selectedRows } = this;
      const toClient = this.isTree ? toClientRowTree : toClientRow;
      if (this.updateThrottleTimer) {
        self.clearTimeout(this.updateThrottleTimer);
        this.updateThrottleTimer = void 0;
      }
      if (this.pendingUpdates.length > 0) {
        out = [];
        mode = "update";
        for (const row of this.pendingUpdates) {
          out.push(toClient(row, keys, selectedRows));
        }
        this.pendingUpdates.length = 0;
      } else {
        const records = this.dataWindow.getData();
        if (this.dataWindow.hasAllRowsWithinRange) {
          out = [];
          mode = "batch";
          for (const row of records) {
            out.push(toClient(row, keys, selectedRows));
          }
          this.batchMode = false;
        }
      }
      this.hasUpdates = false;
    }
    if (this.throttleMessage(mode)) {
      return NO_DATA_UPDATE;
    } else {
      return [out, mode];
    }
  }
  createRequest(params, overWrite = false) {
    if (overWrite) {
      return {
        type: "CHANGE_VP",
        viewPortId: this.serverViewportId,
        ...params
      };
    } else {
      return {
        type: "CHANGE_VP",
        viewPortId: this.serverViewportId,
        aggregations: this.aggregations,
        columns: this.columns,
        sort: this.sort,
        groupBy: this.groupBy,
        filterSpec: {
          filter: this.filter.filter
        },
        ...params
      };
    }
  }
};
var toClientRow = ({ rowIndex, rowKey, sel: isSelected, data }, keys, selectedRows) => {
  return [
    rowIndex,
    keys.keyFor(rowIndex),
    true,
    false,
    0,
    0,
    rowKey,
    isSelected ? getSelectionStatus(selectedRows, rowIndex) : 0
  ].concat(data);
};
var toClientRowTree = ({ rowIndex, rowKey, sel: isSelected, data }, keys, selectedRows) => {
  const [depth, isExpanded, , isLeaf, , count, ...rest] = data;
  return [
    rowIndex,
    keys.keyFor(rowIndex),
    isLeaf,
    isExpanded,
    depth,
    count,
    rowKey,
    isSelected ? getSelectionStatus(selectedRows, rowIndex) : 0
  ].concat(rest);
};

// src/server-proxy/server-proxy.ts
var _requestId = 1;
var { debug: debug3, debugEnabled: debugEnabled3, error: error2, info: info2, infoEnabled: infoEnabled2, warn: warn2 } = logger("server-proxy");
var nextRequestId = () => \`\${_requestId++}\`;
var DEFAULT_OPTIONS = {};
var isActiveViewport = (viewPort) => viewPort.disabled !== true && viewPort.suspended !== true;
var NO_ACTION = {
  type: "NO_ACTION"
};
var addTitleToLinks = (links, serverViewportId, label) => links.map(
  (link) => link.parentVpId === serverViewportId ? { ...link, label } : link
);
function addLabelsToLinks(links, viewports) {
  return links.map((linkDescriptor) => {
    const { parentVpId } = linkDescriptor;
    const viewport = viewports.get(parentVpId);
    if (viewport) {
      return {
        ...linkDescriptor,
        parentClientVpId: viewport.clientViewportId,
        label: viewport.title
      };
    } else {
      throw Error("addLabelsToLinks viewport not found");
    }
  });
}
var ServerProxy = class {
  constructor(connection, callback) {
    this.authToken = "";
    this.user = "user";
    this.pendingRequests = /* @__PURE__ */ new Map();
    this.queuedRequests = [];
    this.cachedTableMetaRequests = /* @__PURE__ */ new Map();
    this.cachedTableSchemas = /* @__PURE__ */ new Map();
    this.connection = connection;
    this.postMessageToClient = callback;
    this.viewports = /* @__PURE__ */ new Map();
    this.mapClientToServerViewport = /* @__PURE__ */ new Map();
  }
  async reconnect() {
    await this.login(this.authToken);
    const [activeViewports, inactiveViewports] = partition(
      Array.from(this.viewports.values()),
      isActiveViewport
    );
    this.viewports.clear();
    this.mapClientToServerViewport.clear();
    const reconnectViewports = (viewports) => {
      viewports.forEach((viewport) => {
        const { clientViewportId } = viewport;
        this.viewports.set(clientViewportId, viewport);
        this.sendMessageToServer(viewport.subscribe(), clientViewportId);
      });
    };
    reconnectViewports(activeViewports);
    setTimeout(() => {
      reconnectViewports(inactiveViewports);
    }, 2e3);
  }
  async login(authToken, user = "user") {
    if (authToken) {
      this.authToken = authToken;
      this.user = user;
      return new Promise((resolve, reject) => {
        this.sendMessageToServer(
          { type: LOGIN, token: this.authToken, user },
          ""
        );
        this.pendingLogin = { resolve, reject };
      });
    } else if (this.authToken === "") {
      error2("login, cannot login until auth token has been obtained");
    }
  }
  subscribe(message) {
    if (!this.mapClientToServerViewport.has(message.viewport)) {
      const pendingTableSchema = this.getTableMeta(message.table);
      const viewport = new Viewport(message, this.postMessageToClient);
      this.viewports.set(message.viewport, viewport);
      const pendingSubscription = this.awaitResponseToMessage(
        viewport.subscribe(),
        message.viewport
      );
      const awaitPendingReponses = Promise.all([
        pendingSubscription,
        pendingTableSchema
      ]);
      awaitPendingReponses.then(([subscribeResponse, tableSchema]) => {
        const { viewPortId: serverViewportId } = subscribeResponse;
        const { status: previousViewportStatus } = viewport;
        if (message.viewport !== serverViewportId) {
          this.viewports.delete(message.viewport);
          this.viewports.set(serverViewportId, viewport);
        }
        this.mapClientToServerViewport.set(message.viewport, serverViewportId);
        const clientResponse = viewport.handleSubscribed(
          subscribeResponse,
          tableSchema
        );
        if (clientResponse) {
          this.postMessageToClient(clientResponse);
          if (debugEnabled3) {
            debug3(
              \`post DataSourceSubscribedMessage to client: \${JSON.stringify(
                clientResponse
              )}\`
            );
          }
        }
        if (viewport.disabled) {
          this.disableViewport(viewport);
        }
        if (this.queuedRequests.length > 0) {
          this.processQueuedRequests();
        }
        if (previousViewportStatus === "subscribing" && // A session table will never have Visual Links, nor Context Menus
        !isSessionTable(viewport.table)) {
          this.sendMessageToServer({
            type: GET_VP_VISUAL_LINKS,
            vpId: serverViewportId
          });
          this.sendMessageToServer({
            type: GET_VIEW_PORT_MENUS,
            vpId: serverViewportId
          });
          Array.from(this.viewports.entries()).filter(
            ([id, { disabled }]) => id !== serverViewportId && !disabled
          ).forEach(([vpId]) => {
            this.sendMessageToServer({
              type: GET_VP_VISUAL_LINKS,
              vpId
            });
          });
        }
      });
    } else {
      error2(\`spurious subscribe call \${message.viewport}\`);
    }
  }
  processQueuedRequests() {
    const messageTypesProcessed = {};
    while (this.queuedRequests.length) {
      const queuedRequest = this.queuedRequests.pop();
      if (queuedRequest) {
        const { clientViewportId, message, requestId } = queuedRequest;
        if (message.type === "CHANGE_VP_RANGE") {
          if (messageTypesProcessed.CHANGE_VP_RANGE) {
            continue;
          }
          messageTypesProcessed.CHANGE_VP_RANGE = true;
          const serverViewportId = this.mapClientToServerViewport.get(clientViewportId);
          if (serverViewportId) {
            this.sendMessageToServer(
              {
                ...message,
                viewPortId: serverViewportId
              },
              requestId
            );
          }
        }
      }
    }
  }
  unsubscribe(clientViewportId) {
    const serverViewportId = this.mapClientToServerViewport.get(clientViewportId);
    if (serverViewportId) {
      info2 == null ? void 0 : info2(
        \`Unsubscribe Message (Client to Server):
        \${serverViewportId}\`
      );
      this.sendMessageToServer({
        type: REMOVE_VP,
        viewPortId: serverViewportId
      });
    } else {
      error2(
        \`failed to unsubscribe client viewport \${clientViewportId}, viewport not found\`
      );
    }
  }
  getViewportForClient(clientViewportId, throws = true) {
    const serverViewportId = this.mapClientToServerViewport.get(clientViewportId);
    if (serverViewportId) {
      const viewport = this.viewports.get(serverViewportId);
      if (viewport) {
        return viewport;
      } else if (throws) {
        throw Error(
          \`Viewport not found for client viewport \${clientViewportId}\`
        );
      } else {
        return null;
      }
    } else if (this.viewports.has(clientViewportId)) {
      return this.viewports.get(clientViewportId);
    } else if (throws) {
      throw Error(
        \`Viewport server id not found for client viewport \${clientViewportId}\`
      );
    } else {
      return null;
    }
  }
  /**********************************************************************/
  /* Handle messages from client                                        */
  /**********************************************************************/
  setViewRange(viewport, message) {
    const requestId = nextRequestId();
    const [serverRequest, rows, debounceRequest] = viewport.rangeRequest(
      requestId,
      message.range
    );
    info2 == null ? void 0 : info2(\`setViewRange \${message.range.from} - \${message.range.to}\`);
    if (serverRequest) {
      if (true) {
        info2 == null ? void 0 : info2(
          \`CHANGE_VP_RANGE [\${message.range.from}-\${message.range.to}] => [\${serverRequest.from}-\${serverRequest.to}]\`
        );
      }
      const sentToServer = this.sendIfReady(
        serverRequest,
        requestId,
        viewport.status === "subscribed"
      );
      if (!sentToServer) {
        this.queuedRequests.push({
          clientViewportId: message.viewport,
          message: serverRequest,
          requestId
        });
      }
    }
    if (rows) {
      info2 == null ? void 0 : info2(\`setViewRange \${rows.length} rows returned from cache\`);
      this.postMessageToClient({
        mode: "batch",
        type: "viewport-update",
        clientViewportId: viewport.clientViewportId,
        rows
      });
    } else if (debounceRequest) {
      this.postMessageToClient(debounceRequest);
    }
  }
  setConfig(viewport, message) {
    const requestId = nextRequestId();
    const request = viewport.setConfig(requestId, message.config);
    this.sendIfReady(request, requestId, viewport.status === "subscribed");
  }
  aggregate(viewport, message) {
    const requestId = nextRequestId();
    const request = viewport.aggregateRequest(requestId, message.aggregations);
    this.sendIfReady(request, requestId, viewport.status === "subscribed");
  }
  sort(viewport, message) {
    const requestId = nextRequestId();
    const request = viewport.sortRequest(requestId, message.sort);
    this.sendIfReady(request, requestId, viewport.status === "subscribed");
  }
  groupBy(viewport, message) {
    const requestId = nextRequestId();
    const request = viewport.groupByRequest(requestId, message.groupBy);
    this.sendIfReady(request, requestId, viewport.status === "subscribed");
  }
  filter(viewport, message) {
    const requestId = nextRequestId();
    const { filter } = message;
    const request = viewport.filterRequest(requestId, filter);
    this.sendIfReady(request, requestId, viewport.status === "subscribed");
  }
  setColumns(viewport, message) {
    const requestId = nextRequestId();
    const { columns } = message;
    const request = viewport.columnRequest(requestId, columns);
    this.sendIfReady(request, requestId, viewport.status === "subscribed");
  }
  setTitle(viewport, message) {
    if (viewport) {
      viewport.title = message.title;
      this.updateTitleOnVisualLinks(viewport);
    }
  }
  select(viewport, message) {
    const requestId = nextRequestId();
    const { selected } = message;
    const request = viewport.selectRequest(requestId, selected);
    this.sendIfReady(request, requestId, viewport.status === "subscribed");
  }
  disableViewport(viewport) {
    const requestId = nextRequestId();
    const request = viewport.disable(requestId);
    this.sendIfReady(request, requestId, viewport.status === "subscribed");
  }
  enableViewport(viewport) {
    if (viewport.disabled) {
      const requestId = nextRequestId();
      const request = viewport.enable(requestId);
      this.sendIfReady(request, requestId, viewport.status === "subscribed");
    }
  }
  suspendViewport(viewport) {
    viewport.suspend();
    viewport.suspendTimer = setTimeout(() => {
      info2 == null ? void 0 : info2("suspendTimer expired, escalate suspend to disable");
      this.disableViewport(viewport);
    }, 3e3);
  }
  resumeViewport(viewport) {
    if (viewport.suspendTimer) {
      debug3 == null ? void 0 : debug3("clear suspend timer");
      clearTimeout(viewport.suspendTimer);
      viewport.suspendTimer = null;
    }
    const [size, rows] = viewport.resume();
    debug3 == null ? void 0 : debug3(\`resumeViewport size \${size}, \${rows.length} rows sent to client\`);
    this.postMessageToClient({
      clientViewportId: viewport.clientViewportId,
      mode: "batch",
      rows,
      size,
      type: "viewport-update"
    });
  }
  openTreeNode(viewport, message) {
    if (viewport.serverViewportId) {
      const requestId = nextRequestId();
      this.sendIfReady(
        viewport.openTreeNode(requestId, message),
        requestId,
        viewport.status === "subscribed"
      );
    }
  }
  closeTreeNode(viewport, message) {
    if (viewport.serverViewportId) {
      const requestId = nextRequestId();
      this.sendIfReady(
        viewport.closeTreeNode(requestId, message),
        requestId,
        viewport.status === "subscribed"
      );
    }
  }
  createLink(viewport, message) {
    const { parentClientVpId, parentColumnName, childColumnName } = message;
    const requestId = nextRequestId();
    const parentVpId = this.mapClientToServerViewport.get(parentClientVpId);
    if (parentVpId) {
      const request = viewport.createLink(
        requestId,
        childColumnName,
        parentVpId,
        parentColumnName
      );
      this.sendMessageToServer(request, requestId);
    } else {
      error2("ServerProxy unable to create link, viewport not found");
    }
  }
  removeLink(viewport) {
    const requestId = nextRequestId();
    const request = viewport.removeLink(requestId);
    this.sendMessageToServer(request, requestId);
  }
  updateTitleOnVisualLinks(viewport) {
    var _a;
    const { serverViewportId, title } = viewport;
    for (const vp of this.viewports.values()) {
      if (vp !== viewport && vp.links && serverViewportId && title) {
        if ((_a = vp.links) == null ? void 0 : _a.some((link) => link.parentVpId === serverViewportId)) {
          const [messageToClient] = vp.setLinks(
            addTitleToLinks(vp.links, serverViewportId, title)
          );
          this.postMessageToClient(messageToClient);
        }
      }
    }
  }
  removeViewportFromVisualLinks(serverViewportId) {
    var _a;
    for (const vp of this.viewports.values()) {
      if ((_a = vp.links) == null ? void 0 : _a.some(({ parentVpId }) => parentVpId === serverViewportId)) {
        const [messageToClient] = vp.setLinks(
          vp.links.filter(({ parentVpId }) => parentVpId !== serverViewportId)
        );
        this.postMessageToClient(messageToClient);
      }
    }
  }
  menuRpcCall(message) {
    const viewport = this.getViewportForClient(message.vpId, false);
    if (viewport == null ? void 0 : viewport.serverViewportId) {
      const [requestId, rpcRequest] = stripRequestId(message);
      this.sendMessageToServer(
        {
          ...rpcRequest,
          vpId: viewport.serverViewportId
        },
        requestId
      );
    }
  }
  viewportRpcCall(message) {
    const viewport = this.getViewportForClient(message.vpId, false);
    if (viewport == null ? void 0 : viewport.serverViewportId) {
      const [requestId, rpcRequest] = stripRequestId(message);
      this.sendMessageToServer(
        {
          ...rpcRequest,
          vpId: viewport.serverViewportId,
          namedParams: {}
        },
        requestId
      );
    }
  }
  rpcCall(message) {
    const [requestId, rpcRequest] = stripRequestId(message);
    const module = getRpcServiceModule(rpcRequest.service);
    this.sendMessageToServer(rpcRequest, requestId, { module });
  }
  handleMessageFromClient(message) {
    var _a;
    if (isViewporttMessage(message)) {
      if (message.type === "disable") {
        const viewport = this.getViewportForClient(message.viewport, false);
        if (viewport !== null) {
          return this.disableViewport(viewport);
        } else {
          return;
        }
      } else {
        const viewport = this.getViewportForClient(message.viewport);
        switch (message.type) {
          case "setViewRange":
            return this.setViewRange(viewport, message);
          case "config":
            return this.setConfig(viewport, message);
          case "aggregate":
            return this.aggregate(viewport, message);
          case "sort":
            return this.sort(viewport, message);
          case "groupBy":
            return this.groupBy(viewport, message);
          case "filter":
            return this.filter(viewport, message);
          case "select":
            return this.select(viewport, message);
          case "suspend":
            return this.suspendViewport(viewport);
          case "resume":
            return this.resumeViewport(viewport);
          case "enable":
            return this.enableViewport(viewport);
          case "openTreeNode":
            return this.openTreeNode(viewport, message);
          case "closeTreeNode":
            return this.closeTreeNode(viewport, message);
          case "createLink":
            return this.createLink(viewport, message);
          case "removeLink":
            return this.removeLink(viewport);
          case "setColumns":
            return this.setColumns(viewport, message);
          case "setTitle":
            return this.setTitle(viewport, message);
          default:
        }
      }
    } else if (isVuuRpcRequest(message)) {
      return this.viewportRpcCall(
        message
      );
    } else if (isVuuMenuRpcRequest(message)) {
      return this.menuRpcCall(message);
    } else {
      const { type, requestId } = message;
      switch (type) {
        case "GET_TABLE_LIST": {
          (_a = this.tableList) != null ? _a : this.tableList = this.awaitResponseToMessage(
            { type },
            requestId
          );
          this.tableList.then((response) => {
            this.postMessageToClient({
              type: "TABLE_LIST_RESP",
              tables: response.tables,
              requestId
            });
          });
          return;
        }
        case "GET_TABLE_META": {
          this.getTableMeta(message.table, requestId).then((tableSchema) => {
            if (tableSchema) {
              this.postMessageToClient({
                type: "TABLE_META_RESP",
                tableSchema,
                requestId
              });
            }
          });
          return;
        }
        case "RPC_CALL":
          return this.rpcCall(message);
        default:
      }
    }
    error2(
      \`Vuu ServerProxy Unexpected message from client \${JSON.stringify(
        message
      )}\`
    );
  }
  getTableMeta(table, requestId = nextRequestId()) {
    if (isSessionTable(table)) {
      return Promise.resolve(void 0);
    }
    const key = \`\${table.module}:\${table.table}\`;
    let tableMetaRequest = this.cachedTableMetaRequests.get(key);
    if (!tableMetaRequest) {
      tableMetaRequest = this.awaitResponseToMessage(
        { type: "GET_TABLE_META", table },
        requestId
      );
      this.cachedTableMetaRequests.set(key, tableMetaRequest);
    }
    return tableMetaRequest == null ? void 0 : tableMetaRequest.then((response) => this.cacheTableMeta(response));
  }
  awaitResponseToMessage(message, requestId = nextRequestId()) {
    return new Promise((resolve, reject) => {
      this.sendMessageToServer(message, requestId);
      this.pendingRequests.set(requestId, { reject, resolve });
    });
  }
  sendIfReady(message, requestId, isReady = true) {
    if (isReady) {
      this.sendMessageToServer(message, requestId);
    }
    return isReady;
  }
  sendMessageToServer(body, requestId = \`\${_requestId++}\`, options = DEFAULT_OPTIONS) {
    const { module = "CORE" } = options;
    if (this.authToken) {
      this.connection.send({
        requestId,
        sessionId: this.sessionId,
        token: this.authToken,
        user: this.user,
        module,
        body
      });
    }
  }
  handleMessageFromServer(message) {
    var _a, _b, _c;
    const { body, requestId, sessionId } = message;
    const pendingRequest = this.pendingRequests.get(requestId);
    if (pendingRequest) {
      const { resolve } = pendingRequest;
      this.pendingRequests.delete(requestId);
      resolve(body);
      return;
    }
    const { viewports } = this;
    switch (body.type) {
      case HB:
        this.sendMessageToServer(
          { type: HB_RESP, ts: +/* @__PURE__ */ new Date() },
          "NA"
        );
        break;
      case "LOGIN_SUCCESS":
        if (sessionId) {
          this.sessionId = sessionId;
          (_a = this.pendingLogin) == null ? void 0 : _a.resolve(sessionId);
          this.pendingLogin = void 0;
        } else {
          throw Error("LOGIN_SUCCESS did not provide sessionId");
        }
        break;
      case "REMOVE_VP_SUCCESS":
        {
          const viewport = viewports.get(body.viewPortId);
          if (viewport) {
            this.mapClientToServerViewport.delete(viewport.clientViewportId);
            viewports.delete(body.viewPortId);
            this.removeViewportFromVisualLinks(body.viewPortId);
          }
        }
        break;
      case SET_SELECTION_SUCCESS:
        {
          const viewport = this.viewports.get(body.vpId);
          if (viewport) {
            viewport.completeOperation(requestId);
          }
        }
        break;
      case CHANGE_VP_SUCCESS:
      case DISABLE_VP_SUCCESS:
        if (viewports.has(body.viewPortId)) {
          const viewport = this.viewports.get(body.viewPortId);
          if (viewport) {
            const response = viewport.completeOperation(requestId);
            if (response !== void 0) {
              this.postMessageToClient(response);
              if (debugEnabled3) {
                debug3(\`postMessageToClient \${JSON.stringify(response)}\`);
              }
            }
          }
        }
        break;
      case ENABLE_VP_SUCCESS:
        {
          const viewport = this.viewports.get(body.viewPortId);
          if (viewport) {
            const response = viewport.completeOperation(requestId);
            if (response) {
              this.postMessageToClient(response);
              const [size, rows] = viewport.resume();
              this.postMessageToClient({
                clientViewportId: viewport.clientViewportId,
                mode: "batch",
                rows,
                size,
                type: "viewport-update"
              });
            }
          }
        }
        break;
      case "TABLE_ROW":
        {
          const viewportRowMap = groupRowsByViewport(body.rows);
          if (debugEnabled3) {
            const [firstRow, secondRow] = body.rows;
            if (body.rows.length === 0) {
              debug3("handleMessageFromServer TABLE_ROW 0 rows");
            } else if ((firstRow == null ? void 0 : firstRow.rowIndex) === -1) {
              if (body.rows.length === 1) {
                if (firstRow.updateType === "SIZE") {
                  debug3(
                    \`handleMessageFromServer [\${firstRow.viewPortId}] TABLE_ROW SIZE ONLY \${firstRow.vpSize}\`
                  );
                } else {
                  debug3(
                    \`handleMessageFromServer [\${firstRow.viewPortId}] TABLE_ROW SIZE \${firstRow.vpSize} rowIdx \${firstRow.rowIndex}\`
                  );
                }
              } else {
                debug3(
                  \`handleMessageFromServer TABLE_ROW \${body.rows.length} rows, SIZE \${firstRow.vpSize}, [\${secondRow == null ? void 0 : secondRow.rowIndex}] - [\${(_b = body.rows[body.rows.length - 1]) == null ? void 0 : _b.rowIndex}]\`
                );
              }
            } else {
              debug3(
                \`handleMessageFromServer TABLE_ROW \${body.rows.length} rows [\${firstRow == null ? void 0 : firstRow.rowIndex}] - [\${(_c = body.rows[body.rows.length - 1]) == null ? void 0 : _c.rowIndex}]\`
              );
            }
          }
          for (const [viewportId, rows] of Object.entries(viewportRowMap)) {
            const viewport = viewports.get(viewportId);
            if (viewport) {
              viewport.updateRows(rows);
            } else {
              warn2 == null ? void 0 : warn2(
                \`TABLE_ROW message received for non registered viewport \${viewportId}\`
              );
            }
          }
          this.processUpdates();
        }
        break;
      case "CHANGE_VP_RANGE_SUCCESS":
        {
          const viewport = this.viewports.get(body.viewPortId);
          if (viewport) {
            const { from, to } = body;
            if (true) {
              info2 == null ? void 0 : info2(\`CHANGE_VP_RANGE_SUCCESS \${from} - \${to}\`);
            }
            viewport.completeOperation(requestId, from, to);
          }
        }
        break;
      case OPEN_TREE_SUCCESS:
      case CLOSE_TREE_SUCCESS:
        break;
      case "CREATE_VISUAL_LINK_SUCCESS":
        {
          const viewport = this.viewports.get(body.childVpId);
          const parentViewport = this.viewports.get(body.parentVpId);
          if (viewport && parentViewport) {
            const { childColumnName, parentColumnName } = body;
            const response = viewport.completeOperation(
              requestId,
              childColumnName,
              parentViewport.clientViewportId,
              parentColumnName
            );
            if (response) {
              this.postMessageToClient(response);
            }
          }
        }
        break;
      case "REMOVE_VISUAL_LINK_SUCCESS":
        {
          const viewport = this.viewports.get(body.childVpId);
          if (viewport) {
            const response = viewport.completeOperation(
              requestId
            );
            if (response) {
              this.postMessageToClient(response);
            }
          }
        }
        break;
      case "VP_VISUAL_LINKS_RESP":
        {
          const activeLinkDescriptors = this.getActiveLinks(body.links);
          const viewport = this.viewports.get(body.vpId);
          if (activeLinkDescriptors.length && viewport) {
            const linkDescriptorsWithLabels = addLabelsToLinks(
              activeLinkDescriptors,
              this.viewports
            );
            const [clientMessage, pendingLink] = viewport.setLinks(
              linkDescriptorsWithLabels
            );
            this.postMessageToClient(clientMessage);
            if (pendingLink) {
              const { link, parentClientVpId } = pendingLink;
              const requestId2 = nextRequestId();
              const serverViewportId = this.mapClientToServerViewport.get(parentClientVpId);
              if (serverViewportId) {
                const message2 = viewport.createLink(
                  requestId2,
                  link.fromColumn,
                  serverViewportId,
                  link.toColumn
                );
                this.sendMessageToServer(message2, requestId2);
              }
            }
          }
        }
        break;
      case "VIEW_PORT_MENUS_RESP":
        if (body.menu.name) {
          const viewport = this.viewports.get(body.vpId);
          if (viewport) {
            const clientMessage = viewport.setMenu(body.menu);
            this.postMessageToClient(clientMessage);
          }
        }
        break;
      case "VP_EDIT_RPC_RESPONSE":
        {
          this.postMessageToClient({
            action: body.action,
            requestId,
            rpcName: body.rpcName,
            type: "VP_EDIT_RPC_RESPONSE"
          });
        }
        break;
      case "VP_EDIT_RPC_REJECT":
        {
          const viewport = this.viewports.get(body.vpId);
          if (viewport) {
            this.postMessageToClient({
              requestId,
              type: "VP_EDIT_RPC_REJECT",
              error: body.error
            });
          }
        }
        break;
      case "VIEW_PORT_MENU_REJ": {
        console.log(\`send menu error back to client\`);
        const { error: error4, rpcName, vpId } = body;
        const viewport = this.viewports.get(vpId);
        if (viewport) {
          this.postMessageToClient({
            clientViewportId: viewport.clientViewportId,
            error: error4,
            rpcName,
            type: "VIEW_PORT_MENU_REJ",
            requestId
          });
        }
        break;
      }
      case "VIEW_PORT_MENU_RESP":
        {
          if (isSessionTableActionMessage(body)) {
            const { action, rpcName } = body;
            this.awaitResponseToMessage({
              type: "GET_TABLE_META",
              table: action.table
            }).then((response) => {
              const tableSchema = createSchemaFromTableMetadata(
                response
              );
              this.postMessageToClient({
                rpcName,
                type: "VIEW_PORT_MENU_RESP",
                action: {
                  ...action,
                  tableSchema
                },
                tableAlreadyOpen: this.isTableOpen(action.table),
                requestId
              });
            });
          } else {
            const { action } = body;
            this.postMessageToClient({
              type: "VIEW_PORT_MENU_RESP",
              action: action || NO_ACTION,
              tableAlreadyOpen: action !== null && this.isTableOpen(action.table),
              requestId
            });
          }
        }
        break;
      case "RPC_RESP":
        {
          const { method, result } = body;
          this.postMessageToClient({
            type: "RPC_RESP",
            method,
            result,
            requestId
          });
        }
        break;
      case "VIEW_PORT_RPC_REPONSE":
        {
          const { method, action } = body;
          this.postMessageToClient({
            type: "VIEW_PORT_RPC_RESPONSE",
            rpcName: method,
            action,
            requestId
          });
        }
        break;
      case "ERROR":
        error2(body.msg);
        break;
      default:
        infoEnabled2 && info2(\`handleMessageFromServer \${body["type"]}.\`);
    }
  }
  cacheTableMeta(messageBody) {
    const { module, table } = messageBody.table;
    const key = \`\${module}:\${table}\`;
    let tableSchema = this.cachedTableSchemas.get(key);
    if (!tableSchema) {
      tableSchema = createSchemaFromTableMetadata(messageBody);
      this.cachedTableSchemas.set(key, tableSchema);
    }
    return tableSchema;
  }
  isTableOpen(table) {
    if (table) {
      const tableName = table.table;
      for (const viewport of this.viewports.values()) {
        if (!viewport.suspended && viewport.table.table === tableName) {
          return true;
        }
      }
    }
  }
  // Eliminate links to suspended viewports
  getActiveLinks(linkDescriptors) {
    return linkDescriptors.filter((linkDescriptor) => {
      const viewport = this.viewports.get(linkDescriptor.parentVpId);
      return viewport && !viewport.suspended;
    });
  }
  processUpdates() {
    this.viewports.forEach((viewport) => {
      var _a;
      if (viewport.hasUpdatesToProcess) {
        const result = viewport.getClientRows();
        if (result !== NO_DATA_UPDATE) {
          const [rows, mode] = result;
          const size = viewport.getNewRowCount();
          if (size !== void 0 || rows && rows.length > 0) {
            debugEnabled3 && debug3(
              \`postMessageToClient #\${viewport.clientViewportId} viewport-update \${mode}, \${(_a = rows == null ? void 0 : rows.length) != null ? _a : "no"} rows, size \${size}\`
            );
            if (mode) {
              this.postMessageToClient({
                clientViewportId: viewport.clientViewportId,
                mode,
                rows,
                size,
                type: "viewport-update"
              });
            }
          }
        }
      }
    });
  }
};

// src/websocket-connection.ts
var { debug: debug4, debugEnabled: debugEnabled4, error: error3, info: info3, infoEnabled: infoEnabled3, warn: warn3 } = logger(
  "websocket-connection"
);
var WS = "ws";
var isWebsocketUrl = (url) => url.startsWith(WS + "://") || url.startsWith(WS + "s://");
var connectionAttemptStatus = {};
var setWebsocket = Symbol("setWebsocket");
var connectionCallback = Symbol("connectionCallback");
async function connect(connectionString, protocol, callback, retryLimitDisconnect = 10, retryLimitStartup = 5) {
  connectionAttemptStatus[connectionString] = {
    status: "connecting",
    connect: {
      allowed: retryLimitStartup,
      remaining: retryLimitStartup
    },
    reconnect: {
      allowed: retryLimitDisconnect,
      remaining: retryLimitDisconnect
    }
  };
  return makeConnection(connectionString, protocol, callback);
}
async function reconnect(connection) {
  throw Error("connection broken");
}
async function makeConnection(url, protocol, callback, connection) {
  const {
    status: currentStatus,
    connect: connectStatus,
    reconnect: reconnectStatus
  } = connectionAttemptStatus[url];
  const trackedStatus = currentStatus === "connecting" ? connectStatus : reconnectStatus;
  try {
    callback({ type: "connection-status", status: "connecting" });
    const reconnecting = typeof connection !== "undefined";
    const ws = await createWebsocket(url, protocol);
    console.info(
      "%c\u26A1 %cconnected",
      "font-size: 24px;color: green;font-weight: bold;",
      "color:green; font-size: 14px;"
    );
    if (connection !== void 0) {
      connection[setWebsocket](ws);
    }
    const websocketConnection = connection != null ? connection : new WebsocketConnection(ws, url, protocol, callback);
    const status = reconnecting ? "reconnected" : "connection-open-awaiting-session";
    callback({ type: "connection-status", status });
    websocketConnection.status = status;
    trackedStatus.remaining = trackedStatus.allowed;
    return websocketConnection;
  } catch (err) {
    const retry = --trackedStatus.remaining > 0;
    callback({
      type: "connection-status",
      status: "disconnected",
      reason: "failed to connect",
      retry
    });
    if (retry) {
      return makeConnectionIn(url, protocol, callback, connection, 2e3);
    } else {
      throw Error("Failed to establish connection");
    }
  }
}
var makeConnectionIn = (url, protocol, callback, connection, delay) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(makeConnection(url, protocol, callback, connection));
  }, delay);
});
var createWebsocket = (connectionString, protocol) => new Promise((resolve, reject) => {
  const websocketUrl = isWebsocketUrl(connectionString) ? connectionString : \`wss://\${connectionString}\`;
  if (infoEnabled3 && protocol !== void 0) {
    info3(\`WebSocket Protocol \${protocol == null ? void 0 : protocol.toString()}\`);
  }
  const ws = new WebSocket(websocketUrl, protocol);
  ws.onopen = () => resolve(ws);
  ws.onerror = (evt) => reject(evt);
});
var closeWarn = () => {
  warn3 == null ? void 0 : warn3(\`Connection cannot be closed, socket not yet opened\`);
};
var sendWarn = (msg) => {
  warn3 == null ? void 0 : warn3(\`Message cannot be sent, socket closed \${msg.body.type}\`);
};
var parseMessage = (message) => {
  try {
    return JSON.parse(message);
  } catch (e) {
    throw Error(\`Error parsing JSON response from server \${message}\`);
  }
};
var WebsocketConnection = class {
  constructor(ws, url, protocol, callback) {
    this.close = closeWarn;
    this.requiresLogin = true;
    this.send = sendWarn;
    this.status = "ready";
    this.messagesCount = 0;
    this.connectionMetricsInterval = null;
    this.handleWebsocketMessage = (evt) => {
      const vuuMessageFromServer = parseMessage(evt.data);
      this.messagesCount += 1;
      if (true) {
        if (debugEnabled4 && vuuMessageFromServer.body.type !== "HB") {
          debug4 == null ? void 0 : debug4(\`<<< \${vuuMessageFromServer.body.type}\`);
        }
      }
      this[connectionCallback](vuuMessageFromServer);
    };
    this.url = url;
    this.protocol = protocol;
    this[connectionCallback] = callback;
    this[setWebsocket](ws);
  }
  reconnect() {
    reconnect(this);
  }
  [(connectionCallback, setWebsocket)](ws) {
    const callback = this[connectionCallback];
    ws.onmessage = (evt) => {
      this.status = "connected";
      ws.onmessage = this.handleWebsocketMessage;
      this.handleWebsocketMessage(evt);
    };
    this.connectionMetricsInterval = setInterval(() => {
      callback({
        type: "connection-metrics",
        messagesLength: this.messagesCount
      });
      this.messagesCount = 0;
    }, 2e3);
    ws.onerror = () => {
      error3(\`\u26A1 connection error\`);
      callback({
        type: "connection-status",
        status: "disconnected",
        reason: "error"
      });
      if (this.connectionMetricsInterval) {
        clearInterval(this.connectionMetricsInterval);
        this.connectionMetricsInterval = null;
      }
      if (this.status === "connection-open-awaiting-session") {
        error3(
          \`Websocket connection lost before Vuu session established, check websocket configuration\`
        );
      } else if (this.status !== "closed") {
        reconnect(this);
        this.send = queue;
      }
    };
    ws.onclose = () => {
      info3 == null ? void 0 : info3(\`\u26A1 connection close\`);
      callback({
        type: "connection-status",
        status: "disconnected",
        reason: "close"
      });
      if (this.connectionMetricsInterval) {
        clearInterval(this.connectionMetricsInterval);
        this.connectionMetricsInterval = null;
      }
      if (this.status !== "closed") {
        reconnect(this);
        this.send = queue;
      }
    };
    const send = (msg) => {
      if (true) {
        if (debugEnabled4 && msg.body.type !== "HB_RESP") {
          debug4 == null ? void 0 : debug4(\`>>> \${msg.body.type}\`);
        }
      }
      ws.send(JSON.stringify(msg));
    };
    const queue = (msg) => {
      info3 == null ? void 0 : info3(\`TODO queue message until websocket reconnected \${msg.body.type}\`);
    };
    this.send = send;
    this.close = () => {
      this.status = "closed";
      ws.close();
      this.close = closeWarn;
      this.send = sendWarn;
      info3 == null ? void 0 : info3("close websocket");
    };
  }
};

// src/worker.ts
var server;
var { info: info4, infoEnabled: infoEnabled4 } = logger("worker");
async function connectToServer(url, protocol, token, username, onConnectionStatusChange, retryLimitDisconnect, retryLimitStartup) {
  const connection = await connect(
    url,
    protocol,
    // if this was called during connect, we would get a ReferenceError, but it will
    // never be called until subscriptions have been made, so this is safe.
    //TODO do we need to listen in to the connection messages here so we can lock back in, in the event of a reconnenct ?
    (msg) => {
      if (isConnectionQualityMetrics(msg)) {
        postMessage({ type: "connection-metrics", messages: msg });
      } else if (isConnectionStatusMessage(msg)) {
        onConnectionStatusChange(msg);
        if (msg.status === "reconnected") {
          server.reconnect();
        }
      } else {
        server.handleMessageFromServer(msg);
      }
    },
    retryLimitDisconnect,
    retryLimitStartup
  );
  server = new ServerProxy(connection, (msg) => sendMessageToClient(msg));
  if (connection.requiresLogin) {
    await server.login(token, username);
  }
}
function sendMessageToClient(message) {
  postMessage(message);
}
var handleMessageFromClient = async ({
  data: message
}) => {
  switch (message.type) {
    case "connect":
      await connectToServer(
        message.url,
        message.protocol,
        message.token,
        message.username,
        postMessage,
        message.retryLimitDisconnect,
        message.retryLimitStartup
      );
      postMessage({ type: "connected" });
      break;
    case "subscribe":
      infoEnabled4 && info4(\`client subscribe: \${JSON.stringify(message)}\`);
      server.subscribe(message);
      break;
    case "unsubscribe":
      infoEnabled4 && info4(\`client unsubscribe: \${JSON.stringify(message)}\`);
      server.unsubscribe(message.viewport);
      break;
    default:
      infoEnabled4 && info4(\`client message: \${JSON.stringify(message)}\`);
      server.handleMessageFromClient(message);
  }
};
self.addEventListener("message", handleMessageFromClient);
postMessage({ type: "ready" });

`;