import { Na2Client } from '@/client.js';
import _log from '@utils/log.js';
import type { commandSetType } from '@/types/types.js';
import { version } from '@utils/version.cjs';

function log(msg: string): void {
	_log(`[Init]: ${msg}`);
}

// モジュール群のインポート
import { Ping } from '@modules/hooks/ping/index.js';
import { Dice } from '@modules/hooks/dice/index.js';
import { Translate } from '@modules/hooks/translate/index.js';
import { ColorPicker } from '@/modules/hooks/colorPicker/index.js';
import { Divination } from '@modules/hooks/divination/index.js';
import { Menu } from '@modules/hooks/menu/index.js';
import { Search } from '@modules/hooks/search/index.js';
import { EmojiReact } from '@modules/hooks/emoji-react/index.js';
import { ChatGPT } from '@modules/hooks/chatGPT/index.js';

// スラッシュコマンドあれこれ用
import { pingCommandSetter, Ping as PingCommand } from '@modules/commands/ping/index.js';
import { diceCommandSetter, Dice as DiceCommand } from '@modules/commands/dice/index.js';
import { chatGPTCommandSetter, ChatGPT as ChatGPTCommand } from './modules/commands/ChatGPT/index.js';
import { Module } from './types/modules.js';
// import {VCJoinCommandSetter, VCJoin} from '@modules/commands/voice/join/index.js';

// モジュール群のインスタンス化
// 上にあるほど高優先度
const hooks: Array<Module> = [
	// mentionHook系
	new Ping(),
	new Dice(),
	new Translate(),
	new ColorPicker(),
	new Divination(),
	new Menu(),
	new ChatGPT(),
	// streamHook系
	new Search(),
	new EmojiReact(),
	// interactionHook系
	new PingCommand(),
	new DiceCommand(),
	new ChatGPTCommand(),
	// new VCJoin(), TODO: このモジュールは未実装
];

// /コマンド登録用のオブジェクト群のインポート
const commands: commandSetType[] = [
	pingCommandSetter,
	diceCommandSetter,
	chatGPTCommandSetter,
	// VCJoinCommandSetter, TODO: このモジュールは未実装
];

log(`2na2-Discord v${version}`);
log('Starting Na2Client...');

new Na2Client(hooks, commands);
