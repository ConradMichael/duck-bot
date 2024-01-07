import OpenAI from "openai";
import BaseCommand, { ICommand } from "./BaseCommand";
import Config from "../Config";
import { Rcon } from 'rcon-client';
import { fetchServerInfo } from "minestat-es";

const config = new Config();

function extractPlayerNames(str: string) {
    const playersPart = str.split('scoreboard:')[1];
    const cleanedStr = playersPart.trim().replace(' and ', ', ');
    return cleanedStr.split(', ');
}

function extractDeathObjective(str: string) {
    return str.split('Showing 1 tracked objective(s) for ')[1];
}

export const mcstatus = new BaseCommand({
    command: {
        name: 'mc',
        description: 'Checks the status of the running Minecraft Servers',
    } as ICommand,
    interaction: async () => {
        let serverInfo = '';
        let extra = '';

        // Only get it for RL Craft atm
        const rcon = await Rcon.connect({
            host: config.mcServers[0].address,
            port: config.mcServers[0].rconPort,
            password: config.rconPassword,
        });

        try {
            extra += `${config.mcServers[0].name} - Deaths:\n`;
            const response = await rcon.send('/scoreboard players list');
            const players = extractPlayerNames(response);

            for (let player of players) {
                const response = await rcon.send(`/scoreboard players list ${player}`);
                extra += '  ' + extractDeathObjective(response) + '\n';
            }
        } finally {
            await rcon.end();
        }

        await Promise.all(
            config.mcServers.map(async (server) => {    
                const info = await fetchServerInfo(server);

                serverInfo += `  [${server.name} - ${server.address}:${server.port}]\n    Status: ${info.online === true ? 'Online' : 'Offline'}\n    ${info.players} Players \n`;
            }),
        );

        return 'Servers: \n' + serverInfo + '\n' + extra;
    }
})

export const quack = new BaseCommand({
    command: {
        name: 'quack',
        description: 'testing',
    } as ICommand,
    interaction: async () => 'Quack!',
});

export const getajob = new BaseCommand({
    command: {
        name: 'getajob',
        description: 'Open AI command to tell Quincy to get a damn job',
    } as ICommand,
    interaction: async () => {
        const openai = new OpenAI({
            apiKey: config.openAIConfig?.apiKey,
        });

        const test = await openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Tell "Quincy" to get a job - be random, a good mix of encouraging, creative but also passive agressive. I\'d like some creative responses as this will not be the first time asking for this - we have this command repeated daily.' }],
            model: 'gpt-3.5-turbo',
        });

        return test.choices[0].message.content as string;
    }
});
