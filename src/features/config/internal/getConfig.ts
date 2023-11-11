import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const getConfig = () => {
  return createEnv({
    server: {
      DISCORD_APP_TOKEN: z.string().min(1).readonly(),
      BOT_NAME: z.string().min(1).readonly(),
    } as const,
    runtimeEnv: process.env,
  });
};
