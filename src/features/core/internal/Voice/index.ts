import { singleton } from '@/features/others/singleton/index.js';

import { Voice } from './internal/Voice.class.js';

export type { Voice } from './internal/Voice.class.js';
export type { ConnectionState } from './internal/Voice.types.js';
export {
  getJoinableStateStatus,
  JOINABLE_STATE_STATUS,
} from './internal/funcs/getJoinableStateStatus/index.js';
export { getActorConnectionState } from './internal/funcs/getActorConnectionState/index.js';

const createVoiceInstance = () => new Voice();
export const getVoiceInstance = singleton(createVoiceInstance);
