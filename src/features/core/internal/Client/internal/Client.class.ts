import { exit } from 'process';

import type { CommandBase } from '@/features/commands/index.js';
import type { getConfig } from '@/features/config/index.js';
import {
  getInMemoryStoreInstance,
  type Store,
  STORE_TYPES,
} from '@/features/core/index.js';
import type { ChatInputCommandInteraction } from '@/features/library/index.js';
import {
  chalk,
  Client as DiscordJsClient,
  GatewayIntentBits,
  InteractionType,
} from '@/features/library/index.js';
import { log } from '@/features/others/log/index.js';

import type { ClassConstructorArgs } from './Client.types.js';

export class Client extends DiscordJsClient {
  readonly #config: ReturnType<typeof getConfig>;
  private interactionCommands: ReadonlyArray<CommandBase> = [];
  #store: Store;

  constructor({ config, commands, storeDriver }: ClassConstructorArgs) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.#config = config;
    try {
      this.login(this.#config.DISCORD_APP_TOKEN);
    } catch (error) {
      this.log(chalk.red('Failed to fetch the account'));
      exit(1);
    }

    switch (storeDriver) {
      case STORE_TYPES.IN_MEMORY:
        this.#store = getInMemoryStoreInstance();
        break;
      default:
        throw new Error('Invalid store driver');
    }

    const commandsRegisteredResult = this.#installModules(commands);

    this.on('ready', client => {
      this.log(chalk.green(`Logged in as ${chalk.underline(this.user?.tag)}`));
      if (
        commandsRegisteredResult &&
        this.#installCommands({ commands, application: client.application })
      ) {
        this.on('interactionCreate', async interaction => {
          if (interaction.isChatInputCommand()) {
            this.#onInteractionCreate({ interaction });
          }
          return;
        });
      }
    });
  }

  private log(logMessage: string): void {
    log({
      message: `${chalk.hex('#C239B3')(
        `[${this.#config.BOT_NAME}]`
      )}: ${logMessage}`,
    });
  }

  #installModules(commands: ReadonlyArray<CommandBase>): boolean {
    commands.forEach(command => {
      this.interactionCommands = this.interactionCommands.concat(
        command.register()
      );
    });
    return true;
  }

  #installCommands({
    commands,
    application,
  }: {
    commands: ReadonlyArray<CommandBase>;
    application: Client['application'];
  }): boolean {
    if (commands.length === 0) {
      this.log(
        chalk.yellow(
          'No commands are installed - Commands are not set in index.ts'
        )
      );
      return true;
    }
    // if (this.application) {
    //   throw new Error('Failed to fetch the application');
    // }

    try {
      this.#config.SET_COMMANDS_TARGET_SERVERS.forEach(async serverId => {
        // this.on('ready')になってないとthis.applicationがnull。そうでないならok?
        // HACK: なぜかnullでも動く
        application?.commands.set(commands, serverId);
        this.log(`Installed commands to ${chalk.underline(serverId)}`);
      });
      return true;
    } catch (error) {
      throw new Error('Failed to install commands');
    }
  }

  #onInteractionCreate({
    interaction,
  }: {
    interaction: Readonly<ChatInputCommandInteraction>;
  }): Promise<boolean> {
    if (!(interaction.type === InteractionType.ApplicationCommand)) {
      return Promise.resolve(false);
    }
    this.log(
      chalk.gray(
        `<<< A slash-command received: ${chalk.underline(
          interaction.commandName
        )}`
      )
    );
    this.interactionCommands.forEach(async interactionCommand => {
      if (interactionCommand.isInteract({ interaction })) {
        await interactionCommand.interact({ interaction });
      }
    });
    return Promise.resolve(true);
  }
}
