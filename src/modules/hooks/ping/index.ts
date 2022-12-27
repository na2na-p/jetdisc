import { boundMethod } from 'autobind-decorator';
import type { Message } from 'discord.js';

import { Module } from '@/types/modules.js';
import type { queryMessage } from '@/types/types.js';

/**
 * ping module
 */
export class Ping extends Module {
	public override readonly name = 'Ping';

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
