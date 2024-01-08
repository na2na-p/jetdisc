import type { Guild } from 'discord.js';

import { getGuildFromInteraction } from '@/features/others/discord/index.js';

import {
  SpotifyAuthCommandOptions,
  SpotifyCommandOptions,
  SpotifyPlayerCommandOptions,
} from './Spotify.constants.js';
import {
  fetchSpotifyToken,
  getAuthUrl,
  GRANT_TYPE,
  type SpotifyTokenResponse,
} from './funcs/index.js';
import type { InteractArgs } from '../../CommandBase/index.js';
import { CommandBase } from '../../CommandBase/index.js';

export class Spotify extends CommandBase {
  public readonly name = 'spotify';
  public readonly description = 'Using Spotify.';
  public override readonly options = Object.values(SpotifyCommandOptions);

  /**
   * TODO: Store系を一か所に集約してシングルトンの多用やめる
   */
  #tokens: {
    [key: Guild['id']]: SpotifyTokenResponse;
  } = {};

  public override async interact({ interaction }: InteractArgs): Promise<void> {
    switch (interaction.options.getSubcommand()) {
      case SpotifyAuthCommandOptions.url.name:
        const authUrl = getAuthUrl({
          state: this.config.CLIENT_ID,
          redirectUri: this.config.SPOTIFY_AUTH_CALLBACK_URL,
          spotifyClientId: this.config.SPOTIFY_CLIENT_ID,
        });
        interaction.reply({
          content: authUrl,
          ephemeral: true,
        });
        break;
      case SpotifyAuthCommandOptions.token.name:
        const code = interaction.options.getString('code');
        if (code === null) throw new Error('Unexpected null');
        this.#tokens[getGuildFromInteraction({ interaction }).id] =
          await fetchSpotifyToken({
            type: GRANT_TYPE.AuthorizationCode,
            code,
            spotifyCallbackUrl: this.config.SPOTIFY_AUTH_CALLBACK_URL,
            spotifyClientId: this.config.SPOTIFY_CLIENT_ID,
            spotifyClientSecret: this.config.SPOTIFY_CLIENT_SECRET,
          });

        interaction.reply({
          content: 'Authenticated!',
          ephemeral: true,
        });
        break;
      case SpotifyPlayerCommandOptions.stop.name:
        const token = this.#tokens[getGuildFromInteraction({ interaction }).id];
        if (token === undefined) {
          interaction.reply({
            content: 'You need to authenticate first.',
            ephemeral: true,
          });
          return;
        }
        await this.pauseSpotifyTrack({ token });
        interaction.reply({
          content: 'Stopped!',
          ephemeral: true,
        });
        break;
      default:
        throw new Error('Unexpected subcommand');
    }
  }

  /**
   * TODO あとで切り出すか消す
   */
  async pauseSpotifyTrack({
    token,
  }: {
    token: SpotifyTokenResponse;
  }): Promise<void> {
    const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
      },
    });
    // expiredしてたらrefreshする
    if (response.status === 401) {
      const refreshedToken = await fetchSpotifyToken({
        type: GRANT_TYPE.RefreshToken,
        code: token.refresh_token,
        spotifyClientId: this.config.SPOTIFY_CLIENT_ID,
        spotifyClientSecret: this.config.SPOTIFY_CLIENT_SECRET,
      });
      await this.pauseSpotifyTrack({ token: refreshedToken });
    }
  }
}
