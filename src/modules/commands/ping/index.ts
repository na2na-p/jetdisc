/* eslint-disable require-jsdoc */
import {boundMethod} from 'autobind-decorator';
import {CommandInteraction} from 'discord.js';
import {commandSetType} from '@/types.js';

// コマンドセットする用
const command: commandSetType = {
	name: 'ping',
	description: 'ping',
};

/**
 * ping module
 */
class Ping {
	public readonly name = 'Ping';

	@boundMethod
	public install() {
		return {
			interactionHook: this.interactionHook,
		};
	}

	@boundMethod
	private async interactionHook(interaction: Readonly<CommandInteraction>): Promise<boolean> {
		if (interaction.commandName === 'ping') {
			// interaction.createdAtから応答するまでの時間を取得し、replyに渡す
			interaction.reply(`RTT: ${(new Date()).getTime() - interaction.createdAt.getTime()}ms`);
			return true;
		} else {
			return false;
		}
	}
}

export {command as pingCommandSetter, Ping};
