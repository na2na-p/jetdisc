import {Message} from 'discord.js';
export type queryMessage = Message<boolean> & {
	queryContent?: string;
};
