import type { CommandBase } from '@/features/commands/index.js';
import type { getConfig } from '@/features/config/index.js';
import type { STORE_TYPES } from '@/features/core/index.js';

export type ClassConstructorArgs = {
  config: ReturnType<typeof getConfig>;
  commands: ReadonlyArray<CommandBase>;
  storeDriver: keyof typeof STORE_TYPES;
};
