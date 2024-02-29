import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import { createContext } from './context';
import {
  appLogger,
  env,
  launchShutdownTasks,
  launchStartupTasks,
  redis,
} from './modules';
import { appRouter } from './routers/_app';
import { default as serveHandler } from 'serve-handler';
import { default as http } from 'http';
import path from 'path';

const _logger = appLogger.child({}, { msgPrefix: '[Entry] ' });

const serveHttp = http.createServer(async (request, response) =>
  serveHandler(request, response, {
    public: path.join(process.cwd(), '/uploads'),
  }),
);

serveHttp
  .listen(process.env.SERVE_PORT ?? 3002)
  .once('listening', () =>
    _logger.debug(`✅ Serve listening on ${env.NEXT_PUBLIC_SERVE_URL}`),
  )
  .once('error', (err) => _logger.error({ err }, '❌ Serve error'));

const wss = new ws.Server({ port: env.WS_PORT });
const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on('connection', (ws) => {
  _logger.debug(`🟢 WebSocket Connection (${wss.clients.size})`);
  ws.once('close', () => {
    _logger.debug(`🔴 WebSocket Connection (${wss.clients.size})`);
  });
});
_logger.debug(`✅ WebSocket Server listening on ${env.NEXT_PUBLIC_WS_URL}`);

redis
  .once('ready', async () => {
    _logger.debug(
      `✅ Redis Ready on redis://${redis.options.username}:****@${redis.options.host}:${redis.options.port}`,
    );

    await launchStartupTasks();
  })
  .once('close', () => {
    _logger.warn('🔴 Redis Close');
  })
  .on('error', (err) => {
    _logger.error({ err }, '❌ Redis Error');
  });

const gracefulShutdown = async () => {
  await launchShutdownTasks().finally(() => {
    handler.broadcastReconnectNotification();
    wss.close();
    serveHttp.close();
  });
};

process.once('SIGINT', async () => {
  _logger.warn('SIGINT');
  await gracefulShutdown();
  process.exit(0);
});

process.once('SIGTERM', async () => {
  _logger.warn('SIGTERM');
  await gracefulShutdown();
  process.exit(0);
});

process.once('uncaughtException', async (err) => {
  _logger.error({ err }, '🤬 Got uncaught exception, process will exit');
  await gracefulShutdown();
  process.exit(1);
});

process.once('unhandledRejection', async (err) => {
  _logger.error({ err }, '🤬 Got unhandled rejection, process will exit');
  await gracefulShutdown();
  process.exit(1);
});
