import { boundMethod } from 'autobind-decorator';
import { ChatInputCommandInteraction } from 'discord.js';
import { commandSetType } from '@/types/types.js';
import { Na2Voice } from '@/utils/voice.js';
import { Module } from '@/types/modules.js';


// コマンドセットする用
const command: commandSetType = {
	name: 'vcjoin',
	description: 'ボイスチャットに参加します。',
};

/**
 * ping module
 */
class VCJoin extends Module {
	public override readonly name = 'VCJoin';

	@boundMethod
	public install() {
		return {
			interactionHook: this.interactionHook,
		};
	}

	@boundMethod
	private async interactionHook(interaction: Readonly<ChatInputCommandInteraction>): Promise<boolean> {
		const voice = new Na2Voice(interaction);
		if (interaction.commandName === 'vcjoin') {
			const channel = await voice.getMemberJoinedVoiceChannel(interaction);
			// すでにBotがVCに参加しているか確認
			// const clientId = interaction.client.user?.id;
			// すでに参加済みのメンバを取得
			// その中に自分がいるかどうかでif文を分岐
			// if(){
			const status = voice.checkJoinable(channel);
			if (status !== true && typeof status !== 'boolean') {
				interaction.reply(status);
				return true;
			}
			voice.join(channel!.id);
			interaction.reply('VCに参加しました。');
			return true;
			// } else {
			// interaction.reply('すでにVCに参加しています。');
			// return true;
			// }
		} else if (interaction.commandName === 'vcleave') {
			const voice = new Na2Voice(interaction);
			const channel = await voice.getMemberJoinedVoiceChannel(interaction);
			const status = voice.checkJoinable(channel);
			if (status !== true && typeof status !== 'boolean') {
				interaction.reply(status);
				return true;
			}
			voice.join(channel!.id);
			interaction.reply('VCに参加しました。');
			return true;
		} else {
			return false;
		}
	}
}

export { command as VCJoinCommandSetter, VCJoin };
