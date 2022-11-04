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
	token: process.env['TOKEN']!,
	botMasterId: process.env['BOT_MASTER_ID']!,
	prefix: process.env['PREFIX']!,
	deeplApiKey: process.env['DEEPL_API_KEY']!,
	setCommandsTargetServers: process.env['SET_COMMANDS_TARGET_SERVERS']!.split(','),
};
