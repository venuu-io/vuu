import { SubscribeCallback } from "@finos/vuu-data";
import { useServerConnectionQuality } from "@finos/vuu-data-react";
import { ErrorDisplay, useSchemas, useTestDataSource } from "../utils";
import { useCallback } from "react";

let displaySequence = 1;

export const ConnectionMetrics = () => {
  const pricesTableColumns = [
    "ask",
    "askSize",
    "bid",
    "bidSize",
    "close",
    "last",
    "open",
    "phase",
    "ric",
    "scenario",
  ];
  const messagesPerSecond = useServerConnectionQuality();
  const { schemas } = useSchemas();
  const { error, dataSource } = useTestDataSource({
    schemas,
    tablename: "prices",
  });
  const dataSourceHandler: SubscribeCallback = useCallback((message) => {
    return message;
  }, []);

  dataSource.subscribe(
    { columns: pricesTableColumns, range: { from: 0, to: 10 } },
    dataSourceHandler
  );
  if (error) return <ErrorDisplay>{error}</ErrorDisplay>;

  return <div>Connection Speed: {messagesPerSecond} msgs/s</div>;
};
ConnectionMetrics.displaySequence = displaySequence++;
