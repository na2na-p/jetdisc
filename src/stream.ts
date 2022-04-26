import autobind from 'autobind-decorator';
// eslint-disable-next-line object-curly-spacing
import { EventEmitter } from 'events';
import * as discord from 'discord.js';

/**
 * Discord Client
 */
export default class Client extends EventEmitter {
  public client :any;

  /**
   * コンストラクタ
   * 接続を確立するやつ
   */
  constructor() {
    super();

    this.client = new discord.Client({
      intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'],
    });
    debugger;
    this.client.addEventListener('ready', this.onReady);
    debugger;
    this.client.addEventListener('messageCreate', this.onMessage);
    debugger;
  }

  /**
   * readyイベント
   */
  @autobind
  private onReady() {
    this.emit('ready');
  }

  /**
   * messageCreateイベント
   * @param {discord.Message} message
   */
  private onMessage(message: discord.Message) {
    console.log('messageCreate', message);
    this.emit('message', message);
  }
}
