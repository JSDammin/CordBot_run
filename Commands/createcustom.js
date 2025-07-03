const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createcustom')
    .setDescription('Create a custom command using an interactive form'),
  
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: 'Only admins can use this command.', ephemeral: true });
    }

    const modal = new ModalBuilder()
      .setCustomId('createCustomCommand')
      .setTitle('Create Custom Command');

    const nameInput = new TextInputBuilder()
      .setCustomId('commandName')
      .setLabel('Command name (no slash)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const responseInput = new TextInputBuilder()
      .setCustomId('commandResponse')
      .setLabel('Response message')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(nameInput),
      new ActionRowBuilder().addComponents(responseInput)
    );

    await interaction.showModal(modal);
  }
};