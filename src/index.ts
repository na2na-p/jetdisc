import {なずClient} from '@/client.js';
import {config} from '@/config.js';
import {queryMessage} from '@/types.js';
import chalk from 'chalk';

type installedHooksType = (message: queryMessage) => Promise<boolean>;

// モジュール群のインポート
import {Ping} from '@/modules/ping/index.js';
import {Dice} from '@/modules/dice/index.js';
import {Translate} from '@/modules/translate/index.js';
import {ColorPicker} from '@/modules/colorpicker/index.js';

// モジュール群のインスタンス化
const modules = [
	new Ping(),
	new Dice(),
	new Translate(),
	new ColorPicker(),
];

// モジュール群のインストール
const mentionHooks: installedHooksType[] = [];
for (const module of modules) {
	const result = module.install();
	if (result.mentionHook) mentionHooks.push(result.mentionHook);
	console.log(chalk.yellow(`Installed: ${module.name}`));
}

const client = new なずClient();

client.on('messageCreate', async (message) => {
	// prefixで始まる投稿をキャッチ
	if (message.content.startsWith(config.prefix) && !message.author.bot) {
		// messageからconfig.prefixを除去
		const queryMessage: Partial<queryMessage> = message;
		queryMessage.queryContent = message.content.replace(config.prefix, '');
		if (message.member === null) queryMessage.memberName = '名無しさん';
		mentionHooks.forEach(async (mentionHook) => {
			if (await mentionHook(queryMessage as queryMessage)) {
				return;
			}
		});
	}
});
