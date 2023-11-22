import type {
  VoiceConnection,
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  VoiceBasedChannel,
} from '@/features/library/index.js';
import {
  getVoiceConnection,
  isNil,
  joinVoiceChannel,
} from '@/features/library/index.js';
import { getInteractionMemberId } from '@/features/others/discord/index.js';

export class Voice {
  #connection: Array<{
    guildId: string;
    connection: VoiceConnection;
  }> = [];

  public async join({
    interaction,
  }: {
    interaction: Readonly<ChatInputCommandInteraction>;
  }) {
    const member = await getInteractionMemberId(interaction);
    const checkJoinableResult = this.#checkJoinable({
      channel: member.voice.channel,
    });

    if (checkJoinableResult.isJoinable === false) return false;

    const connection = joinVoiceChannel({
      channelId: checkJoinableResult.channel.id,
      guildId: checkJoinableResult.channel.guild.id,
      adapterCreator: checkJoinableResult.channel.guild.voiceAdapterCreator,
    });

    this.#connection.push({
      guildId: checkJoinableResult.channel.guild.id,
      connection,
    });

    return true;
  }

  public async leave({
    interaction,
  }: {
    interaction: Readonly<ChatInputCommandInteraction>;
  }): Promise<boolean> {
    const guildId = interaction.guildId;
    if (isNil(guildId)) return false;

    const targetConnection = this.#connection.find(
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
      this.#connection = this.#connection.filter(
        connection => connection.guildId !== guildId
      );
      return true;
    }
  }

  #checkJoinable({ channel }: { channel: VoiceBasedChannel | null }):
    | (Pick<InteractionReplyOptions, 'content' | 'ephemeral'> & {
        isJoinable: false;
      })
    | {
        isJoinable: true;
        channel: VoiceBasedChannel;
      } {
    if (isNil(channel)) {
      return {
        isJoinable: false,
        content: '接続先のVCが見つかりません。',
        ephemeral: false,
      };
    } else if (!channel.joinable) {
      return {
        isJoinable: false,
        content: '接続先のVCに参加できません。権限の見直しをしてください。',
        ephemeral: true,
      };
    } else if (!channel.viewable) {
      return {
        isJoinable: false,
        content: '接続先のVCに参加できません。権限の見直しをしてください。',
        ephemeral: true,
      };
    } else {
      return { isJoinable: true, channel };
    }
  }
}
