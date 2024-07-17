import fs from 'fs';
import path from 'path';

export const LogLevels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'] as const;
export type LogLevel = typeof LogLevels[number];


export const Environments = ['development', 'production', 'test'] as const;
export type Environment = typeof Environments[number];

export interface Config {
  logLevel: LogLevel;
  logDir: string;
  errorLogDir: string;
  env: Environment;
}

export interface LogOptions {
  level?: 'info' | 'error' | 'warn' | 'debug';
  message?: string;
  logArgs?: boolean;
  logResult?: boolean;
  logError?: boolean;
  logValue?: (...args: any[]) => any;
}







export const loadConfig = (): Config => {
  const configPath = path.resolve(__dirname, 'config.json');
  const rawConfig = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(rawConfig) as Config;

  if (!LogLevels.includes(config.logLevel)) {
    throw new Error(`Invalid log level: ${config.logLevel}`);
  }

  if (!Environments.includes(config.env)) {
    throw new Error(`Invalid environment: ${config.env}`);
  }

  return config;
};