import type { SpotifyTokenResponse } from '@/features/others/spotify/index.js';

import { GRANT_TYPE } from './fetchSpotifyToken.constants.js';

type FetchSpotifyTokenParams =
  | {
      type: typeof GRANT_TYPE.AuthorizationCode;
      /**
       * 認証URLのコールバックに付属するCode
       */
      code: string;
      spotifyClientId: string;
      spotifyClientSecret: string;
      spotifyCallbackUrl: string;
      fetchFn?: typeof fetch;
    }
  | {
      type: typeof GRANT_TYPE.RefreshToken;
      /**
       * RefreshToken
       */
      code: string;
      spotifyClientId: string;
      spotifyClientSecret: string;
      fetchFn?: typeof fetch;
    };

/**
 * TODO: エラーハンドリング
 */
export const fetchSpotifyToken = async ({
  fetchFn = fetch,
  ...params
}: FetchSpotifyTokenParams): Promise<SpotifyTokenResponse> => {
  const urlParams = new URLSearchParams();
  urlParams.append('grant_type', params.type);
  urlParams.append('code', params.code);

  // GRANT_TYPE.AuthorizationCodeの場合にのみspotifyCallbackUrlを追加
  if (params.type === GRANT_TYPE.AuthorizationCode) {
    urlParams.append('redirect_uri', params.spotifyCallbackUrl);
  }

  const response = await fetchFn('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${params.spotifyClientId}:${params.spotifyClientSecret}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlParams,
  });

  return (await response.json()) as SpotifyTokenResponse;
};
