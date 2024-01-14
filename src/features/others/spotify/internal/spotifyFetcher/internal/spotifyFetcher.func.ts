import { type Store } from '@/features/core/index.js';
import type { Guild } from '@/features/library/index.js';
import { LogicException } from '@/features/others/Error/LogicException.js';
import { getSpotifyOAuthToken } from '@/features/others/spotify/index.js';

type RequestMethod = {
  Delete: 'DELETE';
  Get: 'GET';
  Patch: 'PATCH';
  Post: 'POST';
  Put: 'PUT';
};

export type SpotifyFetcher = (
  endpoint: `/${string}`,
  options: {
    store?: Store;
    method: RequestMethod[keyof RequestMethod];
    guildId: Guild['id'];
    body?: URLSearchParams;
    apiBaseUrl?: string;
    fetchFn?: typeof fetch;
  }
) => Promise<Response>;

/**
 * Spotify専用のfetcher
 * Tokenがexpiredしている場合は自動でrefreshする
 */
export const spotifyFetcher: SpotifyFetcher = async (
  endpoint,
  {
    apiBaseUrl = 'https://api.spotify.com',
    guildId,
    method,
    body,
    fetchFn = fetch,
  }
) => {
  const token = await getSpotifyOAuthToken({
    guildId,
  });

  const requestHeader = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  } as const;

  const response = await fetchFn(`${apiBaseUrl}${endpoint}`, {
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
