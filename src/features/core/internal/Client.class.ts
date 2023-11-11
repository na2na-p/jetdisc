import { exit } from 'process';

import type { CommandBase } from '@/features/commands/index.js';
import type { ChatInputCommandInteraction } from '@/features/library/index.js';
import {
  Client as DiscordJsClient,
  GatewayIntentBits,
  InteractionType,
  chalk,
} from '@/features/library/index.js';
import { log } from '@/features/others/log/index.js';

import type { ClassConstructorArgs } from './Client.types.js';

export class Client extends DiscordJsClient {
  readonly #config;
  private interactionCommands: ReadonlyArray<CommandBase> = [];

  constructor({ config, commands }: ClassConstructorArgs) {
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
    } catch (error) {
      this.log(chalk.red('Failed to fetch the account'));
      exit(1);
    }

    const modulesInstallResult: boolean = this.installModules(commands);
    this.on('ready', () => {
      this.log(chalk.green(`Logged in as ${chalk.underline(this.user?.tag)}`));
      if (modulesInstallResult && this.installCommands(commands)) {
        this.on('interactionCreate', async interaction => {
          if (interaction.isChatInputCommand()) {
            this.onInteractionCreate({ interaction });
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

  private installModules(commands: ReadonlyArray<CommandBase>): boolean {
    commands.forEach(command => {
      this.interactionCommands = [
        ...this.interactionCommands,
        command.register(),
      ];
    });
    return true;
  }

  private installCommands(commands: ReadonlyArray<CommandBase>): boolean {
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
        this.application?.commands.set(commands, serverId);
        // this.on('ready')になってないとthis.applicationがnull。そうでないならok
        this.log(
          `Installed commands to ${chalk.underline(this.application?.name)}`
        );
      });
      return true;
    } catch (error) {
      throw new Error('コマンドのインストールに失敗しました。');
    }
  }

  private onInteractionCreate({
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
