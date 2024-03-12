import type { Store } from '@/features/core/index.js';
import type { AudioPlayer, VoiceConnection } from '@/features/library/index.js';

import { InMemoryStore } from './InMemoryStore.class.js';

describe('InMemoryStore', () => {
  let store: Store;
  const guildId = 'guildId123';
  const voiceConnection = {} as VoiceConnection;
  const audioPlayer = {} as AudioPlayer;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  describe('getVoiceConnection', () => {
    it('should return undefined for a non-existing guildId', () => {
      expect(store.getVoiceConnection(guildId)).toBeUndefined();
    });

    it('should return the correct VoiceConnection for an existing guildId', () => {
      store.setVoiceConnection(guildId, voiceConnection);
      expect(store.getVoiceConnection(guildId)).toBe(voiceConnection);
    });
  });

  describe('setVoiceConnection', () => {
    it('should set the VoiceConnection for a guildId', () => {
      store.setVoiceConnection(guildId, voiceConnection);
      expect(store.getVoiceConnection(guildId)).toBe(voiceConnection);
    });
  });

  describe('getVoicePlayer', () => {
    it('should return undefined for a non-existing guildId', () => {
      expect(store.getVoicePlayer(guildId)).toBeUndefined();
    });

    it('should return the correct AudioPlayer for an existing guildId', () => {
      store.setVoicePlayer(guildId, audioPlayer);
      expect(store.getVoicePlayer(guildId)).toBe(audioPlayer);
    });
  });

  describe('setVoicePlayer', () => {
    it('should set the AudioPlayer for a guildId', () => {
      store.setVoicePlayer(guildId, audioPlayer);
      expect(store.getVoicePlayer(guildId)).toBe(audioPlayer);
    });
  });
});
