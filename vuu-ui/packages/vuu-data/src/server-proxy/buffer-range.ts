import { VuuRange } from "@finos/vuu-protocol-types";
import { logger } from "@finos/vuu-utils";

const loggingLevel = () => {
  return loggingSettings.loggingLevel;
}

export const bufferBreakout = (
  range: VuuRange | null,
  from: number,
  to: number,
  bufferSize: number
): boolean => {
  const bufferPerimeter = bufferSize * 0.25;
  if (loggingLevel() === 'high') {
    logger.info(`Buffer Perimeter: ${bufferPerimeter}`)
  }
  if (!range || !bufferSize) {
    return true;
  } else if (range.to - to < bufferPerimeter) {
    if (loggingLevel() === 'high') {
      logger.info('Range to is less than buffer perimeter')
    }
    return true;
  } else if (range.from > 0 && from - range.from < bufferPerimeter) {
    if (loggingLevel() === 'high') {
      logger.info('Range from is greater than 0 and Range from is less than buffer perimeter')
    }
    return true;
  } else {
    return false;
  }
};
