import { appLogger } from './pino';

const startupTasks: PromiseLike<any>[] = [];

export const launchStartupTasks = async () => {
  await Promise.all(startupTasks)
    .then(() => {
      appLogger.info('✅ All startup tasks done');
    })
    .catch((err) => {
      appLogger.error({ err }, '❌ Some startup tasks failed');
    });
};

const shutdownTasks: PromiseLike<any>[] = [];

export const launchShutdownTasks = async () => {
  await Promise.all(shutdownTasks)
    .then(() => {
      appLogger.info('✅ All shutdown tasks done');
    })
    .catch((err) => {
      appLogger.error({ err }, '❌ Some shutdown tasks failed');
    });
};
