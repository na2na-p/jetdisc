import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

import { STORE_TYPES } from '@/features/core/index.js';

const storeDriverKeys: ReadonlyArray<string> = Object.values(STORE_TYPES);

export const getConfig = () => {
  const envs = createEnv({
    server: {
      DISCORD_APP_TOKEN: z.string().min(1).readonly(),
      BOT_NAME: z.string().min(1).readonly(),
      SET_COMMANDS_TARGET_SERVERS: z.string().min(1).readonly(),
      STORE_DRIVER: z
        .string()
        .min(1)
        .refine(value => storeDriverKeys.includes(value))
        .readonly(),
    } as const,
    runtimeEnv: process.env,
  });

  return {
    ...envs,
    SET_COMMANDS_TARGET_SERVERS: envs.SET_COMMANDS_TARGET_SERVERS.split(','),
  } as const;
};
