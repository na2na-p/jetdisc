import { z } from 'zod';

import type { ApplicationCommandOptionData } from '@/features/library/index.js';
import { ApplicationCommandOptionType } from '@/features/library/index.js';

export const YouTubeCommandOptions = {
  play: {
    name: 'play',
    description: 'Play the YouTube video immediately.',
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: 'url',
        description: 'The YouTube URL',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  stop: {
    name: 'stop',
    description: 'stop the voice channel.',
    type: ApplicationCommandOptionType.Subcommand,
  },
} as const satisfies Record<string, ApplicationCommandOptionData>;

export const YOUTUBE_URL_VALIDATION_SCHEMA = z.string().url().min(1);
