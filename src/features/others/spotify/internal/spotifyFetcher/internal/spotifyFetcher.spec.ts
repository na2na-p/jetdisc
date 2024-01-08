/* eslint-disable @typescript-eslint/no-explicit-any */

import { type SpotifyToken } from '@/features/core/index.js';

import { spotifyFetcher } from './spotifyFetcher.func.js';

class MockedStore {
  tokens: Readonly<Partial<SpotifyToken>>;
  constructor(initData: any) {
    this.tokens = initData;
  }

  getSpotifyTokenByGuildId = vi.fn(() => this.tokens);

  putSpotifyTokenByGuildId = vi.fn(({ token }) => {
    this.tokens = {
      ...this.tokens,
      ...token,
      updatedAt: new Date(), // 新しい更新時間を設定
    };
  });
}
// テストケース
describe('spotifyFetcher', () => {
  it('should call fetch with correct arguments', async () => {
    const mockFetch = vi.fn(() => Promise.resolve({ ok: true }));
    const store = new MockedStore({
      access_token: 'token',
      expires_in: 3600,
      updatedAt: new Date(Date.now() - 1000),
    });
    await spotifyFetcher('test/endpoint', {
      store: store as any,
      guildId: '123',
      method: 'GET',
      fetchFn: mockFetch as any,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/test/endpoint',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer token',
          'Content-Type': 'application/json',
        },
        body: null,
      }
    );
  });

  it('should refresh the token if it is expired', async () => {
    const mockFetch = vi.fn(() => Promise.resolve({ ok: true }));
    const expiredTime = new Date(Date.now() - 3600 * 1000 - 1000); // 3600秒（1時間）+ 1秒前

    const store = new MockedStore({
      access_token: 'expired_token',
      refresh_token: 'refresh_token',
      expires_in: 3600, // トークンの有効期間は1時間
      updatedAt: new Date(expiredTime),
    });

    const mockRefresh = vi
      .fn()
      .mockImplementation(async ({ store, guildId }) => {
        // トークンを更新する
        store.putSpotifyTokenByGuildId({
          guildId,
          token: {
            access_token: 'new_token',
            refresh_token: 'new_refresh_token',
            expires_in: 3600,
            updatedAt: new Date(Date.now()),
          },
        });
      });

    await spotifyFetcher('test/endpoint', {
      store: store as any,
      guildId: '123',
      method: 'GET',
      fetchFn: mockFetch as any,
      refreshFn: mockRefresh as any,
    });

    expect(mockRefresh).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/test/endpoint',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer new_token',
          'Content-Type': 'application/json',
        },
        body: null,
      }
    );
  });

  it('should throw an error if authentication is required', async () => {
    const mockFetch = vi.fn(() => Promise.resolve({ ok: true }));
    const store = new MockedStore(undefined);

    await expect(
      spotifyFetcher('test/endpoint', {
        store: store as any,
        guildId: '123',
        method: 'GET',
        fetchFn: mockFetch as any,
      })
    ).rejects.toThrow('Authentication is required.');
  });
});
