import {なずClient} from '@/client.js';
import {config} from '@/config.js';
import {Message} from 'discord.js';
import {queryMessage} from '@/types.js';

type installedHooksType = (message: Message) => Promise<boolean>;

// モジュール群のインポート
import {Ping} from '@/modules/ping/index.js';
import {Dice} from '@/modules/dice/index.js';
import chalk from 'chalk';

// モジュール群のインスタンス化
const modules = [
	new Ping(),
	new Dice(),
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
		const queryMessage: queryMessage = message;
		queryMessage.queryContent = message.content.replace(config.prefix, '');
		if (message.member === null) queryMessage.memberName = '名無しさん';
		// queryMessage as Required<queryMessage>; // 無くても成立してそう
		mentionHooks.forEach(async (mentionHook) => {
			await mentionHook(queryMessage);
		});
	}
});
