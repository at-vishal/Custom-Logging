// File: utils/logger.ts

import { createLogger, Logger, transports, format } from 'winston';
import { LogLevel, LogOptions } from './config';

export function createWinstonLogger({ logLevel }: { logLevel: LogLevel }): Logger {
  return createLogger({
    level: logLevel,
    format: format.combine(
      format.colorize(),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS',
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.printf(({ timestamp, level, trackingId, message, service, stack, error, data }) => {
        return `[${timestamp}] ${service || ''} ${level}: ${trackingId || ''} ${message} ${stack || ''} ${error || ''} ${data || ''}`;
      }),
    ),
    transports: [
      new transports.Console(),
      new transports.File({ dirname: 'logs', filename: 'server.log' }),
      new transports.File({ dirname: 'logs/error', filename: 'error.log', level: 'error' }),
    ],
  });
}

const logger = createWinstonLogger({ logLevel: process.env.LOG_LEVEL as LogLevel || 'info' });

export function createInstrumentation(serviceName: string) {
  const serviceLogger = logger.child({ service: serviceName });

  return {
    info: (message: string, logObj: object = {}) => serviceLogger.info(message, logObj),
    error: (message: string, logObj: object = {}) => serviceLogger.error(message, logObj),
    warn: (message: string, logObj: object = {}) => serviceLogger.warn(message, logObj),
    debug: (message: string, logObj: object = {}) => serviceLogger.debug(message, logObj),
  };
}

//decorator---------------------------

export function Log(options: LogOptions = {}): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor | void {
    const originalMethod = descriptor.value;
    const className = (target as any).constructor.name;
    const logger = createInstrumentation(className);

    descriptor.value = async function(...args: any[]) {
      const {
        level = 'debug',
        message = `Executing ${String(propertyKey)}`,
        logArgs = true,
        logResult = true,
        logError = true,
        logValue
      } = options;

      logger[level](message);

      if (logArgs) {
        logger.debug(`${String(propertyKey)} arguments:`, args);
      }

      if (logValue) {
        const valueToLog = logValue(...args);
        logger[level](`Custom log value for ${String(propertyKey)}:`, valueToLog);
      }

      try {
        const result = await originalMethod.apply(this, args);
        
        if (logResult) {
          logger[level](`${String(propertyKey)} returned:`, result);
        }

        return result;
      } catch (error: any) {
        if (logError) {
          logger.error(`Error in ${String(propertyKey)}:`, error);
        }
        throw error;
      }
    };

    return descriptor;
  };
}