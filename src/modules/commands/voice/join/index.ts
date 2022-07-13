/* eslint-disable require-jsdoc */
import {boundMethod} from 'autobind-decorator';
import {CommandInteraction} from 'discord.js';
import {commandSetType} from '@/types.js';
import {Na2Voice} from '@/utils/voice.js';


// コマンドセットする用
const command: commandSetType = {
	name: 'vcjoin',
	description: 'ボイスチャットに参加します。',
};

/**
 * ping module
 */
class VCJoin {
	public readonly name = 'VCJoin';

	@boundMethod
	public install() {
		return {
			interactionHook: this.interactionHook,
		};
	}

	@boundMethod
	private async interactionHook(interaction: CommandInteraction): Promise<boolean> {
		if (interaction.commandName === 'vcjoin') {
			const voice = new Na2Voice(interaction);
			console.log(voice);
			const channel = await voice.getMemberJoinedVoiceChannel(interaction);
			console.log(channel);
			const status = voice.checkJoinable(channel);
			if (status !== true && typeof status !== 'boolean') {
				interaction.reply(status);
				return true;
			}
			voice.join(channel!.id);
			return true;
		} else {
			return false;
		}
	}
}

export {command as VCJoinCommandSetter, VCJoin};
