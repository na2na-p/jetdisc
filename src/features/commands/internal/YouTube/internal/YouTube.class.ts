import ytdl from 'ytdl-core';

import {
  getActorConnectionState,
  getVoiceInstance,
} from '@/features/core/index.js';
import {
  AudioPlayerStatus,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  entersState,
  isNil,
} from '@/features/library/index.js';
import { LogicException } from '@/features/others/Error/LogicException.js';

import {
  YOUTUBE_URL_VALIDATION_SCHEMA,
  YouTubeCommandOptions,
} from './YouTube.constants.js';
import type { InteractArgs } from '../../CommandBase/index.js';
import { CommandBase } from '../../CommandBase/index.js';

/**
 * TODO: キューイング
 * TODO: 先頭に戻す操作
 * TODO: 次に送る操作
 * TODO: 一時停止と再開
 * TODO: 1曲をループし続けるモード
 * TODO: プレイリストサポート
 * TODO: プレイリストをループし続けるモード
 */
export class YouTube extends CommandBase {
  public readonly name = 'youtube';
  public readonly description = 'Searches YouTube for a video';
  public override readonly options = Object.values(YouTubeCommandOptions);

  public override async interact({ interaction }: InteractArgs): Promise<void> {
    switch (interaction.options.getSubcommand()) {
      case YouTubeCommandOptions.play.name:
        await this.play({ interaction });
        break;
      case YouTubeCommandOptions.stop.name:
        await this.stop({ interaction });
        break;
      default:
        throw new Error('Unexpected subcommand');
    }
  }

  private async play({ interaction }: InteractArgs) {
    if (isNil(interaction.guild)) return;

    const url = (() => {
      try {
        const url = YOUTUBE_URL_VALIDATION_SCHEMA.parse(
          interaction.options.getString('url')
        );
        if (ytdl.validateURL(url)) return url;
        else throw new Error('Invalid URL');
      } catch (error) {
        return;
      }
    })();
    if (isNil(url)) {
      interaction.reply('Invalid URL');
      return;
    }

    const voice = getVoiceInstance();

    const connection = await getActorConnectionState({
      interaction,
      connections: voice.connection,
    });

    if (isNil(connection)) {
      interaction.reply('Not connected to a voice channel');
    } else {
      const player = createAudioPlayer();
      connection.player = player;
      voice.connection = voice.connection.map(connection => {
        if (connection.guildId === interaction.guildId) {
          return {
            ...connection,
            player,
          };
        }
        return connection;
      });

      connection.connection.subscribe(player);

      const stream = ytdl(ytdl.getURLVideoID(url), {
        filter: format => format.audioCodec === 'opus', //webm opus
        quality: 'highestaudio',
        /**
         * @see https://github.com/fent/node-ytdl-core/issues/902
         * NOTE: infra/k8s/helm/values.yamlによるリソース制限も考慮してください
         */
        highWaterMark: 32 * 1024 * 1024,
      });

      const resource = createAudioResource(stream, {
        inputType: StreamType.WebmOpus,
        inlineVolume: true,
      });
      if (isNil(resource.volume)) throw new LogicException('Volume is null');
      resource.volume.setVolume(0.25);

      player.play(resource);
      await entersState(player, AudioPlayerStatus.Playing, 10 * 1000);
      interaction.reply(`Playing ${url}`);
    }
  }

  private async stop({ interaction }: InteractArgs) {
    if (isNil(interaction.guild)) return;

    const voice = getVoiceInstance();

    const connectionState = await getActorConnectionState({
      interaction,
      connections: voice.connection,
    });

    if (isNil(connectionState)) {
      interaction.reply('Not connected to a voice channel');
    } else if (isNil(connectionState.player)) {
      interaction.reply('Not playing in a voice channel');
    } else {
      connectionState.player.stop();
      interaction.reply('Stopped');
    }
  }
}
