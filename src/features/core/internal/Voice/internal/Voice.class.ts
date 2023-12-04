import type {
  VoiceConnection,
  ChatInputCommandInteraction,
} from '@/features/library/index.js';
import { isNil, joinVoiceChannel } from '@/features/library/index.js';
import { LogicException } from '@/features/others/Error/LogicException.js';
import { getActorId } from '@/features/others/discord/index.js';

import { getActorConnection } from './funcs/getActorConnection/index.js';
import {
  JOINABLE_STATE_STATUS,
  getJoinableStateStatus,
} from './funcs/getJoinableStateStatus/index.js';

export class Voice {
  connection: Array<{
    guildId: string;
    connection: VoiceConnection;
  }> = [];

  public async join({
    interaction,
  }: {
    interaction: Readonly<ChatInputCommandInteraction>;
  }) {
    const {
      voice: { channel },
    } = await getActorId(interaction);
    const joinable = getJoinableStateStatus({
      channel,
    });

    switch (joinable) {
      case JOINABLE_STATE_STATUS.NOT_FOUND:
        interaction.reply({
          content: '接続先のVCが見つかりません。',
          ephemeral: false,
        });
        return false;

      case JOINABLE_STATE_STATUS.NOT_JOINABLE:
        interaction.reply({
          content: '接続先のVCに参加できません。権限の見直しをしてください。',
          ephemeral: true,
        });
        return false;

      case JOINABLE_STATE_STATUS.NOT_VIEWABLE:
        interaction.reply({
          content: '接続先のVCに参加できません。権限の見直しをしてください。',
          ephemeral: true,
        });
        return false;

      case JOINABLE_STATE_STATUS.JOINABLE:
        if (isNil(channel))
          throw new LogicException(
            'Channel is null. Please check getJoinableStateStatus()'
          );
        const connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });

        this.connection.push({
          guildId: channel.guild.id,
          connection,
        });
        return true;

      default:
        // HACK: ここでrejectするとSwitch外のカバレッジがuncoveredになる
        break;
    }

    return Promise.reject(new LogicException('Unknown joinable type.'));
  }

  public async leave({
    interaction,
  }: {
    interaction: Readonly<ChatInputCommandInteraction>;
  }): Promise<boolean> {
    const actorConnection = await getActorConnection({
      interaction,
      connections: this.connection,
    });

    if (isNil(actorConnection)) return false;
    else {
      actorConnection.destroy();
      return true;
    }
  }
}
