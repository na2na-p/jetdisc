import type {
  VoiceConnection,
  ChatInputCommandInteraction,
} from '@/features/library/index.js';
import {
  getVoiceConnection,
  isNil,
  joinVoiceChannel,
} from '@/features/library/index.js';
import { LogicException } from '@/features/others/Error/LogicException.js';
import { getInteractionMemberId } from '@/features/others/discord/index.js';

import {
  JOINABLE_TYPE_MAP,
  checkJoinable,
} from './funcs/checkJoinable/index.js';

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
    } = await getInteractionMemberId(interaction);
    const joinable = checkJoinable({
      channel,
    });

    switch (joinable) {
      case JOINABLE_TYPE_MAP.NOT_FOUND:
        interaction.reply({
          content: '接続先のVCが見つかりません。',
          ephemeral: false,
        });
        return false;

      case JOINABLE_TYPE_MAP.NOT_JOINABLE:
        interaction.reply({
          content: '接続先のVCに参加できません。権限の見直しをしてください。',
          ephemeral: true,
        });
        return false;

      case JOINABLE_TYPE_MAP.NOT_VIEWABLE:
        interaction.reply({
          content: '接続先のVCに参加できません。権限の見直しをしてください。',
          ephemeral: true,
        });
        return false;

      case JOINABLE_TYPE_MAP.JOINABLE:
        if (isNil(channel))
          throw new LogicException(
            'Channel is null. Please check checkJoinable()'
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
    const guildId = interaction.guildId;
    if (isNil(guildId)) return false;

    const targetConnection = this.connection.find(
      connection => connection.guildId === guildId
    );

    if (isNil(targetConnection)) {
      const member = await getInteractionMemberId(interaction);
      const connection = getVoiceConnection(member.guild.id);
      if (isNil(connection)) {
        return false;
      } else {
        connection.destroy();
        return true;
      }
    } else {
      targetConnection.connection.destroy();
      this.connection = this.connection.filter(
        connection => connection.guildId !== guildId
      );
      return true;
    }
  }
}
