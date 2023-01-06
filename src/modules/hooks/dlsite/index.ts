import { boundMethod } from 'autobind-decorator';
import type { Message } from 'discord.js';

import { Module } from '@/types/modules.js';
import type { queryMessage } from '@/types/types.js';
import dlsiteParse, {
	createDlsiteUri,
} from '@/utils/dlsiteParse/index.js';

/**
 * Dlsite reaction module
 */
export class DlsiteReact extends Module {
	public override readonly name = 'DlsiteReact';

	@boundMethod
	public install() {
		return {
			streamHook: this.streamHook,
		};
	}

	@boundMethod
	private async streamHook(message: Readonly<Message<boolean>>, query: queryMessage): Promise<boolean> {
		if (message.author.bot) return false;

		const dlsite = await dlsiteParse(query.queryContent);

		if (dlsite) {
			const serifs: string[] = ['買おうね'];
			dlsite.forEach((item) => {
				serifs.push(createDlsiteUri(item));
			});
			await message.react('🥰');
			await message.channel.send(serifs.join('\n'));
			return true;
		}
		return false;
	}
}
