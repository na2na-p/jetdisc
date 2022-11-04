import _log from '@utils/log.js';
// eslint-disable-next-line require-jsdoc
function log(msg: string): void {
	_log(`[Config]: ${msg}`);
}

type configType = {
	token: string;
	botMasterId: string;
	prefix: string;
	deeplApiKey: string;
	setCommandsTargetServers: string[];
}

if (process.env['NODE_ENV'] !== 'container') {
	log('Running in direct deployment mode. .env file loaded.');
	const dotenv = await import('dotenv');
	dotenv.config();
};

export const config: configType = {
	token: (() => {
		if (process.env['TOKEN']) {
			return process.env['TOKEN'];
		} else {
			throw new Error('TOKEN is not defined.');
		}
	})(),
	botMasterId: (() => {
		if (process.env['BOT_MASTER_ID']) {
			return process.env['BOT_MASTER_ID'];
		} else {
			throw new Error('BOT_MASTER_ID is not defined.');
		}
	})(),
	prefix: (() => {
		if (process.env['PREFIX']) {
			return process.env['PREFIX'];
		} else {
			throw new Error('PREFIX is not defined.');
		}
	})(),
	deeplApiKey: (() => {
		if (process.env['DEEPL_API_KEY']) {
			return process.env['DEEPL_API_KEY'];
		} else {
			throw new Error('DEEPL_API_KEY is not defined.');
		}
	})(),
	setCommandsTargetServers: (() => {
		if (process.env['SET_COMMANDS_TARGET_SERVERS']) {
			return process.env['SET_COMMANDS_TARGET_SERVERS'].split(',');
		} else {
			return [];
		}
	})(),
};