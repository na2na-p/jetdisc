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

import { JOINABLE_TYPE_MAP } from './Voice.constants.js';

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
    const checkJoinableResult = this.checkJoinable({
      channel: member.voice.channel,
    });

    if (checkJoinableResult.joinableType !== JOINABLE_TYPE_MAP.JOINABLE)
      return false;

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

  checkJoinable({ channel }: { channel: VoiceBasedChannel | null }):
    | (Pick<InteractionReplyOptions, 'content' | 'ephemeral'> & {
        joinableType: Exclude<
          (typeof JOINABLE_TYPE_MAP)[keyof typeof JOINABLE_TYPE_MAP],
          typeof JOINABLE_TYPE_MAP.JOINABLE
        >;
      })
    | {
        joinableType: typeof JOINABLE_TYPE_MAP.JOINABLE;
        channel: VoiceBasedChannel;
      } {
    if (isNil(channel)) {
      return {
        joinableType: JOINABLE_TYPE_MAP.NOT_FOUND,
        content: '接続先のVCが見つかりません。',
        ephemeral: false,
      };
    } else if (!channel.joinable) {
      return {
        joinableType: JOINABLE_TYPE_MAP.NOT_JOINABLE,
        content: '接続先のVCに参加できません。権限の見直しをしてください。',
        ephemeral: true,
      };
    } else if (!channel.viewable) {
      return {
        joinableType: JOINABLE_TYPE_MAP.NOT_VIEWABLE,
        content: '接続先のVCに参加できません。権限の見直しをしてください。',
        ephemeral: true,
      };
    } else {
      return { joinableType: JOINABLE_TYPE_MAP.JOINABLE, channel };
    }
  }
}
