// import autobind from 'autobind-decorator';
// import * as discord from 'discord.js';

import なず from './na2';

/**
 * モジュール
 */
export default abstract class Module {
  public abstract readonly name: string;

  // @ts-ignore
  protected na2: なず;

  /**
   * 謎
   * @param {なず} na2 なず
   */
  public init(na2: なず) {
    this.na2 = na2;
  }
}
