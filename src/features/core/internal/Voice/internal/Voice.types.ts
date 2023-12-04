import type { AudioPlayer, VoiceConnection } from '@/features/library/index.js';

export type ConnectionState = {
  guildId: string;
  connection: VoiceConnection;
  player: AudioPlayer | undefined;
};
