export const STORE_TYPES = {
  IN_MEMORY: 'local',
  REDIS: 'redis',
} as const satisfies Record<string, string>;
