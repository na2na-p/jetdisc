/* eslint-disable require-jsdoc */
import {queryMessage} from '@/types.js';

/**
 * ping module
 */
export class Ping {
	public readonly name = 'ping';

	public install() {
		return this.hook;
	}

	private async hook(message: queryMessage): Promise<boolean> {
		if (message.queryContent === 'ping') {
			message.reply('pong');
			return true;
		} else {
			return false;
		}
	}
}