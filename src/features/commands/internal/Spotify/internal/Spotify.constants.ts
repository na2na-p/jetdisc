import type {
  ApplicationCommandOptionData,
  ApplicationCommandSubCommandData,
} from '@/features/library/index.js';
import { ApplicationCommandOptionType } from '@/features/library/index.js';

export const SpotifyAuthCommandOptions = {
  url: {
    name: 'url',
    description: 'Get the authentication URL.',
    type: ApplicationCommandOptionType.Subcommand,
  },
  token: {
    name: 'token',
    description: 'Get the access token.',
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: 'code',
        description: 'The code from the authentication URL.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
} as const satisfies Record<string, ApplicationCommandSubCommandData>;

export const SpotifyCommandOptions = {
  auth: {
    name: 'auth',
    description: 'Authenticate with Spotify.',
    type: ApplicationCommandOptionType.SubcommandGroup,
    options: Object.values(SpotifyAuthCommandOptions),
  },
} as const satisfies Record<string, ApplicationCommandOptionData>;
