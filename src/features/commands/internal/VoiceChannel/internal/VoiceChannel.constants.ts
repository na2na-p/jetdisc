import type { ApplicationCommandOptionData } from '@/features/library/index.js';
import { ApplicationCommandOptionType } from '@/features/library/index.js';

export const VoiceChannelCommandOptions = {
  join: {
    name: 'join',
    description: 'Join the voice channel.',
    type: ApplicationCommandOptionType.Subcommand,
  },
  leave: {
    name: 'leave',
    description: 'Leave the voice channel.',
    type: ApplicationCommandOptionType.Subcommand,
  },
} as const satisfies Record<string, ApplicationCommandOptionData>;
