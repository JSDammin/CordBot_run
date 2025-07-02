const discord = require('discord.js');
const replyEmbed = require('../../utils/replyEmbed');

module.exports = {
    name: 'mute',
    description: 'Mute a user for a specified duration.',
    usage: '[user] [duration] [reason]',
    permissions: [discord.PermissionsBitField.Flags.ManageRoles],
    cooldown: 5,
    options: [
        {
            type: 6, // USER type
            name: 'user',
            description: 'The user to mute.',
            required: true
        },
        {
            type: 4, // INTEGER type
            name: 'duration',
            description: 'Duration in minutes.',
            required: true
        },
        {
            type: 3, // STRING type
            name: 'reason',
            description: 'Reason for muting.',
            required: false
        },
    ],

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        //await interaction.deferReply();

        // Check if the bot has permission to timeout members
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
        if (!botMember.permissions.has('MODERATE_MEMBERS')) return replyEmbed.reply(interaction, 'Bot does not have permission to timeout members.', replyEmbed.status.error, true);
        
        // Check if the member is already timed out
        
        const currentTime = Date.now(); // Get the current time in milliseconds
        const member = interaction.guild.members.cache.get(user.id);
        if (member.communicationDisabledUntil && member.communicationDisabledUntil > currentTime) return replyEmbed.reply(interaction, `<@${user.id}> is already muted.`, replyEmbed.status.warn, true);


        await member.timeout(duration * 60 * 1000, reason); // Duration in milliseconds
        return replyEmbed.reply(interaction, `<@${user.id}> has been muted for ${duration} minutes.\n\`${reason}\``, replyEmbed.status.success, true);    
    }
};
