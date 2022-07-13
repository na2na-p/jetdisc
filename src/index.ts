import {Na2Client} from '@/client.js';
import _log from '@utils/log.js';

// eslint-disable-next-line require-jsdoc
function log(msg: string): void {
	_log(`[Init]: ${msg}`);
}

// モジュール群のインポート
import {Ping} from '@modules/hooks/ping/index.js';
import {Dice} from '@modules/hooks/dice/index.js';
import {Translate} from '@modules/hooks/translate/index.js';
import {ColorPicker} from '@/modules/hooks/colorpicker/index.js';
import {Divination} from '@modules/hooks/divination/index.js';
import {Menu} from '@modules/hooks/menu/index.js';
import {Search} from '@modules/hooks/search/index.js';
import {EmojiReact} from '@modules/hooks/emoji-react/index.js';

// コマンド登録用のオブジェクト群のインポート
import {Ping as PingCommand} from '@modules/commands/ping/install.js';

// コマンドに対するリアクションのインポート
import {Ping as PingCommandReaction} from '@modules/commands/ping/interaction.js';

// モジュール群のインスタンス化
// 上にあるほど高優先度
const hooks = [
	// mentionHook系
	new Ping(),
	new Dice(),
	new Translate(),
	new ColorPicker(),
	new Divination(),
	new Menu(),
	// streamHook系
	new Search(),
	new EmojiReact(),
	// interactionHook系
	new PingCommandReaction(),
];

// /コマンド登録用のオブジェクト群のインポート
const commands = [
	PingCommand,
];

log('Starting Na2Client...');
new Na2Client(hooks, commands);
