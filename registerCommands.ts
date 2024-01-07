import { REST, Routes } from "discord.js";
import { mcstatus, getajob, quack } from "./commands";
import Config from "./Config";

const config = new Config();

const commands = [
    quack.command,
    mcstatus.command,
];

if (config.openAIEnabled === true) {
    commands.push(getajob.command);
}

const rest = new REST({ version: '10' }).setToken(config.token);

export async function register() {
    try {
        console.log('Started refreshing application (/) commands.');

        console.log(commands);
    
        await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
    
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}
