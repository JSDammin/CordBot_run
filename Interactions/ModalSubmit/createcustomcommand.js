// Interactions/ModalSubmit/createcustomcommand.js
const CustomCommand = require('../../models/CustomCommand');

module.exports = async (interaction) => {
  const name = interaction.fields.getTextInputValue('commandName').toLowerCase();
  const response = interaction.fields.getTextInputValue('commandResponse');

  const exists = await CustomCommand.findOne({
    guildId: interaction.guildId,
    name
  });

  if (exists) {
    return interaction.reply({
      content: `A command named \`${name}\` already exists.`,
      ephemeral: true
    });
  }

  await CustomCommand.create({
    guildId: interaction.guildId,
    name,
    response
  });

  await interaction.reply({
    content: `Custom command \`${name}\` created successfully.`,
    ephemeral: true
  });
};
