import { isBuiltin } from 'node:module';
import { dirname } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

import resolveCallback from 'resolve/async.js';

const resolveAsync = promisify(resolveCallback);

const baseURL = pathToFileURL(cwd() + '/').href;

/**
 * commonjs-extension-resolution-loader
 * Originally written by Geoffrey Booth
 * Edited and modified by na2na
 * https://github.com/nodejs/loaders-test
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
export async function resolve(specifier, context, next) {
  const { parentURL = baseURL } = context;

  if (isBuiltin(specifier)) {
    return next(specifier, context);
  }

  // `resolveAsync` works with paths, not URLs
  if (specifier.startsWith('file://')) {
    specifier = fileURLToPath(specifier);
  }
  const parentPath = fileURLToPath(parentURL);

  let url;
  try {
    const resolution = await resolveAsync(specifier, {
      basedir: dirname(parentPath),
      extensions: ['.js', '.json', '.node', '.mjs'],
    });
    url = pathToFileURL(resolution).href;
  } catch (error) {
    return next(specifier, context, next);
  }

  return next(url, context);
}
