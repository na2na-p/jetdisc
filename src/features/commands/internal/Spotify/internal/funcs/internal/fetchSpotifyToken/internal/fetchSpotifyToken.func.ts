import { GRANT_TYPE } from './fetchSpotifyToken.constants.js';
import type { SpotifyTokenResponse } from './fetchSpotifyToken.types.js';

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
    }
  | {
      type: typeof GRANT_TYPE.RefreshToken;
      /**
       * RefreshToken
       */
      code: string;
      spotifyClientId: string;
      spotifyClientSecret: string;
    };

export const fetchSpotifyToken = async (
  params: FetchSpotifyTokenParams
): Promise<SpotifyTokenResponse> => {
  const urlParams = new URLSearchParams();
  urlParams.append('grant_type', params.type);
  urlParams.append('code', params.code);

  // GRANT_TYPE.AuthorizationCodeの場合にのみspotifyCallbackUrlを追加
  if (params.type === GRANT_TYPE.AuthorizationCode) {
    urlParams.append('redirect_uri', params.spotifyCallbackUrl);
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
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
