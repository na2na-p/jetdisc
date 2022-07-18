/* eslint-disable require-jsdoc */
import {queryMessage} from '@/types.js';
import {config} from '@/config.js';
import translate from 'deepl';

/**
 * ping module
 */
export class Translate {
	public readonly name = 'Translate';

	public install() {
		return {
			mentionHook: this.mentionHook,
		};
	}

	private async mentionHook(message: Readonly<queryMessage>): Promise<boolean> {
		if (message.queryContent?.endsWith('を英語で')) {
			const translateQuery = message.queryContent.replace('を英語で', '');
			const result = await translate({
				free_api: true,
				text: translateQuery,
				auth_key: config.deeplApiKey,
				target_lang: 'EN',
			});
			message.reply(`\`${result.data.translations[0].text}\`\nこんな意味らしいですよ！ > ${message.memberName}さん`);
			return true;
		} else if (message.queryContent?.endsWith('を日本語で')) {
			const translateQuery = message.queryContent.replace('を日本語で', '');
			const result = await translate({
				free_api: true,
				text: translateQuery,
				auth_key: config.deeplApiKey,
				target_lang: 'JA',
			});
			message.reply(result.data.translations[0].text);
			return true;
		} else {
			return false;
		}
	}
}
