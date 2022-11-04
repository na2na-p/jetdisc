import { queryMessage } from '@/types.js';
import { config } from '@/config/index.js';
import { Translator } from 'deepl-node';
import { Message } from 'discord.js';

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
			const translator = new Translator(config.deeplApiKey);
			const translateQuery = query.queryContent.replace('を英語で', '');
			const result = await translator.translateText(translateQuery, null, 'en-US');
			message.reply(`\`\`\`${result.text}\`\`\`\nこんな意味らしいですよ！ > ${query.memberName}さん`);
			return true;
		} else if (query.queryContent.endsWith('を日本語で')) {
			const translator = new Translator(config.deeplApiKey);
			const translateQuery = query.queryContent.replace('を日本語で', '');
			const result = await translator.translateText(translateQuery, null, 'ja');
			message.reply(`\`\`\`${result.text}\`\`\`\nこんな意味らしいですよ！ > ${query.memberName}さん`);
			return true;
		} else {
			return false;
		}
	}
}
