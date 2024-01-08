import type { Guild } from '@/features/library/index.js';
import type { SpotifyTokenResponse } from '@/features/others/spotify/index.js';

import type { SpotifyToken } from './Store.types.js';

export class Store {
  #spotifyTokens: {
    [key: Guild['id']]: SpotifyToken;
  } = {};

  public putSpotifyTokenByGuildId({
    guildId,
    token,
  }: {
    guildId: Guild['id'];
    token: SpotifyTokenResponse;
  }) {
    this.#spotifyTokens[guildId] = {
      ...token,
      updatedAt: new Date(),
    };
  }

  public getSpotifyTokenByGuildId({
    guildId,
  }: {
    guildId: Guild['id'];
  }): SpotifyToken | undefined {
    return this.#spotifyTokens[guildId];
  }
}
