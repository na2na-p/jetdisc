import type { Mock } from 'vitest';

import {
  joinVoiceChannel,
  getVoiceConnection,
} from '@/features/library/index.js';
import type {
  ChatInputCommandInteraction,
  GuildMember,
  VoiceConnection,
} from '@/features/library/index.js';
import { LogicException } from '@/features/others/Error/LogicException.js';
import { getInteractionMemberId } from '@/features/others/discord/index.js';

import { Voice } from './Voice.class.js';
import {
  JOINABLE_STATE_STATUS,
  getJoinableStateStatus,
} from './funcs/getJoinableStateStatus/index.js';

vi.mock('@/features/others/discord/index.js', async () => {
  const actual = (await vi.importActual(
    '@/features/others/discord/index.js'
  )) as object;
  return {
    ...actual,
    getInteractionMemberId: vi.fn(),
  };
});

vi.mock('@/features/library/index.js', async () => {
  const actual = (await vi.importActual(
    '@/features/library/index.js'
  )) as object;
  return {
    ...actual,
    joinVoiceChannel: vi.fn(),
    getVoiceConnection: vi.fn(),
  };
});

vi.mock('./funcs/getJoinableStateStatus/index.js', async () => {
  const actual = (await vi.importActual(
    './funcs/getJoinableStateStatus/index.js'
  )) as object;
  return {
    ...actual,
    getJoinableStateStatus: vi.fn(),
  };
});

