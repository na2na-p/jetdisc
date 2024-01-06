import { singleton } from '@/features/others/singleton/index.js';

import { Spotify } from './internal/Spotify.class.js';

const createSpotifyInstance = () => new Spotify();
export const getSpotifyInstance = singleton(createSpotifyInstance);
