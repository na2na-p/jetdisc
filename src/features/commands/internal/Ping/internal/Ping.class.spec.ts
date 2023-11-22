import type {
  CacheType,
  ChatInputCommandInteraction,
} from '@/features/library/index.js';

import { Ping } from './Ping.class.js';

describe('Ping', () => {
  let ping: Ping;

  beforeEach(() => {
    ping = new Ping();
  });

  describe('interact', () => {
    it('should reply with the RTT in milliseconds', async () => {
      const interaction = {
        createdAt: new Date('2022-01-01T00:00:00.000Z'),
        reply: vi.fn(),
      } as unknown as Readonly<ChatInputCommandInteraction<CacheType>>;
      const expectedRTT = 100;

      vi.spyOn(Date, 'now').mockReturnValueOnce(
        new Date('2022-01-01T00:00:00.100Z').getTime()
      );

      await ping.interact({ interaction });

      expect(interaction.reply).toHaveBeenCalledWith(`RTT: ${expectedRTT}ms`);
    });
  });
});
