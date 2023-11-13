import type { InteractArgs } from './CommandBase.types.js';

export abstract class CommandBase {
  /**
   * コマンド名
   * この値がそのままコマンドの名前として表示&使用される
   */
  public abstract readonly name: string;
  /**
   * コマンドの説明
   * この値がそのままコマンドの説明として表示される
   */
  public abstract readonly description: string;

  public readonly register = () => this;

  public isInteract({ interaction }: InteractArgs): Readonly<boolean> {
    return interaction.commandName === this.name;
  }

  public abstract interact({ interaction }: InteractArgs): Promise<void>;
}
