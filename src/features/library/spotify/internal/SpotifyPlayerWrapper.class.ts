import { EVENT_TYPE, SCRIPT_SRC } from './SpotifyPlayerWrapper.constants.js';
import type {
  SpotifyDeviceId,
  SpotifyPlayerError,
  SpotifyPlayerInternal,
  SpotifyPlayerState,
  SpotifyTokenRefreshFunction,
} from './SpotifyPlayerWrapper.types.js';

export class SpotifyPlayerWrapper {
  player: SpotifyPlayerInternal;

  private constructor(player: SpotifyPlayerInternal) {
    this.player = player;
  }

  static init({
    document,
    name,
    initialVolume,
    getOAuthToken,
  }: {
    document: Document;
    name: string;
    initialVolume: number;
    getOAuthToken: SpotifyTokenRefreshFunction;
  }): Promise<SpotifyPlayerWrapper> {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;

    document.body.appendChild(script);
    const w = window as unknown as {
      onSpotifyWebPlaybackSDKReady: () => void;
      Spotify: {
        Player: {
          new (args: {
            name: string;
            getOAuthToken: SpotifyTokenRefreshFunction;
            volume: number;
          }): SpotifyPlayerInternal;
        };
      };
    };
    return new Promise(resolve => {
      w.onSpotifyWebPlaybackSDKReady = () => {
        const player = new w.Spotify.Player({
          name,
          getOAuthToken,
          volume: initialVolume,
        });
        resolve(new SpotifyPlayerWrapper(player));
      };
    });
  }

  on(event: SpotifyPlayerError, callback: (error: unknown) => void) {
    this.player.on(event, callback);
  }

  connect(): Promise<boolean> {
    return this.player.connect();
  }

  disconnect(): void {
    return this.player.disconnect();
  }

  onReady(callback: (device: SpotifyDeviceId) => void) {
    return this.player.addListener(EVENT_TYPE.READY, callback);
  }

  onNotReady(callback: (device: SpotifyDeviceId) => void) {
    return this.player.addListener(EVENT_TYPE.NOT_READY, callback);
  }

  onPlayerStateChanged(callback: (state: SpotifyPlayerState) => void) {
    return this.player.addListener(EVENT_TYPE.PLAYER_STATE_CHANGED, callback);
  }

  onAutoPlayFailed(callback: () => void) {
    return this.player.addListener(EVENT_TYPE.AUTOPLAY_FAILED, callback);
  }

  removeReady() {
    this.player.removeListener(EVENT_TYPE.READY);
  }

  removeNotReady() {
    this.player.removeListener(EVENT_TYPE.NOT_READY);
  }

  removePlayerStateChanged() {
    this.player.removeListener(EVENT_TYPE.PLAYER_STATE_CHANGED);
  }

  removeAutoPlayFailed() {
    this.player.removeListener(EVENT_TYPE.AUTOPLAY_FAILED);
  }

  getCurrentState(): Promise<SpotifyPlayerState> {
    return this.player.getCurrentState();
  }

  setName(name: string): void {
    this.player.setName(name);
  }

  getVolume(): Promise<number> {
    return this.player.getVolume();
  }

  setVolume(volume: number): Promise<void> {
    return this.player.setVolume(volume);
  }

  pause(): Promise<void> {
    return this.player.pause();
  }

  resume(): Promise<void> {
    return this.player.resume();
  }

  togglePlay(): Promise<void> {
    return this.player.togglePlay();
  }

  seek(): Promise<void> {
    return this.player.seek();
  }

  previousTrack(): Promise<void> {
    return this.player.previousTrack();
  }

  nextTrack(): Promise<void> {
    return this.player.nextTrack();
  }

  activateElement(): Promise<void> {
    return this.player.activateElement();
  }
}
