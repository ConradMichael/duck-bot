export interface ICommand {
    name: string;
    description: string;
}

interface IBaseCommand {
    command: ICommand,
    interaction: () => Promise<string>;
}

export default class BaseCommand implements IBaseCommand {
    public command: ICommand;
    public interaction: () => Promise<string>;

    constructor(params: IBaseCommand) {
        this.command = params.command;
        this.interaction = params.interaction;
    }
}
