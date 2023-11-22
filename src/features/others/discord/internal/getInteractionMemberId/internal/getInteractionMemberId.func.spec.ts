import type { Mock } from 'vitest';

import type { ChatInputCommandInteraction } from '@/features/library/index.js';
import { isNil } from '@/features/library/index.js';
import { getGuildFromInteraction } from '@/features/others/discord/index.js';

import { getInteractionMemberId } from './getInteractionMemberId.func.js';

vi.mock('@/features/library/index.js', () => {
  return {
    isNil: vi.fn(),
  };
});

vi.mock('@/features/others/discord/index.js', () => {
  return {
    getGuildFromInteraction: vi.fn(),
  };
});

const mockedGuild = {
  members: {
    fetch: vi.fn().mockResolvedValue('mocked member'),
  },
} as const;

const fakeInteraction = {
  member: { user: { id: '123' } },
} as ChatInputCommandInteraction;

describe('getInteractionMemberId', () => {
  it('should fetch the member ID from the interaction', async () => {
    (getGuildFromInteraction as unknown as Mock).mockReturnValue(mockedGuild);

    const result = await getInteractionMemberId(fakeInteraction);

    expect(getGuildFromInteraction).toHaveBeenCalledWith({
      interaction: fakeInteraction,
    });
    expect(mockedGuild.members.fetch).toHaveBeenCalledWith('123');
    expect(result).toBe('mocked member');
  });

  it('should throw an error if the member is null', async () => {
    const fakeInteraction = {
      member: null,
    } as ChatInputCommandInteraction;

    (isNil as unknown as Mock).mockReturnValue(true);

    await expect(getInteractionMemberId(fakeInteraction)).rejects.toThrow(
      'Member is null.'
    );
  });
});
