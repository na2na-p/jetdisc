import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const getConfig = () => {
  const envs = createEnv({
    server: {
      DISCORD_APP_TOKEN: z.string().min(1).readonly(),
      BOT_NAME: z.string().min(1).readonly(),
      SET_COMMANDS_TARGET_SERVERS: z.string().min(1).readonly(),
      SPOTIFY_CLIENT_ID: z.string().min(1).readonly(),
      SPOTIFY_CLIENT_SECRET: z.string().min(1).readonly(),
    } as const,
    runtimeEnv: process.env,
  });

  return {
    ...envs,
    SET_COMMANDS_TARGET_SERVERS: envs.SET_COMMANDS_TARGET_SERVERS.split(','),
  } as const;
};
