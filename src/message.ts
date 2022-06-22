import * as discord from 'discord.js';
import なず from './na2';
import Module from './module';

/**
 * メッセージ関係を扱うブツ
 * @param {なず} na2
 * @param {discord.Message} message メッセージ
 */
export default class Message {
  private na2: なず;
  private message: discord.Message;
  public modules: Module[] = [];

  /**
   * ユーザーIDを取得する
   */
  public get userId(): string {
    return this.message.author.id;
  }

  /**
   * ユーザーの表示名を取得する
   * 該当するデータがない場合はユーザー名を返す
   */
  public get userName(): string {
    return this.message.member ?
    this.message.member.displayName : this.message.author.username;
  }

  /**
   * メッセージ本文を取得する
   */
  public get messageText(): string {
    return this.message.content;
  }

  /**
   * メンション部分を除いたテキスト本文
   */
  public get extractedText(): string {
    return this.message.content
        .replace(new RegExp(`^@${this.na2.client.user?.tag}`), '')
        .trim();
  }

  /**
   * コンストラクタ。メッセージを検知するたびに呼び出される。
   * @param {なず} na2 なず
   * @param {discord.Message} message メッセージ
   */
  constructor(na2: なず, message: discord.Message) {
    this.na2 = na2,
    this.message = message;
  }

  /**
   * メッセージをチャンネルに向けて送信する。
   * @param {discord.Message} receivedMessage
   * @param {string | undefined} message オプショナル。送信内容
   */
  public send(receivedMessage:discord.Message, message?: string): void {
    if (!message) {
      message = receivedMessage.content;
    }
    receivedMessage.channel.send(message);
    return;
  }
}
