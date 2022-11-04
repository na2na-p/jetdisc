import {
	AutocompleteInteraction,
	ButtonInteraction,
	CacheType,
	ChatInputCommandInteraction,
	Interaction,
	Message,
	MessageContextMenuCommandInteraction,
	ModalSubmitInteraction,
	SelectMenuInteraction,
	UserContextMenuCommandInteraction,
} from 'discord.js';

export type queryMessage = {
	queryContent: string;
	memberName: string;
};

export type commandSetType = {name: string, description: string};

// TODO: 型見直し
export type na2InteractionType<T>
	= T extends ChatInputCommandInteraction ? ChatInputCommandInteraction<CacheType>
	: T extends MessageContextMenuCommandInteraction ? MessageContextMenuCommandInteraction<CacheType>
	: T extends UserContextMenuCommandInteraction ? UserContextMenuCommandInteraction<CacheType>
	: T extends SelectMenuInteraction ? SelectMenuInteraction<CacheType>
	: T extends ButtonInteraction ? ButtonInteraction<CacheType>
	: T extends AutocompleteInteraction ? AutocompleteInteraction<CacheType>
	: T extends ModalSubmitInteraction ? ModalSubmitInteraction<CacheType>
	: T extends Interaction ? Interaction<CacheType>
	: never;

// これ使うってことはすでに型の絞り込みが済んでるので、ジェネリクスで指定できるように何か作るべき
// それで出来たのがna2InteractionType<T>だけどなんか違う
export type interactionHookType = (interaction: Readonly<ChatInputCommandInteraction>) => Promise<boolean>;
export type mentionHookType = (message: Readonly<Message<boolean>>, query: queryMessage) => Promise<boolean>;
export type streamHookType = (message: Readonly<Message<boolean>>, query: queryMessage) => Promise<boolean>;

export type installedHooksType<T>
	=	T extends interactionHookType ? interactionHookType
	: T extends mentionHookType ? mentionHookType
	: T extends streamHookType ? streamHookType
	: never;

export type module<T> = {
	name: string,
	install(): installedHooksType<T>
};
