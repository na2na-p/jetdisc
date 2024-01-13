export const SCRIPT_SRC = 'https://sdk.scdn.co/spotify-player.js';

export const EVENT_TYPE = {
  READY: 'ready',
  NOT_READY: 'not_ready',
  PLAYER_STATE_CHANGED: 'player_state_changed',
  AUTOPLAY_FAILED: 'autoplay_failed',
} as const;

export const ERROR_TYPE = {
  INITIALIZATION_ERROR: 'initialization_error',
  AUTHENTICATION_ERROR: 'authentication_error',
  ACCOUNT_ERROR: 'account_error',
  PLAYBACK_ERROR: 'playback_error',
} as const;

export const PLAYER_TRACK_TYPE = {
  TRACK: 'track',
  EPISODE: 'episode',
  AD: 'ad',
} as const;

export const PLAYER_MEDIA_TYPE = {
  AUDIO: 'audio',
  VIDEO: 'video',
} as const;

export const REPEAT_MODE = {
  OFF: 0,
  CONTEXT: 1,
  TRACK: 2,
} as const;
