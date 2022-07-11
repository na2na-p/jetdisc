/* eslint-disable require-jsdoc */
import {Client, Intents, Message} from 'discord.js';
import {config} from '@/config.js';
import {queryMessage} from '@/types.js';
import {boundMethod} from 'autobind-decorator';
import log from '@utils/log.js';
import chalk from 'chalk';
import {exit} from 'process';

type installedHooksType = (message: queryMessage) => Promise<boolean>;
type module = any; // TODO: anyをなんとかする

export class Na2Client extends Client {
	public readonly name = 'なず';
	private mentionHooks: installedHooksType[] = [];
	private streamHooks: installedHooksType[] = [];

	constructor(modules: Array<module>) {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
			],
		});
		try {
			this.login(config.token);
		} catch (error) {
			this.log(chalk.red('Failed to fetch the account'));
			exit(1);
		}

		this.once('ready', () => {
			this.log(chalk.green(`Logged in as ${chalk.underline(this.user?.tag)}`));
		});
		if (this.installMolules(modules)) {
			this.on('messageCreate', async (message) => {
				this.onMessageCreate(message);
			});
		}
	}

	@boundMethod
	public log(logMessge: string): void {
		log(`${chalk.hex('#C239B3')('[2na2]')}: ${logMessge}`);
	}

	@boundMethod
	private installMolules(modules: Array<module>): boolean {
		try {
			for (const module of modules) {
				this.log(`Installing ${chalk.cyan.italic(module.name)}\tmodule...`);
				const result = module.install();
				if (result.mentionHook) this.mentionHooks.push(result.mentionHook);
				if (result.streamHook) this.streamHooks.push(result.streamHook);
			}
			return true;
		} catch (error) {
			return false;
		}
	}

	@boundMethod
	private onMessageCreate(message: Message): Promise<boolean> {
		// prefixで始まる投稿 && Botによるものではないもの
		const mentionedRoleId = this.mentionHasOwnRole(message);
		if ((message.content.startsWith(config.prefix) ||
				message.mentions.users.has(this.user!.id) ||
				mentionedRoleId) &&
			!message.author.bot) {
			// messageからconfig.prefixを除去
			const queryMessage: Partial<queryMessage> = message;
			// config.prefixと`<@${this.user!.id}> `を除去
			// それぞれ別で扱う
			const regExp = new RegExp(`^${config.prefix}|^<@${this.user!.id}> |^<@&${mentionedRoleId}> `);
			queryMessage.queryContent = message.content.replace(regExp, '');
			if (message.member === null) queryMessage.memberName = '名無しさん';
			this.log(chalk.gray(`<<< An message received: ${chalk.underline(message.id)}`));
			this.mentionHooks.forEach(async (mentionHook) => {
				if (await mentionHook(queryMessage as queryMessage)) {
					return;
				}
			});
		} else {
			this.streamHooks.forEach(async (streamHook) => {
				const queryMessage: Partial<queryMessage> = message;
				queryMessage.queryContent = message.content;
				if (message.member === null) queryMessage.memberName = '名無しさん';
				if (await streamHook(queryMessage as queryMessage)) {
					this.log(chalk.gray(`<<< An message received and na2 reacted: ${chalk.underline(message.id)}`));
					return;
				}
			});
		}
		return Promise.resolve(true);
	}

	@boundMethod
	private mentionHasOwnRole(message: Message): string | void {
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
