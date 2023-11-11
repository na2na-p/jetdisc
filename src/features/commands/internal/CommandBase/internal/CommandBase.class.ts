import type { InteractArgs } from './CommandBase.types.js';

export abstract class CommandBase {
  public abstract readonly name: string;
  public abstract readonly description: string;

  public register = () => this;

  public isInteract({ interaction }: InteractArgs): boolean {
    return interaction.commandName === this.name;
  }

  public abstract interact({ interaction }: InteractArgs): Promise<void>;
}
