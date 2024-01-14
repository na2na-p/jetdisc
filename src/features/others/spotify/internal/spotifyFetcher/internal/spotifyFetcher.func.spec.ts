import { spotifyFetcher } from './spotifyFetcher.func.js';

vi.mock('@/features/others/spotify/index.js', () => ({
  getSpotifyOAuthToken: vi.fn().mockResolvedValue('mockedToken'),
}));

describe('spotifyFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make a GET request with the correct headers', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      statusText: 'OK',
    });

    const response = await spotifyFetcher('/v1/endpoint', {
      method: 'GET',
      guildId: '123',
      fetchFn,
    });

    expect(fetchFn).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/endpoint',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer mockedToken',
          'Content-Type': 'application/json',
        },
        body: null,
      }
    );

    expect(response).toEqual({
      ok: true,
      statusText: 'OK',
    });
  });

  it('should throw an error if the response is not ok', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(
      spotifyFetcher('/endpoint', {
        method: 'GET',
        guildId: '123',
        fetchFn,
      })
    ).rejects.toThrow('Failed to fetch Spotify API: Not Found');
  });
});
