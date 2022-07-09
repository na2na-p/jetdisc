import {なずClient} from '@/client.js';
import {config} from '@/config.js';
import {Message} from 'discord.js';
import {queryMessage} from '@/types.js';

type installedHooks = (message: Message) => Promise<boolean>;

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
const installedHooks: installedHooks[] = [];
for (const module of modules) {
	installedHooks.push(module.install());
	console.log(chalk.yellow(`Installed: ${module.name}`));
}

const client = new なずClient();

client.on('messageCreate', async (message) => {
	// prefixで始まる投稿をキャッチ
	if (message.content.startsWith(config.prefix) && !message.author.bot) {
		// messageからconfig.prefixを除去
		const queryMessage: queryMessage = message;
		queryMessage.queryContent = message.content.replace(config.prefix, '');
		// queryMessage as Required<queryMessage>; // 無くても成立してそう
		installedHooks.forEach(async (hook) => {
			await hook(queryMessage);
		});
	}
});
