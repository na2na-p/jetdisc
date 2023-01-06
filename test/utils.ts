import type { Message } from 'discord.js';

import type { RecursivePartial } from '@/types/RecursivePartial.js';

export const createMessage = (
	{ react, channel }: {
		react: (message?: string) => void,
		channel: {
			send: (message?: string) => void,
		}
	},
	isBot: boolean = false,
): RecursivePartial<Readonly<Message<boolean>>> => {
	return {
		author: {
			bot: isBot,
		},
		react,
		channel,
	};
};
