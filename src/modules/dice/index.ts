/* eslint-disable require-jsdoc */
import {queryMessage} from '@/types.js';

/**
 * ping module
 */
export class Dice {
	public readonly name = 'dice';

	public install() {
		return this.hook;
	}

	private async hook(message: queryMessage): Promise<boolean> {
		if (message.queryContent == null) return false;
		const query = message.queryContent.match(/([0-9]+)[dD]([0-9]+)/);

		if (query == null) return false;

		const times = parseInt(query[1], 10);
		const dice = parseInt(query[2], 10);

		if (times < 1 || times > 10) return false;
		if (dice < 2 || dice > 1000) return false;

		const results: number[] = [];

		for (let i = 0; i < times; i++) {
			results.push(Math.floor(Math.random() * dice) + 1);
		}

		message.reply(results.join(' '));

		return true;
	}
}
