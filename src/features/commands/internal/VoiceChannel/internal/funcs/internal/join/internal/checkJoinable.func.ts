import {
  isNil,
  type InteractionReplyOptions,
  type VoiceBasedChannel,
} from '@/features/library/index.js';

export const checkJoinable = ({
  channel,
}: {
  channel: VoiceBasedChannel | null;
}): Pick<InteractionReplyOptions, 'content' | 'ephemeral'> | true => {
  if (isNil(channel)) {
    return {
      content: '接続先のVCが見つかりません。',
      ephemeral: false,
    };
  } else if (!channel.joinable) {
    // やっぱりchannelの型が謎
    return {
      content: '接続先のVCに参加できません。権限の見直しをしてください。',
      ephemeral: true,
    };
  } else if (!channel.viewable) {
    // channelの型が謎
    return {
      content: '接続先のVCに参加できません。権限の見直しをしてください。',
      ephemeral: true,
    };
  } else {
    return true;
  }
};
