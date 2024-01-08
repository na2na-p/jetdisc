import { getStoreInstance } from '@/features/core/index.js';
import type { Guild } from '@/features/library/index.js';
import { getGuildFromInteraction } from '@/features/others/discord/index.js';
import {
  fetchSpotifyToken,
  GRANT_TYPE,
  spotifyFetcher,
} from '@/features/others/spotify/index.js';

import {
  SpotifyAuthCommandOptions,
  SpotifyCommandOptions,
  SpotifyPlayerCommandOptions,
} from './Spotify.constants.js';
import { getAuthUrl } from './funcs/index.js';
import type { InteractArgs } from '../../CommandBase/index.js';
import { CommandBase } from '../../CommandBase/index.js';

export class Spotify extends CommandBase {
  public readonly name = 'spotify';
  public readonly description = 'Using Spotify.';
  public override readonly options = Object.values(SpotifyCommandOptions);

  public override async interact({ interaction }: InteractArgs): Promise<void> {
    const store = getStoreInstance();
    const guild = getGuildFromInteraction({ interaction });

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
        {
          const code = interaction.options.getString('code');
          if (code === null) throw new Error('Unexpected null');
          const token = await fetchSpotifyToken({
            type: GRANT_TYPE.AuthorizationCode,
            code,
            spotifyCallbackUrl: this.config.SPOTIFY_AUTH_CALLBACK_URL,
            spotifyClientId: this.config.SPOTIFY_CLIENT_ID,
            spotifyClientSecret: this.config.SPOTIFY_CLIENT_SECRET,
          });
          store.putSpotifyTokenByGuildId({ guildId: guild.id, token });

          interaction.reply({
            content: 'Authenticated!',
            ephemeral: true,
          });
        }
        break;
      case SpotifyPlayerCommandOptions.stop.name: {
        const token = store.getSpotifyTokenByGuildId({ guildId: guild.id });
        if (token === undefined) {
          interaction.reply({
            content: 'You need to authenticate first.',
            ephemeral: true,
          });
          return;
        }
        await this.pauseSpotifyTrack({ guildId: guild.id });
        interaction.reply({
          content: 'Stopped!',
          ephemeral: true,
        });
        break;
      }
      default:
        throw new Error('Unexpected subcommand');
    }
  }

  /**
   * TODO あとで切り出すか消す
   */
  async pauseSpotifyTrack({
    guildId,
  }: {
    guildId: Guild['id'];
  }): Promise<void> {
    const response = await spotifyFetcher('me/player/pause', {
      guildId,
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error('Failed to pause Spotify track.');
    }
  }
}
