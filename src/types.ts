import {Message} from 'discord.js';

type beforeIInitializeQueryMessage = Message<boolean> & {
	queryContent?: string;
	memberName?: string;
};

export type queryMessage = Required<beforeIInitializeQueryMessage>;
