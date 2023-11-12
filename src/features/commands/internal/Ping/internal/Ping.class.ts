import { getRTT } from './funcs/getRTT/index.js';
import type { InteractArgs } from '../../CommandBase/index.js';
import { CommandBase } from '../../CommandBase/index.js';

export class Ping extends CommandBase {
  public readonly name = 'ping';
  public readonly description = 'Ping the bot.';

  public override async interact({ interaction }: InteractArgs): Promise<void> {
    interaction.reply(
      `RTT: ${getRTT({
        serverTime: interaction.createdAt.getTime(),
        localTime: Date.now(),
      })}ms`
    );

    return;
  }
}
