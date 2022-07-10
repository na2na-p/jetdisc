import {Na2Client} from '@/client.js';

// モジュール群のインポート
import {Ping} from '@modules/ping/index.js';
import {Dice} from '@modules/dice/index.js';
import {Translate} from '@modules/translate/index.js';
import {ColorPicker} from '@modules/colorpicker/index.js';
import {Divination} from '@modules/divination/index.js';

// モジュール群のインスタンス化
const modules = [
	new Ping(),
	new Dice(),
	new Translate(),
	new ColorPicker(),
	new Divination(),
];

new Na2Client(modules);
