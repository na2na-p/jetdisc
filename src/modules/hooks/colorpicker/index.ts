/* eslint-disable require-jsdoc */
import {boundMethod} from 'autobind-decorator';
import {queryMessage} from '@/types.js';
import {random} from '@utils/random.js';

type rgb = {
	r: number;
	g: number;
	b: number;
}

/**
 * ping module
 */
export class ColorPicker {
	public readonly name = 'ColorPicker';

	@boundMethod
	public install() {
		return {
			mentionHook: this.mentionHook,
		};
	}

	@boundMethod
	private async mentionHook(message: Readonly<queryMessage>): Promise<boolean> {
		if (message.queryContent === '色決めて') {
			const options = {
				min: 0,
				max: 255,
			};
			const color: rgb = {
				r: random(options),
				g: random(options),
				b: random(options),
			};
			const hex = this.rgb2hex(color);
			// eslint-disable-next-line max-len
			message.reply(`RGB: ${color.r}, ${color.g}, ${color.b} (${hex})とかどう？\nhttps://colorate.azurewebsites.net/ja/Color/${hex.slice(1)}`);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * aaa
	 * @param {rgb} rgb
	 * @return {string}
	 */
	@boundMethod
	private rgb2hex(rgb: rgb): string {
		const r = Math.round(rgb.r).toString(16);
		const g = Math.round(rgb.g).toString(16);
		const b = Math.round(rgb.b).toString(16);
		return `#${r}${g}${b}`;
	}
}
