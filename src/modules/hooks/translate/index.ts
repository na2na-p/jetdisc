import { boundMethod } from 'autobind-decorator';
import { Message } from 'discord.js';
import { Translator } from 'deepl-node';

import type { queryMessage } from '@/types/types.js';
import { Module } from '@/types/modules.js';
import { config } from '@/config/index.js';

/**
 * ping module
 */
export class Translate extends Module {
	public override readonly name = 'Translate';

	public install() {
		return {
			mentionHook: this.mentionHook,
		};
	}

	@boundMethod
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
