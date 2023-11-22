import type { MockedFunction } from 'vitest';

import type {
  ChatInputCommandInteraction,
  Guild,
} from '@/features/library/index.js';
import { isNil } from '@/features/library/index.js';
import { getGuildFromInteraction } from '@/features/others/discord/index.js';

import { getActorId } from './getActorId.func.js';

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
} as unknown as Guild;

const fakeInteraction = {
  member: { user: { id: '123' } },
} as ChatInputCommandInteraction;

// TODO: 命名変更に追従する
describe('getActorId', () => {
  it('should fetch the member ID from the interaction', async () => {
    (
      getGuildFromInteraction as MockedFunction<typeof getGuildFromInteraction>
    ).mockReturnValue(mockedGuild);

    const result = await getActorId(fakeInteraction);

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

    (isNil as unknown as MockedFunction<typeof isNil>).mockReturnValue(true);

    await expect(getActorId(fakeInteraction)).rejects.toThrow(
      'Member is null.'
    );
  });
});
