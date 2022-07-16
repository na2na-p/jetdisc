/* eslint-disable require-jsdoc */
import {boundMethod} from 'autobind-decorator';
import {CommandInteraction} from 'discord.js';
import {commandSetType} from '@/types.js';

const command: commandSetType = {
	name: 'dice',
	description: '引数なしで6面ダイスを振ります。',
};


/**
 * ping module
 */
class Dice {
	public readonly name = 'Dice';

	@boundMethod
	public install() {
		return {
			interactionHook: this.interactionHook,
		};
	}

	@boundMethod
	private async interactionHook(interaction: Readonly<CommandInteraction>): Promise<boolean> {
		if (interaction.commandName === 'dice') {
			const dice = Math.floor(Math.random() * 6) + 1;
			interaction.reply(`(ｺﾛｺﾛ) ${dice}が出ました！`);
			return true;
		} else {
			return false;
		}
	}
}

export {command as diceCommandSetter, Dice};
