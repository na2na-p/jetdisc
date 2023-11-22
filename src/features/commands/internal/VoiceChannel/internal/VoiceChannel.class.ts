import { Voice } from '@/features/core/index.js';
import { LogicException } from '@/features/others/Error/LogicException.js';

import { VoiceChannelCommandOptions } from './VoiceChannel.constants.js';
import type { InteractArgs } from '../../CommandBase/index.js';
import { CommandBase } from '../../CommandBase/index.js';

export class VoiceChannel extends CommandBase {
  public readonly name = 'vc';
  public readonly description = 'Voice channel commands.';
  public override readonly options = Object.values(VoiceChannelCommandOptions);

  public override async interact({ interaction }: InteractArgs): Promise<void> {
    const subcommand = interaction.options.getSubcommand();
    const voice = Voice.getInstance();

    switch (subcommand) {
      case VoiceChannelCommandOptions.join.name:
        if (await voice.join({ interaction })) interaction.reply('Joined.');
        break;
      case VoiceChannelCommandOptions.leave.name:
        if (await voice.leave({ interaction })) {
          interaction.reply('Left.');
        } else {
          interaction.reply('Not joined.');
        }
        break;
      default:
        throw new LogicException('Unknown subcommand.');
    }

    return;
  }
}
