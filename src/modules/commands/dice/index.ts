import { boundMethod } from 'autobind-decorator';
import type { ChatInputCommandInteraction } from 'discord.js';

import { Module } from '@/types/modules.js';
import type { commandSetType } from '@/types/types.js';

const command: commandSetType = {
	name: 'dice',
	description: '引数なしで6面ダイスを振ります。',
};


/**
 * ping module
 */
class Dice extends Module {
	public override readonly name = 'Dice';

	@boundMethod
	public install() {
		return {
			interactionHook: this.interactionHook,
		};
	}

	@boundMethod
	private async interactionHook(interaction: Readonly<ChatInputCommandInteraction>): Promise<boolean> {
		if (interaction.commandName === 'dice') {
			const dice = Math.floor(Math.random() * 6) + 1;
			interaction.reply(`(ｺﾛｺﾛ) ${dice}が出ました！`);
			return true;
		} else {
			return false;
		}
	}
}

export { command as diceCommandSetter, Dice };
