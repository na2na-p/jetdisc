import type {
  VoiceConnection,
  ChatInputCommandInteraction,
  AudioPlayer,
} from '@/features/library/index.js';
import { isNil, joinVoiceChannel } from '@/features/library/index.js';
import { LogicException } from '@/features/others/Error/LogicException.js';
import { assertNever } from '@/features/others/assertNever.js';
import { getActorId } from '@/features/others/discord/index.js';
import { singleton } from '@/features/others/singleton/index.js';

import { getActorConnectionState } from './funcs/getActorConnectionState/index.js';
import {
  JOINABLE_STATE_STATUS,
  getJoinableStateStatus,
} from './funcs/getJoinableStateStatus/index.js';

const createVoiceInstance = () => new Voice();
export const getVoiceInstance = singleton(createVoiceInstance);

export class Voice {
  connection: Array<{
    guildId: string;
    connection: VoiceConnection;
    player: AudioPlayer | undefined;
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

      case JOINABLE_STATE_STATUS.ALREADY_JOINED:
        const actor = await getActorId(interaction);
        if (
          !(
            this.connection.filter(
              connection => connection.guildId === actor.guild.id
            ).length > 0
          )
        ) {
          if (isNil(channel))
            throw new LogicException(
              'Channel is null. Please check getJoinableStateStatus()'
            );

          // NOTE: クライアントでの接続情報がないので、再度接続という形を取る
          const connectedChannel = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
          });
          this.connection.push({
            guildId: actor.guild.id,
            connection: connectedChannel,
            player: undefined,
          });
        }
        interaction.reply({
          content: 'Already joined.',
          ephemeral: false,
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
          player: undefined,
        });
        return true;

      default:
        assertNever(joinable);
    }
    /* c8 ignore next */
    return;
  }

  public async leave({
    interaction,
  }: {
    interaction: Readonly<ChatInputCommandInteraction>;
  }): Promise<boolean> {
    const actorConnectionState = await getActorConnectionState({
      interaction,
      connections: this.connection,
    });

    if (isNil(actorConnectionState)) return false;
    else {
      actorConnectionState.connection.destroy();
      return true;
    }
  }
}
