import {
  isNil,
  type ChatInputCommandInteraction,
  type GuildMember,
} from '@/features/library/index.js';
import { getGuildFromInteraction } from '@/features/others/discord/index.js';

export const getInteractionMemberId = async (
  interaction: Readonly<ChatInputCommandInteraction>
): Promise<GuildMember> => {
  const guild = getGuildFromInteraction({ interaction });
  if (isNil(interaction.member)) throw new Error('Member is null.');
  return await guild.members.fetch(interaction.member.user.id);
};
