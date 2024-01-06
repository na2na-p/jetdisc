import { getConfig as originalGetConfig } from './internal/getConfig.func.js';
import { singleton } from '../others/singleton/index.js';

export const getConfig = singleton(originalGetConfig);
