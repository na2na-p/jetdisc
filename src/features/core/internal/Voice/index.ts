import { singleton } from '@/features/others/singleton/index.js';
import { getActorConnectionState } from './internal/funcs/getActorConnectionState/index.js';

import { Voice } from './internal/Voice.class.js';

export type { Voice } from './internal/Voice.class.js';
export type { ConnectionState } from './internal/Voice.types.js';
export {
  getJoinableStateStatus,
  JOINABLE_STATE_STATUS,
} from './internal/funcs/getJoinableStateStatus/index.js';
export { getActorConnectionState };

const createVoiceInstance = () =>
  new Voice({
    getActorConnectionState: getActorConnectionState,
  });
export const getVoiceInstance = singleton(createVoiceInstance);
