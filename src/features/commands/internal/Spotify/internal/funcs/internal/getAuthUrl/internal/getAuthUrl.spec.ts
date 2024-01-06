import { APPLICATION_SCOPES } from './getAuthUrl.constants.js';
import { getAuthUrl } from './getAuthUrl.func.js';

describe('getAuthUrl Function', () => {
  it('should return the correct URL format with custom parameters', () => {
    const state = 'teststate';
    const spotifyClientId = 'testclientid';
    const applicationScopes = ['scope1', 'scope2'];
    const redirectUri = 'http://example.com';

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
    const redirectUri = 'http://example.com';

    const expectedUrl = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=code&redirect_uri=${encodeURI(
      'http://example.com'
    )}&scope=${APPLICATION_SCOPES.join('+')}&state=${state}`;
    const url = getAuthUrl({ state, spotifyClientId, redirectUri });

    expect(url).toBe(expectedUrl);
    expect(() => new URL(url)).not.toThrow();
  });
});
