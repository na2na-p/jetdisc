/* eslint-disable require-jsdoc */
import {Client, Intents} from 'discord.js';
import {config} from '@/config.js';

export class なずClient extends Client {
	public readonly name = 'なず';

	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
			],
		});

		this.login(config.token);
		this.once('ready', () => {
			console.log(`Logged in as ${this.user?.tag}!`);
		});
	}
}
