import {boundMethod} from 'autobind-decorator';
import {queryMessage} from '@/types.js';
import {Message} from 'discord.js';

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
