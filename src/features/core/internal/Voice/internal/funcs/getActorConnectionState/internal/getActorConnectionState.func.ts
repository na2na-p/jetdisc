import type { ConnectionState } from '@/features/core/index.js';
import { isNil, getVoiceConnection } from '@/features/library/index.js';
import type { ChatInputCommandInteraction } from '@/features/library/index.js';
import { getActorId } from '@/features/others/discord/index.js';

export const getActorConnectionState = async ({
  interaction,
  connections,
}: {
  interaction: Readonly<ChatInputCommandInteraction>;
  connections: Array<ConnectionState>;
}): Promise<ConnectionState | null> => {
  const guildId = interaction.guildId;
  if (isNil(guildId)) return null;

  const connection = connections.find(
    connection => connection.guildId === guildId
  );

  if (isNil(connection)) {
    const actor = await getActorId(interaction);
    const connection = getVoiceConnection(actor.guild.id);

    if (isNil(connection)) return null;
    else
      return {
        guildId: actor.guild.id,
        connection,
        player: undefined,
      };
  } else {
    return connection;
  }
};
