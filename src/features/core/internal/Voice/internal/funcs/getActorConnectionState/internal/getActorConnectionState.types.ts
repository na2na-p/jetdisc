import type { ConnectionState } from '@/features/core/index.js';
import type { ChatInputCommandInteraction } from '@/features/library/index.js';

export interface GetActorConnectionStateInterface {
  (args: {
    interaction: Readonly<ChatInputCommandInteraction>;
    connections: Array<ConnectionState>;
  }): Promise<ConnectionState | null>;
}
