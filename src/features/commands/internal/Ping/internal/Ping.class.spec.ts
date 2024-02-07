import type { Store } from '@/features/core/index.js';
import type {
  CacheType,
  ChatInputCommandInteraction,
} from '@/features/library/index.js';

import { Ping } from './Ping.class.js';

describe('Ping', () => {
  let ping: Ping;
  const mockedStore = vi.mocked<Store>(
    {
      getVoiceConnection: vi.fn(),
      setVoiceConnection: vi.fn(),
      getVoicePlayer: vi.fn(),
      setVoicePlayer: vi.fn(),
    },
    { deep: true }
  );

  beforeEach(() => {
    ping = new Ping({ store: mockedStore });
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
