import type { CommandBase } from '@/features/commands/index.js';
import type { getConfig } from '@/features/config/index.js';
import type { Store } from '@/features/core/index.js';

export type ClassConstructorArgs = {
  config: ReturnType<typeof getConfig>;
  commands: ReadonlyArray<new ({ store }: { store: Store }) => CommandBase>;
  StoreDriver: Store;
};
