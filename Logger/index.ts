import { ChatInputCommandInteraction } from "discord.js";

export const logCommand = (interaction: ChatInputCommandInteraction) => {
    console.log(`User: \"${interaction.user.globalName}\" Ran Command: \"${interaction.commandName}\"`);
}
