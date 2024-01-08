import { getConfig } from '@/features/config/index.js';
import {
  getStoreInstance,
  type SpotifyToken,
  type Store,
} from '@/features/core/index.js';
import type { Guild } from '@/features/library/index.js';
import { LogicException } from '@/features/others/Error/LogicException.js';

import {
  fetchSpotifyToken,
  GRANT_TYPE,
} from '../../fetchSpotifyToken/index.js';

type RequestMethod = {
  Delete: 'DELETE';
  Get: 'GET';
  Patch: 'PATCH';
  Post: 'POST';
  Put: 'PUT';
};

export type SpotifyFetcher = (
  endpoint: string,
  options: {
    store?: Store;
    method: RequestMethod[keyof RequestMethod];
    guildId: Guild['id'];
    body?: URLSearchParams;
    apiBaseUrl?: string;
    fetchFn?: typeof fetch;
    refreshFn?: typeof refresh;
  }
) => Promise<Response>;

/**
 * Spotify専用のfetcher
 * Tokenがexpiredしている場合は自動でrefreshする
 */
export const spotifyFetcher: SpotifyFetcher = async (
  endpoint,
  {
    store = getStoreInstance(),
    apiBaseUrl = 'https://api.spotify.com/v1',
    guildId,
    method,
    body,
    fetchFn = fetch,
    refreshFn = refresh,
  }
) => {
  // NOTE: リフレッシュしたら書き換えが走るためlet
  let tokens = store.getSpotifyTokenByGuildId({ guildId });

  if (tokens === undefined) {
    throw new Error('Authentication is required.');
  }

  // expires_inは発行からの経過秒数で表現される
  // 現在時刻とupdatedAtの差分がexpires_inより大きい場合はrefreshが必要
  const shouldRefresh =
    tokens.expires_in * 1000 + tokens.updatedAt.getTime() < Date.now();

  if (shouldRefresh) {
    await refreshFn({ tokens, store, guildId });
  }

  // NOTE: 以降はスコープ内で書き換えることはないため
  tokens = Object.freeze(store.getSpotifyTokenByGuildId({ guildId }));
  if (tokens === undefined) {
    throw new LogicException('tokens is undefined.');
  }

  const requestHeader = {
    Authorization: `Bearer ${tokens.access_token}`,
    'Content-Type': 'application/json',
  } as const;

  const response = await fetchFn(`${apiBaseUrl}/${endpoint}`, {
    method,
    headers: requestHeader,
    body: body ?? null,
  });

  if (!response.ok) {
    throw new LogicException(
      `Failed to fetch Spotify API: ${response.statusText}`
    );
  }

  return response;
};

const refresh = async ({
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
