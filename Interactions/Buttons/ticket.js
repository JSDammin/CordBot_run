const Discord = require('discord.js');
const database = require('../../utils/database')
const truncated = require('../../utils/truncated')
const replyEmbed = require('../../utils/replyEmbed')


const close = async (interaction, userId, ticketId) => {
    const userTickets = await database(`GET/main/tickets/${userId}`)
    if (!userTickets || !userTickets?.active) return

    // Save and remove current ticket
    const options = {[ticketId]: userTickets.active, "active": null}
    await database(`SET/main/tickets/${userId}`, options)

    const user = await interaction.client.users.fetch(userId);

    // Update ticket embed
    let ticketButtons = new Discord.ActionRowBuilder() // Update close ticket to the username of staff for future reference
    .addComponents(
        new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Success)
            .setLabel(truncated(interaction.user.tag, 25))
            .setCustomId('null')
            .setDisabled(true),

        new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Primary)
            .setLabel(`INFO`)
            .setCustomId(`ticket_info_${userId}_${ticketId}`)
    );

    const ticketName = `🎫Ticket-${ticketId}`
    const ticketEmbed = new Discord.EmbedBuilder()
        .setTitle(`\`\`${ticketName}\`\``)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(`\n**TOPIC:** \`\`${userTickets.active?.topic}\`\`\n**USER:** \`\`${user.tag}\`\`\n**STATUS:** \`\`Closed\`\`\n\n||${user.id}||`)
        .setColor('#00c914')

    await interaction.update({ embeds: [ticketEmbed], components: [ticketButtons] });

    // Send User Notice
    const userNoticeEmbed = new Discord.EmbedBuilder()
        .setTitle(`\`\`${ticketName}\`\``)
        .setDescription(`Ticket has been closed by **${interaction.user.tag}**\nsend us another message to create a new ticket.`)
        .setThumbnail('https://cdn.discordapp.com/attachments/726176190288756817/1091106740772290740/yellowticket.png')
        .setColor('#fcba03')

    user.send({ embeds: [userNoticeEmbed] });

    // Delete ticket thread
    const threadChannel = await interaction.client.channels.fetch(userTickets.active.thread)
    if (!threadChannel) return

    await threadChannel.delete()
}

const info = async (interaction, userId, ticketId) => {
    const userTickets = await database(`GET/main/tickets/${userId}`)
    if (!userTickets) return

    const ticketData = userTickets[ticketId] || userTickets.active

    const ticketInfoEmbed = new Discord.EmbedBuilder()
        .setTitle(`Ticket Info ${ticketId}`)
        .addFields(
            {name: 'Topic', value: 'DATA', inline: true},
            {name: 'User', value: 'DATA', inline: true},
            {name: 'Status', value: 'DATA', inline: true},
            {name: 'Opened', value: 'DATA', inline: true},
            {name: 'Closed', value: 'DATA', inline: true},
            {name: 'Messages', value: 'DATA', inline: true}
        )
        .setColor('#ffffff')
    interaction.reply({ embeds: [ticketInfoEmbed], flags: 64})
}



module.exports = async (interaction) => {
    const parms = interaction.customId.split('_')
    const button = parms[0]
    const action = parms[1]
    const userId = parms[2]
    const ticketId = parms[3]

    switch (action) {
        case 'close':
            close(interaction, userId, ticketId)
            break;
        case 'info':
            info(interaction, userId, ticketId)
            break;
    }
};