import { getStoreInstance } from '@/features/core/index.js';
import { LogicException } from '@/features/others/Error/LogicException.js';

import type { GetSpotifyOAuthToken } from './getSpotifyOAuthToken.types.js';
import { refresh } from './refresh.func.js';

/**
 * SpotifyのOAuthTokenを取得する
 * Tokenがexpiredしている場合は自動でrefreshする
 * 常に有効なTokenを返す
 */
export const getSpotifyOAuthToken: GetSpotifyOAuthToken = async ({
  store = getStoreInstance(),
  guildId,
  refreshFn = refresh,
}) => {
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

  store.putSpotifyTokenByGuildId({ guildId, token: tokens });

  return tokens.access_token;
};
