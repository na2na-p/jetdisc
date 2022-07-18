import {CommandInteraction, Message} from 'discord.js';

type beforeIInitializeQueryMessage = Message<boolean> & {
	queryContent?: string;
	memberName?: string;
};

export type queryMessage = Required<beforeIInitializeQueryMessage>;

export type commandSetType = {name: string, description: string};

export type interactionHookType = (interaction: Readonly<CommandInteraction>) => Promise<boolean>;
export type mentionHookType = (message: Readonly<queryMessage>) => Promise<boolean>;
export type streamHookType = (message: Readonly<queryMessage>) => Promise<boolean>;

export type installedHooksType<T>
	=	T extends interactionHookType ? interactionHookType
	: T extends mentionHookType ? mentionHookType
	: T extends streamHookType ? streamHookType
	: never;

export type module<T> = {
	name: string,
	install(): installedHooksType<T>
};
