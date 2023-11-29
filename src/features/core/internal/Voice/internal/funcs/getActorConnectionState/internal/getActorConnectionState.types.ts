import { ConnectionState } from '@/features/core/index.js';
import { ChatInputCommandInteraction } from '@/features/library/index.js';

export interface getActorConnectionStateInterface {
  (args: {
    interaction: Readonly<ChatInputCommandInteraction>;
    connections: Array<ConnectionState>;
  }): Promise<ConnectionState | null>;
}
