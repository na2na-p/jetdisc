/* eslint-disable require-jsdoc */
import {boundMethod} from 'autobind-decorator';
import {parse} from 'twemoji-parser';
import {queryMessage} from '@/types.js';
import {Na2Client} from '@/client.js';

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
		if (await this.mimicking(message)) {
			return true;
		}

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

	@boundMethod
	private async mimicking(message: Readonly<queryMessage>): Promise<boolean> {
		const emojis = parse(message.queryContent).map((x) => x.text);
		// "<:"から始まって">"で終わるものを抽出
		const customEmojisRegEx = /<:.[^>]*:\d+>/g;
		// customEmojisに追加
		const customEmojis: string[] = message.queryContent.match(customEmojisRegEx) || [];

		// const customEmojisIds: string[] = (() => {
		// 	if (customEmojis.length > 0) {
		// 		// ":"から">"の間にある数字だけを抽出
		// 		return customEmojis.map((x) => x.match(/\d+/g)![0]);
		// 	}
		// 	return [];
		// })();

		emojis.concat(customEmojis).forEach(async (emoji) => {
			try {
				await message.react(emoji);
			} catch (error) {
				await message.react(`❤️`);
			}
		});
		if (emojis.concat(customEmojis).length === 0) {
			return false;
		}
		switch (emojis.length) {
		case 0:
			break;
		case 1:
			Na2Client.log(`Emoji detected - ${emojis}`);
			break;
		default:
			Na2Client.log(`Emojis detected - ${emojis}`);
			break;
		}

		switch (customEmojis.length) {
		case 0:
			break;
		case 1:
			Na2Client.log(`Custom Emoji detected - ${customEmojis}`);
			break;
		default:
			Na2Client.log(`Custom Emojis detected - ${customEmojis}`);
			break;
		}

		return true;
	}
};
