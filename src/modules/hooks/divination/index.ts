/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
import {boundMethod} from 'autobind-decorator';
import {queryMessage} from '@/types.js';
import {config} from '@/config.js';
import {MessageEmbed, ColorResolvable, EmbedFooterData} from 'discord.js';
import dayjs from 'dayjs';
import translate from 'deepl';
import color from 'color';

type divination = {
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

type horoscope = '牡羊座' | '牡牛座' | '双子座' | '蟹座' | '獅子座' | '乙女座' | '天秤座' | '蠍座' | '射手座' | '山羊座' | '水瓶座' | '魚座';

const horoscope = {
	'牡羊座': 'aries',
	'おひつじ座': 'aries',
	'牡牛座': 'taurus',
	'おうし座': 'taurus',
	'双子座': 'gemini',
	'ふたご座': 'gemini',
	'蟹座': 'cancer',
	'かに座': 'cancer',
	'獅子座': 'leo',
	'しし座': 'leo',
	'乙女座': 'virgo',
	'おとめ座': 'virgo',
	'天秤座': 'libra',
	'てんびん座': 'libra',
	'蠍座': 'scorpio',
	'さそり座': 'scorpio',
	'射手座': 'sagittarius',
	'いて座': 'sagittarius',
	'山羊座': 'capricorn',
	'やぎ座': 'capricorn',
	'水瓶座': 'aquarius',
	'みずがめ座': 'aquarius',
	'魚座': 'pisces',
	'うお座': 'pisces',
};

type parsedDivination = {
	[key in horoscope]: divination;
};

/**
 * 占い
 */
export class Divination {
	public readonly name = 'Divination';
	private date: string = '';
	private luckeyColor: ColorResolvable = 'WHITE';

	@boundMethod
	public install() {
		return {
			mentionHook: this.mentionHook,
		};
	}

	@boundMethod
	private async mentionHook(message: Readonly<queryMessage>): Promise<boolean> {
		if (message.queryContent.endsWith(`運勢は？`)) {
			// YYYY/MM/DDにする
			this.date = dayjs().format('YYYY/MM/DD');
			// 「今日の」と「運勢は」の間にある文字列を抽出する
			const signQuery = message.queryContent.replace(/今日の|の運勢は？/g, '');
			// signがhoroscopeに含まれているか確認する
			if (Object.keys(horoscope).includes(signQuery)) {
				const sign = signQuery as horoscope;
				const divination = await this.getDivination(sign);
				const embed = await this.makeEmbed(divination);
				message.reply({embeds: [embed]});
			}
			return false;
		} else {
			return false;
		}
	}

	/**
	 * @param {string} sign
	 * @return {divination} 引数で渡した星座の運勢を返す
	 */
	@boundMethod
	private async getDivination(sign: horoscope): Promise<divination> {
		const jugemkey = 'http://api.jugemkey.jp/api/horoscope/free/' + this.date;
		const options = {
			method: 'GET',
			url: jugemkey,
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const response: Array<divination> =
			JSON.parse(await (await fetch(options.url, options)).text()).horoscope[`${this.date}`];

		const protoResult: Partial<parsedDivination> = {};

		response.forEach((eachResults) => {
			// resultに[key: eachResults.sign]: eachResultsを追加する
			const key: keyof parsedDivination = eachResults.sign;
			protoResult[key] = eachResults;
		});
		const result = protoResult as parsedDivination;
		return result[sign];
	}

	/**
	 * Discord送信用のembedを作成する
	 * @param {divination} divination 運勢(1星座のみ入ってるやつ)
	 * @return {Promise<MessageEmbed>}
	 */
	private async makeEmbed(divination: Readonly<divination>): Promise<MessageEmbed> {
		try {
			const colorEng = await translate({
				free_api: true,
				text: divination.color,
				target_lang: 'EN',
				source_lang: 'JA',
				auth_key: config.deeplApiKey,
			});
			this.luckeyColor = color(colorEng.data.translations[0].text).hex().toUpperCase() as ColorResolvable;
		} catch (error) {
			// console.log(error);
			this.luckeyColor = 'WHITE';
		}

		const footerOptions: EmbedFooterData = {
			text: 'powerd by JugemKey',
			iconURL: 'http://jugemkey.jp/api/waf/api_free.php',
		};

		const embed: MessageEmbed = new MessageEmbed();
		embed.setColor(this.luckeyColor);
		embed.setTitle(`${divination.sign}の今日の運勢は...`);
		embed.addField('総合運', `${divination.total}`, false);
		embed.addField('金運', `${divination.money}`, true);
		embed.addField('仕事運', `${divination.job}`, true);
		embed.addField('恋愛運', `${divination.love}`, true);
		embed.addField('ラッキーアイテム', `${divination.item}`, false);
		embed.addField('ラッキーカラー', `${divination.color}`, true);
		embed.addField('コメント', `${divination.content}`, false);
		embed.setTimestamp();
		embed.setFooter(footerOptions);
		return embed;
	}
}
