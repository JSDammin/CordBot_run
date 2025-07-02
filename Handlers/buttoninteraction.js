const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async (bot) => {
    // Button Interaction Loader
    const buttonInteractionsDir = path.join(__dirname, '../Interactions/Buttons');
    bot.buttonInteractions = new Discord.Collection();


    // Read the button interactions directory
    const buttonInteractions = fs.readdirSync(buttonInteractionsDir)
        .filter(file => file.endsWith('.js'))
        .map(file => path.join(buttonInteractionsDir, file));


    // Load each button interaction file
    await Promise.all(buttonInteractions.map(async (filePath) => {
        const buttonInteraction = require(filePath);
        if (!buttonInteraction) return

        const fileName = (path.basename(filePath, path.extname(filePath))).toUpperCase()
        console.log('\x1b[2m%s\x1b[0m', `- Loaded Button Interaction: ${fileName}`);

        await bot.buttonInteractions.set(fileName, buttonInteraction);
    }));

    // Button Interaction Handler
    bot.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;

        const buttonInteractionName = interaction.customId.split('_')[0].toUpperCase();
        const buttonInteraction = bot.buttonInteractions.get(buttonInteractionName);

        if (!buttonInteraction) return;
        await buttonInteraction(interaction)
    })
}