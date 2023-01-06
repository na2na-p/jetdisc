import { DlsiteReact } from '@/modules/hooks/dlsite/index.js';

import { createMessage } from '../../../utils.js';

const WORKS = [
	'VJ004047',
	'VJ004049',
	'VJ004592',
];

const dlsiteReactHook = new DlsiteReact().install().streamHook;


describe('DlsiteReact', () => {
	it('Botの投稿に反応しない', async () => {
		const message = createMessage({
			react: () => {},
			channel: {
				send: () => {},
			},
		}, true);
		const query = WORKS[0];
		expect(
			dlsiteReactHook(
				message,
				{ queryContent: query, memberName: 'bot' },
			),
		).resolves.toBe(false);
	});
	it('文字列中に1つあるidを抽出できる', async () => {
		const message = createMessage({
			react: () => {},
			channel: {
				send: () => {},
			},
		}, false);
		const query = `あR${WORKS[0]}0iii`;
		expect(dlsiteReactHook(
			message,
			{ queryContent: query, memberName: 'bot' },
		)).resolves.toBe(true);
	});
	it('文字列中に3つあるidを抽出できる', async () => {
		const message = createMessage({
			react: () => {},
			channel: {
				send: () => {},
			},
		}, false);
		const query = `あR${WORKS[0]}0i${WORKS[1]}8ii${WORKS[3]}`;
		dlsiteReactHook(
			message,
			{ queryContent: query, memberName: 'bot' },
		);
		// sendMockの実行時の引数をconsole.logする
		expect(dlsiteReactHook(
			message,
			{ queryContent: query, memberName: 'bot' },
		)).resolves.toBe(true);
	});
});
