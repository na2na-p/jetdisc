import { singleton } from '../others/singleton/index.js';
import { getConfig as originalGetConfig } from './internal/getConfig.func.js';

export const getConfig = singleton(originalGetConfig);
