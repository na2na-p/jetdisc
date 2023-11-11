import type { CommandBase } from '@/features/commands/index.js';
import type { getConfig } from '@/features/config/index.js';

export type ClassConstructorArgs = {
  config: ReturnType<typeof getConfig>;
  commands: ReadonlyArray<CommandBase>;
};
