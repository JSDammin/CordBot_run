const { SlashCommandBuilder } = require('discord.js');
const CustomCommand = require('../Modals/CustomCommand');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deletecustom')
    .setDescription('Delete a custom command')
    .addStringOption(opt =>
      opt.setName('name').setDescription('Name of the custom command').setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: 'Only admins can use this command.', ephemeral: true });
    }

    const name = interaction.options.getString('name').toLowerCase();
    const result = await CustomCommand.findOneAndDelete({ guildId: interaction.guildId, name });

    if (!result) {
      return interaction.reply({ content: `Command \`${name}\' not found.`, ephemeral: true });
    }

    await interaction.reply({ content: `Custom command \`${name}\` deleted.`, ephemeral: true });
  }
};
