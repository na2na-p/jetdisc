/* eslint-disable require-jsdoc */
import {Client, Intents, Message} from 'discord.js';
import {config} from '@/config.js';
import {queryMessage} from '@/types.js';
import chalk from 'chalk';

type installedHooksType = (message: queryMessage) => Promise<boolean>;
type module = any;

export class Na2Client extends Client {
	public readonly name = 'なず';
	private mentionHooks: installedHooksType[] = [];

	constructor(modules: Array<module>) {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
			],
		});

		this.login(config.token);
		this.once('ready', () => {
			console.log(chalk.green(`Logged in as ${this.user?.tag}`));
		});
		if (this.installMolules(modules)) {
			this.on('messageCreate', async (message) => {
				this.onMessageCreate(message);
			});
		}
	}

	private installMolules(modules: Array<module>): boolean {
		try {
			for (const module of modules) {
				const result = module.install();
				if (result.mentionHook) this.mentionHooks.push(result.mentionHook);
				console.log(chalk.yellow(`Installed: ${module.name}`));
			}
			return true;
		} catch (error) {
			return false;
		}
	}

	private onMessageCreate(message: Message): Promise<boolean> {
		// prefixで始まる投稿 && Botによるものではないもの
		if (message.content.startsWith(config.prefix) && !message.author.bot) {
			// messageからconfig.prefixを除去
			const queryMessage: Partial<queryMessage> = message;
			queryMessage.queryContent = message.content.replace(config.prefix, '');
			if (message.member === null) queryMessage.memberName = '名無しさん';
			this.mentionHooks.forEach(async (mentionHook) => {
				if (await mentionHook(queryMessage as queryMessage)) {
					return;
				}
			});
		}
		return Promise.resolve(true);
	}
}
