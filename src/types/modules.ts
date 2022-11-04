import type {
	interactionHookType,
	mentionHookType,
	streamHookType,
} from '@/types/types.js';

export abstract class Module {
	public readonly name: string = 'Module name';

	public abstract install():
		{ mentionHook: mentionHookType } |
		{ streamHook: streamHookType } |
		{ interactionHook: interactionHookType };
}
