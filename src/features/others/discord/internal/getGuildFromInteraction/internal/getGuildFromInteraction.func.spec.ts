import type {
  ChatInputCommandInteraction,
  Guild,
} from '@/features/library/index.js';

import { getGuildFromInteraction } from './getGuildFromInteraction.func.js';

describe('getGuildFromInteraction', () => {
  it('should throw an error if guild is null', () => {
    const interaction = {
      guild: null,
    } as unknown as Readonly<ChatInputCommandInteraction>;

    expect(() => getGuildFromInteraction({ interaction })).toThrowError(
      'Guild is null.'
    );
  });

  it('should return the guild if it is not null', () => {
    const guild = {} as Guild;
    const interaction = {
      guild,
    } as unknown as Readonly<ChatInputCommandInteraction>;

    expect(getGuildFromInteraction({ interaction })).toBe(guild);
  });
});
