import { isNil, type VoiceBasedChannel } from '@/features/library/index.js';

import { JOINABLE_STATE_STATUS } from './getJoinableStateStatus.constants.js';

/**
 * TODO: ALREADY_JOINEDのパターン作る
 */
export const getJoinableStateStatus = ({
  channel,
}: {
  channel: VoiceBasedChannel | null;
}): (typeof JOINABLE_STATE_STATUS)[keyof typeof JOINABLE_STATE_STATUS] => {
  if (isNil(channel)) {
    return JOINABLE_STATE_STATUS.NOT_FOUND;
  } else {
    // getVoiceConnectionやgetVoiceConnectionsを利用せずに、自身がjoinしているかどうかを判定する
    const client = channel.client;
    const guildId = channel.guildId;

    const voiceState = (() => {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) return undefined;
      return guild.voiceStates.cache.get(client.user.id);
    })();

    if (!channel.joinable) {
      return JOINABLE_STATE_STATUS.NOT_JOINABLE;
    } else if (!channel.viewable) {
      return JOINABLE_STATE_STATUS.NOT_VIEWABLE;
    } else if (voiceState) {
      return JOINABLE_STATE_STATUS.ALREADY_JOINED;
    } else {
      return JOINABLE_STATE_STATUS.JOINABLE;
    }
  }
};
