import { exit } from 'process';

import type { getConfig } from '@/features/config/index.js';
import {
  Client as DiscordJsClient,
  GatewayIntentBits,
  chalk,
} from '@/features/library/index.js';
import { log } from '@/features/others/log/index.js';

export class Client extends DiscordJsClient {
  readonly #config;

  constructor({ config }: { config: ReturnType<typeof getConfig> }) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.#config = config;
    try {
      this.login(this.#config.DISCORD_APP_TOKEN);
      this.on('ready', () => {
        this.log(
          chalk.green(`Logged in as ${chalk.underline(this.user?.tag)}`)
        );
        this.on('messageCreate', async message => {
          if (message.content === 'ping') {
            await message.reply('pong');
          }
        });
      });
    } catch (error) {
      this.log(chalk.red('Failed to fetch the account'));
      exit(1);
    }
  }

  private log(logMessage: string): void {
    log({
      message: `${chalk.hex('#C239B3')(
        `[${this.#config.BOT_NAME}]`
      )}: ${logMessage}`,
    });
  }
}
