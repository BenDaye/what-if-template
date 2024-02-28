import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { Logger, multistream, pino } from 'pino';
import pretty from 'pino-pretty';
import { env } from './env';

const LOG_DIR = path.join(process.cwd(), 'logs');
if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}

const pinoGlobal = global as typeof global & {
  appLogger?: Logger;
};

export const appLogger: Logger =
  pinoGlobal?.appLogger ??
  pino(
    { msgPrefix: '[App] ' },
    multistream([
      { stream: pretty({ colorize: true, singleLine: true }), level: 'debug' },
      {
        stream: pretty({
          colorize: false,
          mkdir: true,
          destination: path.join(LOG_DIR, 'app.log'),
        }),
        level: 'warn',
      },
    ]),
  );

if (env.NODE_ENV !== 'production') {
  pinoGlobal.appLogger = appLogger;
}
