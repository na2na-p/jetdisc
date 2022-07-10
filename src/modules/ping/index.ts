/* eslint-disable require-jsdoc */
import {queryMessage} from '@/types.js';

/**
 * ping module
 */
export class Ping {
	public readonly name = 'Ping';

	public install() {
		return {
			mentionHook: this.mentionHook,
		};
	}

	private async mentionHook(message: queryMessage): Promise<boolean> {
		if (message.queryContent === 'ping') {
			message.reply('pong');
			return true;
		} else {
			return false;
		}
	}
}
