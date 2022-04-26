const pkg = require('../package.json');

import Client from 'stream';
import Module from 'module';

/**
 * なず
 */
export default class なず {
  public readonly version = pkg.version;
  private client: any;
  public modules: Module[] = [];

  /**
   * 本体
   * @param {Module} modules モジュール
   */
  constructor(modules: Module[]) {
    this.client = new Client();
    console.log(this.client);
    this.client.login(process.env.DISCORD_TOKEN);
    this.modules = modules;
  }
}
