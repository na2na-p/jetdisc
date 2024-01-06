import {
  SpotifyAuthCommandOptions,
  SpotifyCommandOptions,
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
  #tokens: Array<SpotifyTokenResponse> = [];

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
        const token = await fetchSpotifyToken({
          type: GRANT_TYPE.AuthorizationCode,
          code,
          spotifyCallbackUrl: this.config.SPOTIFY_AUTH_CALLBACK_URL,
          spotifyClientId: this.config.SPOTIFY_CLIENT_ID,
          spotifyClientSecret: this.config.SPOTIFY_CLIENT_SECRET,
        });
        this.#tokens.push(token);

        interaction.reply({
          content: 'Authenticated!',
          ephemeral: true,
        });
        break;
      default:
        throw new Error('Unexpected subcommand');
    }
  }
}
