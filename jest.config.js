import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = JSON.parse(readFileSync(`${__dirname}/.swcrc`, 'utf-8'));

/** @type {import('jest').Config} */
const jestConfig = {
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': ['@swc/jest', { ...config }],
  },
  setupFiles: ['<rootDir>/setup-global.ts'],
  injectGlobals: true,
  testEnvironment: 'node',
  testTimeout: 200,

  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],

  restoreMocks: true,
  clearMocks: true,
  resetMocks: true,
};

export default jestConfig;
