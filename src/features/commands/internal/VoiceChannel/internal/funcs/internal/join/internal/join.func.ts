import type { ChatInputCommandInteraction } from '@/features/library/index.js';
import { getInteractionMemberId } from '@/features/others/discord/index.js';

import { checkJoinable } from './checkJoinable.func.js';

export const join = async ({
  interaction,
}: {
  interaction: Readonly<ChatInputCommandInteraction>;
}): Promise<boolean> => {
  const member = await getInteractionMemberId(interaction);
  const channel = member.voice.channel;
  const checkJoinableResult = checkJoinable({ channel });
  if (checkJoinableResult !== true) {
    interaction.reply(checkJoinableResult);
    return Promise.resolve(true);
  }

  interaction.reply('参加しました');
  return Promise.resolve(true);
};
