import { APPLICATION_SCOPES } from './getAuthUrl.constants.js';
import type { GetAuthUrl } from './getAuthUrl.types.js';

export const getAuthUrl: GetAuthUrl = ({
  state,
  spotifyClientId,
  applicationScopes = APPLICATION_SCOPES,
  redirectUri,
}) => {
  return `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=code&redirect_uri=${encodeURI(
    redirectUri
  )}&scope=${applicationScopes.join('+')}&state=${state}`;
};
