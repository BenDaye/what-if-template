import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { getSession } from 'next-auth/react';
import { prisma, redis } from './modules';
import { Session } from 'next-auth';

export interface CreateContextOptions {
  session: Session | null;
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export const createContext = async (
  opts: CreateNextContextOptions | CreateWSSContextFnOptions,
) => {
  const session = await getSession(opts);

  console.log('createContext for', session?.user?.username ?? 'unknown user');

  return {
    session,
    prisma,
    redis,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
