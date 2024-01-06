import type {
  CacheType,
  ChatInputCommandInteraction,
} from '@/features/library/index.js';
import { createTestEnv } from '@/features/others/testUtils/createTestEnv.js';

import { CommandBase } from './CommandBase.class.js';

createTestEnv();

describe('CommandBase', () => {
  class TestCommand extends CommandBase {
    public readonly name = 'test';
    public readonly description = 'test command';

    public async interact(): Promise<void> {
      // do nothing
    }
  }

  let command: TestCommand;

  beforeEach(() => {
    command = new TestCommand();
  });

  describe('register', () => {
    it('should return the command instance', () => {
      expect(command.register()).toBe(command);
    });
  });

  describe('isInteract', () => {
    it('should return true if the interaction command name matches the command name', () => {
      const interaction = { commandName: 'test' } as Readonly<
        ChatInputCommandInteraction<CacheType>
      >;
      expect(command.isInteract({ interaction })).toBe(true);
    });

    it('should return false if the interaction command name does not match the command name', () => {
      const interaction = { commandName: 'other' } as Readonly<
        ChatInputCommandInteraction<CacheType>
      >;
      expect(command.isInteract({ interaction })).toBe(false);
    });
  });
});
