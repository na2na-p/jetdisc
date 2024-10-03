import { exit } from 'process';

import type { CommandBase } from '@/features/commands/index.js';
import type { getConfig } from '@/features/config/index.js';
import { type Store } from '@/features/core/index.js';
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

  constructor({ config, commands, StoreDriver }: ClassConstructorArgs) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.#config = config;
    this.#store = StoreDriver;
    try {
      this.login(this.#config.DISCORD_APP_TOKEN);
    } catch (error) {
      this.log(chalk.red(`Failed to fetch the account: ${error}`));
      exit(1);
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

  #installModules(commands: ClassConstructorArgs['commands']): boolean {
    const interactionCommands = [...this.interactionCommands];

    for (const command of commands) {
      const commandInstance = new command({
        store: this.#store,
      }).register();
      interactionCommands.push(commandInstance);
    }
    this.interactionCommands = interactionCommands;
    return true;
  }

  #installCommands({
    commands,
    application,
  }: {
    commands: ClassConstructorArgs['commands'];
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
        application?.commands.set(this.interactionCommands, serverId);
        this.log(`Installed commands to ${chalk.underline(serverId)}`);
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to install commands: ${error}`);
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
