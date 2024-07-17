import { Logger } from 'winston';

export abstract class Instrumentation {
  protected logger: Logger;

  protected constructor(
    protected serviceName: string,
    logger: Logger,
  ) {
    this.logger = logger.child({ serviceName: this.serviceName });
  }

  protected getLogger(): Logger {
    return this.logger;
  }

  info(message: string, logObj: object = {}) {
    this.getLogger().info(message, { ...logObj, service: this.serviceName });
  }

  debug(message: string, logObj: object = {}) {
    this.getLogger().debug(message, { ...logObj, service: this.serviceName });
  }

  warn(message: string, logObj: object = {}) {
    this.getLogger().warn(message, { ...logObj, service: this.serviceName });
  }

  error(message: string, logObj: object = {}) {
    this.getLogger().error(message, { ...logObj, service: this.serviceName });
  }
}