import type { VoiceBasedChannel } from '@/features/library/index.js';

import { getJoinableStateStatus } from './getJoinableStateStatus.func.js';
import { JOINABLE_STATE_STATUS } from './getJoinableStateStatus.constants.js';

describe('getJoinableStateStatus', () => {
  it('should return NOT_FOUND if the channel is null', () => {
    const result = getJoinableStateStatus({ channel: null });

    expect(result).toBe(JOINABLE_STATE_STATUS.NOT_FOUND);
  });

  it('should return NOT_JOINABLE if the channel is not joinable', () => {
    const result = getJoinableStateStatus({
      channel: {
        joinable: false,
        client: { guilds: { cache: new Map() } },
        guildId: 'guildId',
      } as VoiceBasedChannel,
    });

    expect(result).toBe('NOT_JOINABLE');
  });

  it('should return NOT_VIEWABLE if the channel is not viewable', () => {
    const result = getJoinableStateStatus({
      channel: {
        joinable: true,
        viewable: false,
        client: { guilds: { cache: new Map() } },
        guildId: 'guildId',
      } as VoiceBasedChannel,
    });

    expect(result).toBe('NOT_VIEWABLE');
  });

  it('should return JOINABLE if the channel is joinable and viewable', () => {
    const result = getJoinableStateStatus({
      channel: {
        joinable: true,
        viewable: true,
        client: { guilds: { cache: new Map() } },
        guildId: 'guildId',
      } as VoiceBasedChannel,
    });

    expect(result).toBe(JOINABLE_STATE_STATUS.JOINABLE);
  });

  it('should return undefined if the voice state is not found', () => {
    const result = getJoinableStateStatus({
      channel: {
        joinable: true,
        viewable: true,
        client: {
          user: { id: 'userId' },
          guilds: {
            cache: new Map([
              [
                'guildId',
                {
                  voiceStates: {
                    cache: new Map([
                      ['userId', { voiceStates: { cache: new Map() } }],
                    ]),
                  },
                },
              ],
            ]),
          },
        },
        guildId: 'guildId',
      } as unknown as VoiceBasedChannel,
    });

    expect(result).toBe(JOINABLE_STATE_STATUS.ALREADY_JOINED);
  });
});
