import { boundMethod } from 'autobind-decorator';
import type { Message } from 'discord.js';

import { Module } from '@/types/modules.js';
import type { queryMessage } from '@/types/types.js';
import fetchChatGPT from '@/utils/fetchChatGPT.js';


/**
 * ChatGPT module
 */
export class ChatGPT extends Module {
	public override readonly name = 'ChatGPT';

	@boundMethod
	public install() {
		return {
			mentionHook: this.mentionHook,
		};
	}

	@boundMethod
	private async mentionHook(message: Readonly<Message<boolean>>, query: queryMessage): Promise<boolean> {
		if (query.queryContent.startsWith('ChatGPT')) {
			const prompt = query.queryContent.replace('ChatGPT ', '').trim();
			const completions = await fetchChatGPT({ prompt });
			message.reply(completions);
			return true;
		} else {
			return false;
		}
	}
}