describe('Voice', () => {
  let voice: Voice;

  beforeEach(() => {
    voice = new Voice();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('join', () => {
    it('should reply with an error message if the channel is not found', async () => {
      const mockedInteraction = {
        reply: vi.fn(),
      } as unknown as Readonly<ChatInputCommandInteraction>;

      (getInteractionMemberId as Mock).mockResolvedValueOnce({
        voice: { channel: null },
      });
      (getJoinableStateStatus as Mock).mockReturnValueOnce(
        JOINABLE_STATE_STATUS.NOT_FOUND
      );

      await voice.join({ interaction: mockedInteraction });

      expect(getJoinableStateStatus).toHaveBeenCalledWith({ channel: null });
      expect(mockedInteraction.reply).toHaveBeenCalledWith({
        content: '接続先のVCが見つかりません。',
        ephemeral: false,
      });
    });

    it('should reply with an error message if the channel is not joinable', async () => {
      const mockedInteraction = {
        reply: vi.fn(),
      } as unknown as Readonly<ChatInputCommandInteraction>;

      (getInteractionMemberId as Mock).mockResolvedValueOnce({
        voice: { channel: { joinable: true } },
      });
      (getJoinableStateStatus as Mock).mockReturnValueOnce(
        JOINABLE_STATE_STATUS.NOT_JOINABLE
      );

      await voice.join({ interaction: mockedInteraction });

      expect(getJoinableStateStatus).toHaveBeenCalledWith({
        channel: { joinable: true },
      });
      expect(mockedInteraction.reply).toHaveBeenCalledWith({
        content: '接続先のVCに参加できません。権限の見直しをしてください。',
        ephemeral: true,
      });
    });

    it('should reply with an error message if the channel is not viewable', async () => {
      const mockedInteraction = {
        reply: vi.fn(),
      } as unknown as Readonly<ChatInputCommandInteraction>;

      (getInteractionMemberId as Mock).mockResolvedValueOnce({
        voice: { channel: { joinable: true, viewable: false } },
      });
      (getJoinableStateStatus as Mock).mockReturnValueOnce(
        JOINABLE_STATE_STATUS.NOT_VIEWABLE
      );

      await voice.join({ interaction: mockedInteraction });

      expect(getJoinableStateStatus).toHaveBeenCalledWith({
        channel: { joinable: true, viewable: false },
      });
      expect(mockedInteraction.reply).toHaveBeenCalledWith({
        content: '接続先のVCに参加できません。権限の見直しをしてください。',
        ephemeral: true,
      });
    });

    it('should throw an error if the channel is null', async () => {
      const interaction = {
        reply: vi.fn(),
      } as unknown as Readonly<ChatInputCommandInteraction>;

      (getInteractionMemberId as Mock).mockRejectedValueOnce(
        new LogicException(
          'Channel is null. Please check getJoinableStateStatus()'
        )
      );

      await expect(voice.join({ interaction })).rejects.toThrowError(
        'Channel is null. Please check getJoinableStateStatus()'
      );
    });

    it('should throw an error if the channel is null', async () => {
      const mockedInteraction = {
        reply: vi.fn(),
      } as unknown as Readonly<ChatInputCommandInteraction>;

      (getInteractionMemberId as Mock).mockResolvedValueOnce({
        voice: { channel: null },
      });
      (getJoinableStateStatus as Mock).mockReturnValueOnce(
        JOINABLE_STATE_STATUS.JOINABLE
      );

      await expect(
        voice.join({ interaction: mockedInteraction })
      ).rejects.toThrowError(
        'Channel is null. Please check getJoinableStateStatus()'
      );
    });

    it('should join the voice channel and return true', async () => {
      const mockedGuildMember = {
        voice: {
          channel: {
            id: 'channelId',
            guild: {
              id: 'guildId',
              voiceAdapterCreator: vi.fn(),
              joinable: true,
              viewable: true,
            },
          },
        },
      } as const as unknown as Readonly<GuildMember>;

      const mockedInteraction = {
        reply: vi.fn(),
      } as const as unknown as Readonly<ChatInputCommandInteraction>;

      (getInteractionMemberId as Mock).mockResolvedValueOnce(mockedGuildMember);
      (joinVoiceChannel as Mock).mockReturnValueOnce('connection');
      (getJoinableStateStatus as Mock).mockReturnValueOnce(
        JOINABLE_STATE_STATUS.JOINABLE
      );

      const result = await voice.join({ interaction: mockedInteraction });

      expect(getJoinableStateStatus).toHaveBeenCalledWith(
        mockedGuildMember.voice
      );
      expect(joinVoiceChannel).toHaveBeenCalledWith({
        channelId: 'channelId',
        guildId: 'guildId',
        adapterCreator: expect.any(Function),
      });
      expect(voice['connection']).toEqual([
        { guildId: 'guildId', connection: 'connection' },
      ]);
      expect(result).toBe(true);
    });

    it('should throw an error if the joinable type is unknown', async () => {
      const interaction = {
        voice: { channel: { joinable: true, viewable: true } },
        reply: vi.fn(),
      } as unknown as Readonly<ChatInputCommandInteraction>;

      (getInteractionMemberId as Mock).mockResolvedValueOnce({
        voice: { channel: null },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getJoinableStateStatus as Mock).mockReturnValueOnce('unknown' as any);

      await expect(voice.join({ interaction })).rejects.toThrowError(
        'Unknown joinable type.'
      );
    });
  });

  describe('leave', () => {
    it('should return false if guildId is null', async () => {
      const interaction = {
        guildId: null,
      } as unknown as Readonly<ChatInputCommandInteraction>;

      const result = await voice.leave({ interaction });

      expect(result).toBe(false);
    });

    it('should destroy the connection and return true if the target connection exists', async () => {
      const interaction = {
        guildId: 'guildId',
      } as unknown as Readonly<ChatInputCommandInteraction>;

      voice['connection'] = [
        {
          guildId: 'guildId',
          connection: {
            destroy: vi.fn(),
          } as unknown as VoiceConnection,
        },
      ];

      const result = await voice.leave({ interaction });

      expect(voice['connection']).toEqual([]);
      expect(result).toBe(true);
    });

    it('should destroy the connection and return true if the target connection does not exist but the member has a connection', async () => {
      const interaction = {
        guildId: 'guildId',
      } as unknown as Readonly<ChatInputCommandInteraction>;

      (getInteractionMemberId as Mock).mockResolvedValueOnce({
        guild: { id: 'guildId' },
      });
      (getVoiceConnection as Mock).mockReturnValueOnce({
        destroy: vi.fn(),
      });

      const result = await voice.leave({ interaction });

      expect(getVoiceConnection).toHaveBeenCalledWith('guildId');
      expect(result).toBe(true);
    });

    it('should return false if the target connection does not exist and the member does not have a connection', async () => {
      const interaction = {
        guildId: 'guildId',
      } as unknown as Readonly<ChatInputCommandInteraction>;

      (getInteractionMemberId as Mock).mockResolvedValueOnce({
        guild: { id: 'guildId' },
      });
      (getVoiceConnection as Mock).mockReturnValueOnce(null);

      const result = await voice.leave({ interaction });

      expect(result).toBe(false);
    });
  });
});
