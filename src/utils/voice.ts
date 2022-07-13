/* eslint-disable require-jsdoc */
import {Na2Client} from '@/client.js';
import {
	joinVoiceChannel,
	entersState,
	VoiceConnectionStatus,
	createAudioResource,
	StreamType,
	createAudioPlayer,
	AudioPlayerStatus,
	NoSubscriberBehavior,
	generateDependencyReport,
	VoiceConnection,
} from '@discordjs/voice';
import {boundMethod} from 'autobind-decorator';
import {CommandInteraction, Guild, GuildMember, VoiceBasedChannel} from 'discord.js';
import log from '@/utils/log.js';
console.log(generateDependencyReport());

export class Na2Voice {
	private guild: Guild;
	private member: GuildMember | undefined;

	constructor(interaction: CommandInteraction) {
		this.guild = interaction.guild as Guild;
	}

	@boundMethod
	private async fetchMember(interaction: CommandInteraction): Promise<GuildMember> {
		return await this.guild.members.fetch(interaction.member!.user.id);
	}

	@boundMethod
	public async getMemberJoinedVoiceChannel(interaction: CommandInteraction): Promise<VoiceBasedChannel | null> {
		this.member = await this.fetchMember(interaction);
		return this.member.voice.channel;
	}

	@boundMethod
	public checkJoinable(channel: VoiceBasedChannel | null): {content: string, ephemeral: boolean} | true {
		if (!channel) {
			return {
				content: '接続先のVCが見つかりません。',
				ephemeral: true,
			};
		// } else if (!(channel.joinable)) { // やっぱりchannelの型が謎
		// 	return {
		// 		content: '接続先のVCに参加できません。権限の見直しをしてください。',
		// 		ephemeral: true,
		// 	};
		// } else if (!(channel.speakable)) { // channelの型が謎
		// 	return {
		// 		content: '接続先のVCに参加できません。権限の見直しをしてください。',
		// 		ephemeral: true,
		// 	};
		}	else {
			return true;
		}
	}

	@boundMethod
	public join(channelId: string, func: void, _selfMute: boolean = false): VoiceConnection {
		const connection = joinVoiceChannel({
			guildId: this.guild.id,
			channelId: channelId,
			adapterCreator: this.guild.voiceAdapterCreator,
			selfMute: false,
		});
		return connection;
	}
}
