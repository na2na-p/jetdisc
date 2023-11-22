import { isNil, type VoiceBasedChannel } from '@/features/library/index.js';

import { JOINABLE_STATE_STATUS } from './getJoinableStateStatus.constants.js';

export const getJoinableStateStatus = ({
  channel,
}: {
  channel: VoiceBasedChannel | null;
}): (typeof JOINABLE_STATE_STATUS)[keyof typeof JOINABLE_STATE_STATUS] => {
  if (isNil(channel)) {
    return JOINABLE_STATE_STATUS.NOT_FOUND;
  } else if (!channel.joinable) {
    return JOINABLE_STATE_STATUS.NOT_JOINABLE;
  } else if (!channel.viewable) {
    return JOINABLE_STATE_STATUS.NOT_VIEWABLE;
  } else {
    return JOINABLE_STATE_STATUS.JOINABLE;
  }
};
