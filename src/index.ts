import 'dotenv/config';

import { Ping, VoiceChannel, YouTube } from './features/commands/index.js';
import { getConfig } from './features/config/index.js';
import {
  Client,
  getInMemoryStoreInstance,
  STORE_TYPES,
} from './features/core/index.js';

const config = getConfig();
const storeDriver = (() => {
  switch (config.STORE_DRIVER) {
    case STORE_TYPES.IN_MEMORY:
      return getInMemoryStoreInstance();
    case STORE_TYPES.REDIS:
      throw new Error('Not implemented yet');
    default:
      return getInMemoryStoreInstance();
  }
})();

new Client({
  config,
  commands: [Ping, VoiceChannel, YouTube],
  StoreDriver: storeDriver,
});
