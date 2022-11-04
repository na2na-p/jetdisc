import { boundMethod } from 'autobind-decorator';
import {
	Client,
	GatewayIntentBits,
	InteractionType,
	Message,
} from 'discord.js';
import chalk from 'chalk';
import { exit } from 'process';

import { config } from '@/config/index.js';
import log from '@utils/log.js';
import type {
	commandSetType,
	interactionHookType,
	mentionHookType,
	streamHookType,
	installedHooksType,
	module,
	queryMessage,
} from '@/types/types.js';


export class Na2Client extends Client {
	public readonly name = 'なず';
	private mentionHooks: installedHooksType<mentionHookType>[] = [];
	private streamHooks: installedHooksType<streamHookType>[] = [];
	private interactionHooks: installedHooksType<interactionHookType>[] = [];
	private isInteractionEnabled: boolean = true;

	constructor(modules: Array<module<unknown>>, commands: commandSetType[]) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.DirectMessageReactions,
			],
		});
		try {
			this.login(config.token);
		} catch (error) {
			Na2Client.log(chalk.red('Failed to fetch the account'));
			exit(1);
		}

		if (config.setCommandsTargetServers.length === 0) {
			this.isInteractionEnabled = false;
			Na2Client.log(chalk.yellow('No interactions are installed - Target servers are not set'));
		}
		const modulesInstallResult: boolean = this.installModules(modules);
		this.on('ready', () => {
			Na2Client.log(chalk.green(`Logged in as ${chalk.underline(this.user?.tag)}`));
			if (modulesInstallResult && this.installCommands(commands)) {
				this.on('messageCreate', async (message) => {
					this.onMessageCreate(message);
				});
				this.on('interactionCreate', async (interaction) => {
					this.onInteractionCreate(interaction);
				});
			}
		});
	}

	@boundMethod
	public static log(logMessage: string): void {
		log(`${chalk.hex('#C239B3')('[2na2]')}: ${logMessage}`);
	}

	@boundMethod
	private installModules(modules: Array<any>): boolean {
		try {
			for (const module of modules) {
				Na2Client.log(`Installing ${chalk.cyan.italic(module.name)}\tmodule...`);
				const result = module.install();
				if (result.mentionHook) this.mentionHooks.push(result.mentionHook);
				if (result.streamHook) this.streamHooks.push(result.streamHook);
				if (result.interactionHook && this.isInteractionEnabled) {
					this.interactionHooks.push(result.interactionHook);
				}
			}
			return true;
		} catch (error) {
			return false;
		}
	}

	@boundMethod
	private installCommands(commands: commandSetType[]): boolean {
		if (commands.length === 0) {
			Na2Client.log(chalk.yellow('No commands are installed - Commands are not set in index.ts'));
			return true;
		}
		try {
			config.setCommandsTargetServers.forEach(async (serverId) => {
				this.application!.commands.set(commands, serverId);
				// this.on('ready')になってないとthis.applicationがnull。そうでないならok
				Na2Client.log(`Installed commands to ${chalk.underline(serverId)}`);
			});
			return true;
		} catch (error) {
			throw new Error('コマンドのインストールに失敗しました。');
		}
	}

	@boundMethod
	private onMessageCreate(message: Message<boolean>): Promise<boolean> {
		// prefixで始まる投稿 && Botによるものではないもの
		const mentionedRoleId = this.mentionHasOwnRole(message);
		if ((message.content.startsWith(config.prefix) || // prefixで始まる場合
				message.mentions.users.has(this.user!.id) || // ユーザーメンションされた場合
				mentionedRoleId) && // ロールメンションされた場合
			!message.author.bot) {
			// messageからconfig.prefixを除去

			const regExp = new RegExp(`^${config.prefix}|^<@${this.user!.id}> |^<@&${mentionedRoleId}> `);
			const query: queryMessage = {
				queryContent: message.content.replace(regExp, ''),
				memberName: message.member === null ? '名無しさん' : message.member.displayName,
			};

			Na2Client.log(chalk.gray(`<<< An message received: ${chalk.underline(message.id)}`));
			this.mentionHooks.forEach(async (mentionHook) => {
				if (await mentionHook(message, query)) {
					return;
				}
			});
		} else {
			this.streamHooks.forEach(async (streamHook) => {
				const query = {
					queryContent: message.content,
					memberName: message.member === null ? '名無しさん' : message.member.displayName,
				};
				if (await streamHook(message, query)) {
					Na2Client.log(
						chalk.gray(`<<< An message received and na2 reacted: ${chalk.underline(message.id)}`),
					);
					return;
				}
			});
		}
		return Promise.resolve(true);
	}

	@boundMethod
	// TODO: 一生型定義合わん誰か助けて
	private onInteractionCreate(interaction: any): Promise<boolean> {
		if (!(interaction.type === InteractionType.ApplicationCommand)) {
			return Promise.resolve(false);
		}
		Na2Client.log(chalk.gray(`<<< A slash-command received: ${chalk.underline(interaction.commandName)}`));
		this.interactionHooks.forEach(async (interactionHook) => {
			if (await interactionHook(interaction)) {
				return;
			}
		});
		return Promise.resolve(true);
	};

	@boundMethod
	private mentionHasOwnRole(message: Message): void | string | undefined {
		// 自分が所属するロールidを取得
		const myRoleIds = message.guild!.roles.cache.filter((role) => {
			return role.members.has(this.user!.id);
		}).map((role) => {
			return role.id;
		});

		const mentionRoleIds = message.mentions.roles.map((role) => {
			return role.id;
		});

		// console.log(myRoleIds);
		// console.log(mentionRoleIds);

		if (myRoleIds === null || mentionRoleIds === null) return;
		// 自分が所属するロールidとメンションされたロールidを比較して、一致するものがあればそのロールidを返す
		// returnはstring
		return myRoleIds.find((myRoleId) => {
			return mentionRoleIds.includes(myRoleId);
		});
	}
}
