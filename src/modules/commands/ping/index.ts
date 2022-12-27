import { boundMethod } from 'autobind-decorator';
import type { ChatInputCommandInteraction } from 'discord.js';

import { Module } from '@/types/modules.js';
import type { commandSetType } from '@/types/types.js';

// コマンドセットする用
const command: commandSetType = {
	name: 'ping',
	description: 'ping',
};

/**
 * ping module
 */
class Ping extends Module {
	public override readonly name = 'Ping';

	@boundMethod
	public install() {
		return {
			interactionHook: this.interactionHook,
		};
	}

	@boundMethod
	private async interactionHook(interaction: Readonly<ChatInputCommandInteraction>): Promise<boolean> {
		if (interaction.commandName === 'ping') {
			// interaction.createdAtから応答するまでの時間を取得し、replyに渡す
			interaction.reply(`RTT: ${(new Date()).getTime() - interaction.createdAt.getTime()}ms`);
			return true;
		} else {
			return false;
		}
	}
}

export { command as pingCommandSetter, Ping };
