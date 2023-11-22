import {
  isNil,
  type ChatInputCommandInteraction,
  type VoiceConnection,
  getVoiceConnection,
} from '@/features/library/index.js';
import { getActorId } from '@/features/others/discord/index.js';

export const getActorConnection = async ({
  interaction,
  connections,
}: {
  interaction: Readonly<ChatInputCommandInteraction>;
  connections: Array<{
    guildId: string;
    connection: VoiceConnection;
  }>;
}): Promise<VoiceConnection | null> => {
  const guildId = interaction.guildId;
  if (isNil(guildId)) return null;

  const connection = connections.find(
    connection => connection.guildId === guildId
  );

  if (isNil(connection)) {
    const actor = await getActorId(interaction);
    const connection = getVoiceConnection(actor.guild.id);

    if (isNil(connection)) return null;
    else return connection;
  } else {
    return connection.connection;
  }
};
