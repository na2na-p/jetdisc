import { singleton } from '@/features/others/singleton/index.js';

import { Store } from './internal/Store.class.js';
export type { Store } from './internal/Store.class.js';
export type { SpotifyToken } from './internal/Store.types.js';

const createStoreInstance = () => new Store();

export const getStoreInstance = singleton(createStoreInstance);
