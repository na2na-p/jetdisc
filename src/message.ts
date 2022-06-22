import * as discord from 'discord.js';
import なず from './na2';
import Module from './module';

export default class Message {
  private na2: なず;
  private message: discord.Message;
  public modules: Module[] = [];

  public get userId(): string {
    return this.message.author.id;
  }

  public get userName(): string {
    return this.message.member ? this.message.member.displayName : "名無し";
  }

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

  constructor(na2: なず, message: discord.Message){
    this.na2 = na2,
    this.message = message
  }

  public send(receivedMessage:discord.Message, message?: string): void {
    if (!message) {
      message = receivedMessage.content;
    }
    receivedMessage.channel.send(message);
    return;
  }
}
