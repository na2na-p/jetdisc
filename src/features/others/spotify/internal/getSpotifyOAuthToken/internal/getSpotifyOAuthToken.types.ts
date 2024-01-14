import type { Store } from '@/features/core/index.js';
import type { Guild } from '@/features/library/index.js';

import type { refresh } from './refresh.func.js';

export type GetSpotifyOAuthToken = (args: {
  store?: Store;
  guildId: Guild['id'];
  refreshFn?: typeof refresh;
}) => Promise<string>;
