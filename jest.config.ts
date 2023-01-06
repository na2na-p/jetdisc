import fs from 'fs';

import type { JestConfigWithTsJest } from 'ts-jest';


const config = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc`, 'utf-8'));

const jestConfig: JestConfigWithTsJest = {
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.tsx?$': ['@swc/jest', { ...config }],
	},
};

export default jestConfig;
