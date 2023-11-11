import 'dotenv/config';

import { getConfig } from './features/config/index.js';
import { Client } from './features/core/index.js';

new Client({
  config: getConfig(),
});
