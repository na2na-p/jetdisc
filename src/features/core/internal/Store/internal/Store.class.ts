import type { AudioPlayer, VoiceConnection } from '@/features/library/index.js';

export abstract class Store {
  abstract getVoiceConnection(guildId: string): VoiceConnection | undefined;
  abstract setVoiceConnection(
    guildId: string,
    connection: VoiceConnection
  ): void;
  abstract getVoicePlayer(guildId: string): AudioPlayer | undefined;
  abstract setVoicePlayer(guildId: string, player: AudioPlayer): void;
}
