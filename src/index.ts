import 'dotenv/config';

import { Ping, VoiceChannel, YouTube } from './features/commands/index.js';
import { getConfig } from './features/config/index.js';
import { Client } from './features/core/index.js';

new Client({
  config: getConfig(),
  commands: [new Ping(), new VoiceChannel(), new YouTube()],
});
