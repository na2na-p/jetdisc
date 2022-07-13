import {load} from 'js-yaml';
import {readFileSync} from 'fs';

type config = {
	token: string;
	prefix: string;
	deeplApiKey: string;
	setCommandsTargetServers: string[];
}

export const config = load(readFileSync('.config/default.yml', 'utf8')) as config;
