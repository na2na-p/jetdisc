import { LogicException } from '@/features/others/Error/LogicException.js';

import { VoiceChannelCommandOptions } from './VoiceChannel.constants.js';
import { join } from './funcs/index.js';
import type { InteractArgs } from '../../CommandBase/index.js';
import { CommandBase } from '../../CommandBase/index.js';

export class VoiceChannel extends CommandBase {
  public readonly name = 'vc';
  public readonly description = 'Voice channel commands.';
  public override readonly options = Object.values(VoiceChannelCommandOptions);

  public override async interact({ interaction }: InteractArgs): Promise<void> {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case VoiceChannelCommandOptions.join.name:
        await join({ interaction });
        break;
      case VoiceChannelCommandOptions.leave.name:
        interaction.reply('leave');
        break;
      default:
        throw new LogicException('Unknown subcommand.');
    }

    return;
  }
}
