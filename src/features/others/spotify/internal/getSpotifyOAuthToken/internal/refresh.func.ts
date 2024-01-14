import { getConfig } from '@/features/config/index.js';
import type { SpotifyToken, Store } from '@/features/core/index.js';
import type { Guild } from '@/features/library/index.js';

import {
  GRANT_TYPE,
  fetchSpotifyToken,
} from '../../fetchSpotifyToken/index.js';

export const refresh = async ({
  tokens,
  store,
  guildId,
  config = getConfig(),
}: {
  tokens: SpotifyToken;
  store: Store;
  guildId: Guild['id'];
  config?: ReturnType<typeof getConfig>;
}): Promise<void> => {
  const token = await fetchSpotifyToken({
    type: GRANT_TYPE.RefreshToken,
    code: tokens.refresh_token,
    spotifyClientId: config.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: config.SPOTIFY_CLIENT_SECRET,
  });
  store.putSpotifyTokenByGuildId({ guildId, token });
};
