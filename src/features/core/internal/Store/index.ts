import { singleton } from '@/features/others/singleton/index.js';

import { InMemoryStore } from './internal/InMemoryStore.class.js';

export type { Store } from './internal/Store.class.js';
export { STORE_TYPES } from './internal/Store.constants.js';
export type { InMemoryStore };

const createInMemoryStoreInstance = () => new InMemoryStore();

export const getInMemoryStoreInstance = singleton(createInMemoryStoreInstance);
