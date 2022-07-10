import {Na2Client} from '@/client.js';
import _log from '@utils/log.js';

// eslint-disable-next-line require-jsdoc
function log(msg: string): void {
	_log(`[Init]: ${msg}`);
}

// モジュール群のインポート
import {Ping} from '@modules/ping/index.js';
import {Dice} from '@modules/dice/index.js';
import {Translate} from '@modules/translate/index.js';
import {ColorPicker} from '@modules/colorpicker/index.js';
import {Divination} from '@modules/divination/index.js';
import {Menu} from '@modules/menu/index.js';

// モジュール群のインスタンス化
// 上にあるほど高優先度
const modules = [
	new Ping(),
	new Dice(),
	new Translate(),
	new ColorPicker(),
	new Divination(),
	new Menu(),
];

log('Starting Na2Client...');
new Na2Client(modules);
