import { getAuthUrl } from './getAuthUrl.func.js';
import { APPLICATION_SCOPES, REDIRECT_URI } from './getAuthUrl.constants.js';

describe('getAuthUrl Function', () => {
  it('should return the correct URL format with custom parameters', () => {
    const state = 'teststate';
    const spotifyClientId = 'testclientid';
    const applicationScopes = ['scope1', 'scope2'];
    const redirectUri = 'http://testredirect.com';

    const expectedUrl = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=code&redirect_uri=${encodeURI(
      redirectUri
    )}&scope=${applicationScopes.join('+')}&state=${state}`;
    const url = getAuthUrl({
      state,
      spotifyClientId,
      applicationScopes,
      redirectUri,
    });

    expect(url).toBe(expectedUrl);
    expect(() => new URL(url)).not.toThrow();
  });

  it('should use default values for applicationScopes and redirectUri if they are not provided', () => {
    const state = 'defaulttest';
    const spotifyClientId = 'defaultclientid';

    const expectedUrl = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=code&redirect_uri=${encodeURI(
      REDIRECT_URI
    )}&scope=${APPLICATION_SCOPES.join('+')}&state=${state}`;
    const url = getAuthUrl({ state, spotifyClientId });

    expect(url).toBe(expectedUrl);
    expect(() => new URL(url)).not.toThrow();
  });
});
