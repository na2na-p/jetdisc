import type { VoiceBasedChannel } from '@/features/library/index.js';

import { checkJoinable } from './checkJoinable.func.js';

describe('checkJoinable', () => {
  it('should return NOT_FOUND if the channel is null', () => {
    const result = checkJoinable({ channel: null });

    expect(result).toBe('NOT_FOUND');
  });

  it('should return NOT_JOINABLE if the channel is not joinable', () => {
    const result = checkJoinable({
      channel: { joinable: false } as VoiceBasedChannel,
    });

    expect(result).toBe('NOT_JOINABLE');
  });

  it('should return NOT_VIEWABLE if the channel is not viewable', () => {
    const result = checkJoinable({
      channel: { joinable: true, viewable: false } as VoiceBasedChannel,
    });

    expect(result).toBe('NOT_VIEWABLE');
  });

  it('should return JOINABLE if the channel is joinable and viewable', () => {
    const result = checkJoinable({
      channel: { joinable: true, viewable: true } as VoiceBasedChannel,
    });

    expect(result).toBe('JOINABLE');
  });
});
