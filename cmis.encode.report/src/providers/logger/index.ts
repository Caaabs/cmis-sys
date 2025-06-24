import { Logger } from 'winston';
import { devLogger } from './dev-logger';
import { prdLogger } from './prd-logger';
import * as process from 'node:process';

const { ENV } = process.env;

export const logger = () => {
  let logger: Logger | null = null;
  if (ENV === 'prd') {
    logger = prdLogger;
  } else {
    logger = devLogger;
  }
  return logger;
};
