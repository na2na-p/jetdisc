import { isNil, type VoiceBasedChannel } from '@/features/library/index.js';

import { JOINABLE_TYPE_MAP } from './checkJoinable.constants.js';

export const checkJoinable = ({
  channel,
}: {
  channel: VoiceBasedChannel | null;
}): (typeof JOINABLE_TYPE_MAP)[keyof typeof JOINABLE_TYPE_MAP] => {
  if (isNil(channel)) {
    return JOINABLE_TYPE_MAP.NOT_FOUND;
  } else if (!channel.joinable) {
    return JOINABLE_TYPE_MAP.NOT_JOINABLE;
  } else if (!channel.viewable) {
    return JOINABLE_TYPE_MAP.NOT_VIEWABLE;
  } else {
    return JOINABLE_TYPE_MAP.JOINABLE;
  }
};
