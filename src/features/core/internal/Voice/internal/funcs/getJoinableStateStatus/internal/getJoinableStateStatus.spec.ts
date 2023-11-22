import type { VoiceBasedChannel } from '@/features/library/index.js';

import { getJoinableStateStatus } from './getJoinableStateStatus.func.js';

describe('getJoinableStateStatus', () => {
  it('should return NOT_FOUND if the channel is null', () => {
    const result = getJoinableStateStatus({ channel: null });

    expect(result).toBe('NOT_FOUND');
  });

  it('should return NOT_JOINABLE if the channel is not joinable', () => {
    const result = getJoinableStateStatus({
      channel: { joinable: false } as VoiceBasedChannel,
    });

    expect(result).toBe('NOT_JOINABLE');
  });

  it('should return NOT_VIEWABLE if the channel is not viewable', () => {
    const result = getJoinableStateStatus({
      channel: { joinable: true, viewable: false } as VoiceBasedChannel,
    });

    expect(result).toBe('NOT_VIEWABLE');
  });

  it('should return JOINABLE if the channel is joinable and viewable', () => {
    const result = getJoinableStateStatus({
      channel: { joinable: true, viewable: true } as VoiceBasedChannel,
    });

    expect(result).toBe('JOINABLE');
  });
});
