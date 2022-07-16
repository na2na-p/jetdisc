/* eslint-disable require-jsdoc */
import {boundMethod} from 'autobind-decorator';
import {queryMessage} from '@/types.js';

/**
 * ping module
 */
export class Search {
	public readonly name = 'Search';

	@boundMethod
	public install() {
		return {
			streamHook: this.streamHook,
		};
	}

	@boundMethod
	private async streamHook(message: Readonly<queryMessage>): Promise<boolean> {
		if (message.queryContent.endsWith('検索')) {
			let searchQuery = message.content.replace('検索', '');
			// searchQueryの一番後ろにスペースがある場合は削除
			if (searchQuery.endsWith(' ') || searchQuery.endsWith('　')) {
				searchQuery = searchQuery.slice(0, -1);
			}
			// queryはURIエンコードする
			const query = encodeURIComponent(searchQuery);
			const searchUrl = 'https://www.google.com/search?q=' + query;
			message.reply(`自分で調べようね～\n${searchUrl}`);
			return true;
		}
		return false;
	}
};
