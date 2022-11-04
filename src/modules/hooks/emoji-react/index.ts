import { boundMethod } from 'autobind-decorator';
import { Message } from 'discord.js';
import { parse } from 'twemoji-parser';

import type { queryMessage } from '@/types/types.js';
import { Module } from '@/types/modules.js';
import { Na2Client } from '@/client.js';

type wordReactType = Array<[RegExp, string]>;

/**
 * EmojiReact module
 */
export class EmojiReact extends Module {
	public override readonly name = 'EmojiReact';

	@boundMethod
	public install() {
		return {
			streamHook: this.streamHook,
		};
	}

	@boundMethod
	private async streamHook(message: Readonly<Message<boolean>>, query: queryMessage): Promise<boolean> {
		if (await this.mimicking(message, query)) {
			return true;
		}
		if (this.wordReact(message)) {
			return true;
		}
		return false;
	}

	@boundMethod
	private async mimicking(message: Readonly<Message<boolean>>, query: queryMessage): Promise<boolean> {
		const emojis = parse(query.queryContent).map((x) => x.text);
		// "<:"から始まって">"で終わるものを抽出
		const customEmojisRegEx = /<:.[^>]*:\d+>/g;
		// customEmojisに追加
		const customEmojis: string[] = query.queryContent.match(customEmojisRegEx) || [];

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

	@boundMethod
	private wordReact(message: Readonly<Message<boolean>>): boolean {
		const words: wordReactType = [
			[/(肉|にく)/, '🍗'],
			[/(寿司|すし)/, '🍣'],
			[/(ラーメン)/, '🍜'],
			[/(ピザ)/, '🍕'],
			[/(カレー)/, '🍛'],
			[/(お菓子)/, '🍬'],
			[/(おちゃ)/, '🍵'],
		];

		const isReacted: boolean = (() => {
			let hit = false;
			// words全て試行するまでreturnしない
			// つまり、複数リアクションが可能。この場合でlet使わずに何とかする方法ないかしら。
			words.forEach(([word, emoji]) => {
				if (word.exec(message.content)) {
					message.react(emoji);
					hit = true;
				};
			});
			return hit;
		})();

		return isReacted;
	}
};
