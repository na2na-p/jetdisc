import { boundMethod } from 'autobind-decorator';
import { Message } from 'discord.js';

import type { queryMessage } from '@/types.js';

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
	private async mentionHook(message: Readonly<Message<boolean>>, query: queryMessage): Promise<boolean> {
		if (query.queryContent === 'ping') {
			message.reply('pong');
			return true;
		} else {
			return false;
		}
	}
}
