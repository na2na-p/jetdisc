import type {
  AudioPlayer,
  Guild,
  VoiceConnection,
} from '@/features/library/index.js';

import { Store } from './Store.class.js';

export type VoiceConnections = Map<Guild['id'], VoiceConnection>;
export type VoicePlayers = Map<Guild['id'], AudioPlayer | undefined>;

export class InMemoryStore extends Store {
  #voiceConnections: VoiceConnections = new Map();
  #voicePlayers: VoicePlayers = new Map();

  public getVoiceConnection(guildId: Guild['id']) {
    return this.#voiceConnections.get(guildId);
  }

  public setVoiceConnection(guildId: Guild['id'], connection: VoiceConnection) {
    this.#voiceConnections.set(guildId, connection);
  }

  public getVoicePlayer(guildId: Guild['id']) {
    return this.#voicePlayers.get(guildId);
  }

  public setVoicePlayer(guildId: Guild['id'], player: AudioPlayer) {
    this.#voicePlayers.set(guildId, player);
  }
}
