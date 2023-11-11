import type { InteractArgs } from './CommandBase.types.js';

export abstract class CommandBase {
  public abstract readonly name: string;
  public abstract readonly description: string;

  public constructor() {}

  public register = () => this;

  public getRegisterInfo() {
    return {
      name: this.name,
      description: this.description,
    };
  }

  public isInteract({ interaction }: InteractArgs): boolean {
    return interaction.commandName === this.name;
  }

  public abstract interact({ interaction }: InteractArgs): Promise<void>;
}
