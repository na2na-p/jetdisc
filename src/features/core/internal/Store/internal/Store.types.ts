import type { SpotifyTokenResponse } from '@/features/others/spotify/index.js';

export type SpotifyToken = SpotifyTokenResponse & {
  updatedAt: Date;
};
