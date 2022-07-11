/* eslint-disable require-jsdoc */
import {boundMethod} from 'autobind-decorator';
import {queryMessage} from '@/types.js';

/**
 * ping module
 */
export class EmojiReact {
	public readonly name = 'EmojiReact';

	@boundMethod
	public install() {
		return {
			streamHook: this.streamHook,
		};
	}

	@boundMethod
	private async streamHook(message: queryMessage): Promise<boolean> {
		if (/(肉|にく)/.exec(message.queryContent)) {
			message.react(`🍖`);
			return true;
		}
		if (/(寿司|すし)/.exec(message.queryContent)) {
			message.react(`🍣`);
			return true;
		}
		return false;
	}
};
