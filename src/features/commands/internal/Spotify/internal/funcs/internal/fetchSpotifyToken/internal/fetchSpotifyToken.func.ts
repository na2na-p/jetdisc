import { GRANT_TYPE } from './fetchSpotifyToken.constants.js';
import type { SpotifyTokenResponse } from './fetchSpotifyToken.types.js';

export const fetchSpotifyToken = async ({
  code,
  spotifyCallbackUrl,
  spotifyClientId,
  spotifyClientSecret,
  type,
}: {
  /**
   * 認証URLのコールバックに付属するCodeかRefreshToken
   */
  code: string;
  spotifyCallbackUrl: string;
  spotifyClientId: string;
  spotifyClientSecret: string;
  type: (typeof GRANT_TYPE)[keyof typeof GRANT_TYPE];
}): Promise<SpotifyTokenResponse> => {
  const params = new URLSearchParams();
  params.append('grant_type', type);
  params.append('code', code);

  if (type === GRANT_TYPE.AuthorizationCode) {
    params.append('redirect_uri', spotifyCallbackUrl);
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${spotifyClientId}:${spotifyClientSecret}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  return (await response.json()) as SpotifyTokenResponse;
};
