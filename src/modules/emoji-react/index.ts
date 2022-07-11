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
		let reacted = false;
		if (/(肉|にく)/.exec(message.queryContent)) {
			message.react(`🍖`);
			reacted = true;
		}
		if (/(寿司|すし)/.exec(message.queryContent)) {
			message.react(`🍣`);
			reacted = true;
		}

		// 多重反応可にする
		if (reacted) {
			return true;
		}
		return false;
	}
};
