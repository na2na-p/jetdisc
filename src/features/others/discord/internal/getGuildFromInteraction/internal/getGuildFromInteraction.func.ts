import {
  isNil,
  type ChatInputCommandInteraction,
  type Guild,
} from '@/features/library/index.js';

export const getGuildFromInteraction = ({
  interaction,
}: {
  interaction: Readonly<ChatInputCommandInteraction>;
}): Guild => {
  if (isNil(interaction.guild)) throw new Error('Guild is null.');
  return interaction.guild;
};
