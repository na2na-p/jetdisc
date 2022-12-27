import { boundMethod } from 'autobind-decorator';
import type { ChatInputCommandInteraction } from 'discord.js';

import { Module } from '@/types/modules.js';
import type { commandSetType } from '@/types/types.js';
import fetchChatGPT from '@/utils/fetchChatGPT.js';

// コマンドセットする用
const command: commandSetType = {
	name: 'chatgpt',
	description: 'おしゃべりAIです。予告なく使えなくなる場合があります。',
	options: [
		{
			type: 3,
			name: 'prompt',
			description: 'AIに入力する文章です。',
			required: true,
		},
	],
};

/**
 * ping module
 */
class ChatGPT extends Module {
	public override readonly name = 'ChatGPT';

	@boundMethod
	public install() {
		return {
			interactionHook: this.interactionHook,
		};
	}

	@boundMethod
	private async interactionHook(interaction: Readonly<ChatInputCommandInteraction>): Promise<boolean> {
		if (interaction.commandName === 'chatgpt') {
			interaction.deferReply();
			const prompt = interaction.options.getString('prompt', true);
			const completions = await fetchChatGPT({ prompt });
			console.log(completions);
			interaction.editReply(completions);
			return true;
		} else {
			return false;
		}
	}
}

export { command as chatGPTCommandSetter, ChatGPT };
