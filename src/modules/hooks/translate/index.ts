/* eslint-disable require-jsdoc */
import {queryMessage} from '@/types.js';
import {config} from '@/config.js';
import translate from 'deepl';
import {Message} from 'discord.js';

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

	private async mentionHook(message: Readonly<Message<boolean>>, query: queryMessage): Promise<boolean> {
		if (query.queryContent?.endsWith('を英語で')) {
			const translateQuery = query.queryContent.replace('を英語で', '');
			const result = await translate({
				free_api: true,
				text: translateQuery,
				auth_key: config.deeplApiKey,
				target_lang: 'EN',
			});
			message.reply(`\`${result.data.translations[0].text}\`\nこんな意味らしいですよ！ > ${query.memberName}さん`);
			return true;
		} else if (query.queryContent.endsWith('を日本語で')) {
			const translateQuery = query.queryContent.replace('を日本語で', '');
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
