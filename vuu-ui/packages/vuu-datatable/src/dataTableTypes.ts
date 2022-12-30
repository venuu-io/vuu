import { DataSource, DataSourceRow } from "@finos/vuu-data";
import { KeyedColumnDescriptor, GridConfig } from "@finos/vuu-datagrid-types";
import { ColumnMap } from "@finos/vuu-utils";
import { HTMLAttributes, MouseEvent } from "react";

export type tableLayoutType = "row" | "column";

export interface Column {
  name: string;
  pin?: "left" | "right";
  // TODO add this to internal extension of Column type
  pinnedLeftOffset?: number;
  width?: number;
}

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  config: GridConfig;
  data?: DataSourceRow[];
  dataSource?: DataSource;
  headerHeight?: number;
  height?: number;
  rowHeight?: number;
  onConfigChange?: (config: GridConfig) => void;
  onShowConfigEditor?: () => void;
  allowConfigEditing?: boolean;
  tableLayout?: tableLayoutType;
  width?: number;
}

export interface TableImplementationProps extends Pick<TableProps, "data"> {
  columnMap: ColumnMap;
  columns: KeyedColumnDescriptor[];
  headerHeight: number;
  onHeaderCellDragEnd?: () => void;
  onHeaderCellDragStart?: (evt: MouseEvent) => void;
  rowHeight: number;
}

type MeasureStatus = "unmeasured" | "measured";

export interface TableMeasurements {
  contentHeight: number;
  left: number;
  right: number;
  scrollbarSize: number;
  scrollContentHeight: number;
  status: MeasureStatus;
  top: number;
}

export interface Viewport {
  fillerHeight: number;
  maxScrollContainerScrollHorizontal: number;
  maxScrollContainerScrollVertical: number;
  pinnedWidthLeft: number;
  rowCount: number;
  scrollContentWidth: number;
}
