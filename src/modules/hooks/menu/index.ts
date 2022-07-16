/* eslint-disable require-jsdoc */
import {boundMethod} from 'autobind-decorator';
import {queryMessage} from '@/types.js';

/**
 * menu module
 */
export class Menu {
	public readonly name = 'Menu';

	@boundMethod
	public install() {
		return {
			mentionHook: this.mentionHook,
		};
	}

	@boundMethod
	private async mentionHook(message: Readonly<queryMessage>): Promise<boolean> {
		if (message.queryContent.includes('ごはん')) {
			// 1~2535111の適当な数字を取得
			const url = `https://cookpad.com/recipe/${Math.floor(Math.random() * 2535111) + 1}`;
			// testUrlして、200以外なら再取得
			const res = await fetch(url);
			if (res.status !== 200) {
				return this.mentionHook(message);
			} else {
				// jsdomを利用してレシピのタイトルを取得
				// const dom = new JSDOM(await res.text());
				message.reply(`こんなのどう？\n${url}`);
				return true;
			}
		} else {
			return false;
		}
	}
}
