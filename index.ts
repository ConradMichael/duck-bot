import { BaseInteraction, Client, CommandInteraction, Events, GatewayIntentBits } from 'discord.js';
import { register } from "./registerCommands";
import { getajob, quack, mcstatus } from "./commands";
import { logCommand } from "./Logger";
import Config from "./Config";

const config = new Config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    logCommand(interaction);
  
    if (interaction.commandName === 'quack') {
      const interact = await quack.interaction();
      await interaction.reply(interact);
    }
  
    if (interaction.commandName === 'mc') {
      const interact = await mcstatus.interaction();
      await interaction.reply(interact);
    }

    if (interaction.commandName === 'getajob') {
      await interaction.deferReply();
      const interact = await getajob.interaction();
      await interaction.followUp(interact);
    }
});

client.login(config.token).then(async () => {
    register();
});
