import { isNil, getVoiceConnection } from '@/features/library/index.js';
import { getActorId } from '@/features/others/discord/index.js';
import { GetActorConnectionStateInterface } from './getActorConnectionState.types.js';

export const getActorConnectionState: GetActorConnectionStateInterface =
  async ({ interaction, connections }) => {
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
