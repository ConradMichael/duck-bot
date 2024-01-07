import dotenv from "dotenv";
import fs from 'fs';

dotenv.config()

interface MCServer {
    name: string,
    address: string,
    port: number,
    rconPort: number,
};

interface IConfig {
    token: string;
    clientId: string;
    openAIEnabled: boolean;
    rconPassword: string;
    mcServers: MCServer[];
};

interface IOpenAIConfig {
    apiKey: string;
};

export default class Config implements IConfig {
    token: string;
    clientId: string;
    openAIEnabled: boolean = false;
    rconPassword: string;
    mcServers: MCServer[];
    openAIConfig?: IOpenAIConfig;

    constructor() {
        if (!process.env.DISCORD_TOKEN) {
            throw new Error('No discord token set in .env');
        }

        if (!process.env.CLIENT_ID) {
            throw new Error('No client id set in .env');
        }

        if (!process.env.RCON_PASSWORD) {
            throw new Error('No rcon password set in .env');
        }

        if (process.env?.OPEN_AI_ENABLED === "true") {
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('Open AI is enabled but no API KEY was set');
            }
            this.openAIConfig = {
                apiKey: process.env.OPENAI_API_KEY
            }
        }

        this.token = process.env.DISCORD_TOKEN;
        this.clientId = process.env.CLIENT_ID;
        this.rconPassword = process.env.RCON_PASSWORD;

        this.mcServers = JSON.parse(fs.readFileSync('./mcservers.json', 'utf-8')) as MCServer[];
    }
}
