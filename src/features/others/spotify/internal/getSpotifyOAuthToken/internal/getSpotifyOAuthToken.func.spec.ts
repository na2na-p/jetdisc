/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSpotifyOAuthToken } from './getSpotifyOAuthToken.func.js';

describe('getSpotifyOAuthToken', () => {
  it('should throw an error if tokens are undefined', async () => {
    const mockStore = {
      getSpotifyTokenByGuildId: vi.fn(() => undefined),
    };

    await expect(
      getSpotifyOAuthToken({
        store: mockStore as any,
        guildId: '123',
      })
    ).rejects.toThrow('Authentication is required.');
  });

  it('should refresh tokens if they are expired', async () => {
    const mockStore = {
      getSpotifyTokenByGuildId: vi.fn(() => ({
        access_token: 'token',
        expires_in: 3600,
        updatedAt: new Date(Date.now() - 3600 * 1000 - 1000),
      })),
      putSpotifyTokenByGuildId: vi.fn(),
    };

    const mockRefreshFn = vi.fn();

    await getSpotifyOAuthToken({
      store: mockStore as any,
      guildId: '123',
      refreshFn: mockRefreshFn,
    });

    expect(mockRefreshFn).toHaveBeenCalled();
  });

  it('should return the access token', async () => {
    const mockStore = {
      getSpotifyTokenByGuildId: vi.fn(() => ({
        access_token: 'token',
        expires_in: 3600,
        updatedAt: new Date(),
      })),
      putSpotifyTokenByGuildId: vi.fn(),
    };

    const result = await getSpotifyOAuthToken({
      store: mockStore as any,
      guildId: '123',
    });

    expect(result).toBe('token');
  });
});
