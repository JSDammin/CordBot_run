const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async (bot) => {
    // Interaction Loader

    const interactionDirs = {
        modal: path.join(__dirname, '../Interactions/ModalSubmit'),
        selectMenu: path.join(__dirname, '../Interactions/SelectMenu')
    };

    bot.interactionHandlers = {
        modal: new Discord.Collection(),
        selectMenu: new Discord.Collection()
    };

    // Function to load interactions
    const loadInteractions = async (type, dir) => {
        const interactions = fs.readdirSync(dir)
            .filter(file => file.endsWith('.js'))
            .map(file => path.join(dir, file));

        await Promise.all(interactions.map(async (filePath) => {
            const interaction = require(filePath);
            if (!interaction) return;

            const fileName = (path.basename(filePath, path.extname(filePath))).toUpperCase();
            console.log('\x1b[2m%s\x1b[0m', `- Loaded ${type} Interaction: ${fileName}`);

            bot.interactionHandlers[type].set(fileName, interaction);
        }));
    };

    // Load both modal and select menu interactions
    await loadInteractions('modal', interactionDirs.modal);
    await loadInteractions('selectMenu', interactionDirs.selectMenu);

    // Interaction Handler
    bot.on('interactionCreate', async (interaction) => {
        if (interaction.isModalSubmit()) {
            const interactionName = interaction.customId.split('_')[0].toUpperCase();

            const modalInteraction = bot.interactionHandlers.modal.get(interactionName);
            if (!modalInteraction) return

            await modalInteraction(interaction);
        } else if (interaction.isStringSelectMenu()) {
            const interactionName = interaction.customId.split('_')[0].toUpperCase();

            const selectMenuInteraction = bot.interactionHandlers.selectMenu.get(interactionName);
            if (!selectMenuInteraction) return

            await selectMenuInteraction(interaction);
        }
          else if (interaction.isChatInputCommand()) {
            const interactionName = interaction.customId.split('_')[0].toUpperCase();

            const command = bot.commands.get(interaction.commandName);

            if (command) {
              return command.execute(interaction);
            } else {
              const CustomCommand = require('../models/CustomCommand');
              const cmd = await CustomCommand.findOne({
                guildId: interaction.guildId,
                name: interaction.commandName
              });

              if (cmd) {
                return interaction.reply(cmd.response);
              }
            }
          }
    });
};
