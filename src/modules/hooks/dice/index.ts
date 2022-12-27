import { boundMethod } from 'autobind-decorator';
import type { Message } from 'discord.js';

import isNil from '@utils/isNil.js';


import { Module } from '@/types/modules.js';
import type { queryMessage } from '@/types/types.js';

/**
 * ping module
 */
export class Dice extends Module {
	public override readonly name = 'Dice';

	@boundMethod
	public install() {
		return {
			mentionHook: this.mentionHook,
		};
	}

	@boundMethod
	private async mentionHook(message: Readonly<Message<boolean>>, query: queryMessage): Promise<boolean> {
		if (isNil(query.queryContent)) return false;
		if (query.queryContent.includes('サイコロ')) {
			const dice = Math.floor(Math.random() * 6) + 1;
			message.reply(`(ｺﾛｺﾛ) ${dice}が出ました！`);
			return true;
		} else {
			// message.queryContentに含まれる全角数字を半角に
			const number = query.queryContent.replace(/[０-９]/g, (s) => {
				return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
			});
			const diceQuery = number.match(/([0-9]+)[dD]([0-9]+)/);

			// diceQueryのすべての要素がStringなのかを確認
			// TODO: なんでindex1,2なの？？？
			if (
				diceQuery == null ||
				diceQuery.length !== 2 ||
				diceQuery[1] == null ||
				diceQuery[2] == null
			) return false;

			const times = parseInt(diceQuery[1], 10);
			const dice = parseInt(diceQuery[2], 10);

			if (times > 10) {
				message.reply('ダイスの数が多すぎますよ...');
				return true;
			};
			if (dice > 999999999) {
				message.reply('ダイスの目の数が多すぎます...');
				return true;
			};
			if (dice < 2 || times < 1) {
				message.reply('それってやる意味あります...？');
				return true;
			}

			const results: number[] = [];

			[...Array(times)].forEach(
				() => {
					results.push(Math.floor(Math.random() * dice) + 1);
				},
			);

			message.reply(`(ｺﾛｺﾛ) ${results.join(' ')} (合計: ${results.reduce((a, b) => a + b, 0)}) が出ました！`);
		}

		return true;
	}
}
