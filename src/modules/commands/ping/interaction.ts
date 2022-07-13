/* eslint-disable require-jsdoc */
import {boundMethod} from 'autobind-decorator';
import {CommandInteraction} from 'discord.js';

/**
 * ping module
 */
export class Ping {
	public readonly name = 'Ping';

	@boundMethod
	public install() {
		return {
			interactionHook: this.interactionHook,
		};
	}

	@boundMethod
	private async interactionHook(interaction: CommandInteraction): Promise<boolean> {
		if (interaction.commandName === 'ping') {
			interaction.reply('pong');
			return true;
		} else {
			return false;
		}
	}
}
