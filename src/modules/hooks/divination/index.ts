import { boundMethod } from 'autobind-decorator';
import { EmbedBuilder, ColorResolvable, EmbedFooterData, Message } from 'discord.js';
import dayjs from 'dayjs';
import { Translator } from 'deepl-node';
import color from 'color';

import type { queryMessage } from '@/types/types.js';
import { Module } from '@/types/modules.js';
import { config } from '@/config/index.js';

import { getDivination } from './divitation.js';

export type divination = {
	content: string,
	item: string,
	money: 1 | 2 | 3 | 4 | 5,
	total: 1 | 2 | 3 | 4 | 5,
	job: 1 | 2 | 3 | 4 | 5,
	color: string,
	day: number | string,
	love: 1 | 2 | 3 | 4 | 5,
	rank: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
	sign: horoscope
}

export type horoscope = '牡羊座' | '牡牛座' | '双子座' | '蟹座' | '獅子座' | '乙女座' | '天秤座' | '蠍座' | '射手座' | '山羊座' | '水瓶座' | '魚座';

export const horoscope = {
	'牡羊座': '牡羊座',
	'おひつじ座': '牡羊座',
	'牡牛座': '牡牛座',
	'おうし座': '牡牛座',
	'双子座': '双子座',
	'ふたご座': '双子座',
	'蟹座': '蟹座',
	'かに座': '蟹座',
	'獅子座': '獅子座',
	'しし座': '獅子座',
	'乙女座': '乙女座',
	'おとめ座': '乙女座',
	'天秤座': '天秤座',
	'てんびん座': '天秤座',
	'蠍座': '蠍座',
	'さそり座': '蠍座',
	'射手座': '射手座',
	'いて座': '射手座',
	'山羊座': '山羊座',
	'やぎ座': '山羊座',
	'水瓶座': '水瓶座',
	'みずがめ座': '水瓶座',
	'魚座': '魚座',
	'うお座': '魚座',
};

/**
 * 占い
 */
export class Divination extends Module {
	public override readonly name = 'Divination';
	private date: string = '';
	private luckyColor: ColorResolvable = 'White';

	@boundMethod
	public install() {
		return {
			mentionHook: this.mentionHook,
		};
	}

	@boundMethod
	private async mentionHook(message: Readonly<Message<boolean>>, query: queryMessage): Promise<boolean> {
		if (query.queryContent.endsWith(`運勢は？`)) {
			// YYYY/MM/DDにする
			this.date = dayjs().format('YYYY/MM/DD');
			// 「今日の」と「運勢は」の間にある文字列を抽出する
			const signQuery = query.queryContent.replace(/今日の|の運勢は？/g, '').replace(/\s/g, '');
			// signがhoroscopeに含まれているか確認する
			if (Object.keys(horoscope).includes(signQuery)) {
				const sign = Object(horoscope)[signQuery] as horoscope;
				const divination = await getDivination(sign, this.date);
				const embed = await this.makeEmbed(divination);
				message.reply({ embeds: [embed] });
			}
			return false;
		} else {
			return false;
		}
	}

	/**
	 * Discord送信用のembedを作成する
	 * @param {divination} divination 運勢(1星座のみ入ってるやつ)
	 * @return {Promise<EmbedBuilder>}
	 */
	private async makeEmbed(divination: Readonly<divination>): Promise<EmbedBuilder> {
		try {
			const translator = new Translator(config.deeplApiKey);
			const colorEng = await translator.translateText(divination.color, null, 'en-US');
			this.luckyColor = color(colorEng.text).hex().toUpperCase() as ColorResolvable;
		} catch (error) {
			this.luckyColor = 'White';
		}

		const footerOptions: EmbedFooterData = {
			text: 'powered by JugemKey',
			iconURL: 'http://jugemkey.jp/api/waf/api_free.php',
		};
		const embed = new EmbedBuilder();
		embed.setColor(this.luckyColor);
		embed.setTitle(`${divination.sign}の今日の運勢は...`);
		embed.addFields([
			{ name: '総合運', value: `${divination.total}`, inline: false },
			{ name: '金運', value: `${divination.money}`, inline: true },
			{ name: '仕事運', value: `${divination.job}`, inline: true },
			{ name: '恋愛運', value: `${divination.love}`, inline: true },
			{ name: 'ラッキーアイテム', value: `${divination.item}`, inline: false },
			{ name: 'ラッキーカラー', value: `${divination.color}`, inline: true },
			{ name: 'コメント', value: `${divination.content}`, inline: false },
		]);
		embed.setTimestamp();
		embed.setFooter(footerOptions);
		return embed;
	}
}
