/* eslint-disable require-jsdoc */
import {boundMethod} from 'autobind-decorator';
import {queryMessage} from '@/types.js';

/**
 * ping module
 */
export class Ping {
	public readonly name = 'Ping';

	@boundMethod
	public install() {
		return {
			mentionHook: this.mentionHook,
		};
	}

	@boundMethod
	private async mentionHook(message: Readonly<queryMessage>): Promise<boolean> {
		if (message.queryContent === 'ping') {
			message.reply('pong');
			return true;
		} else {
			return false;
		}
	}
}
