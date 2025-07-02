const Discord = require('discord.js');
const database = require('../utils/database')
const randomNum = require('../utils/randomNum')


// NOTE: use bot collection
const guildID = "1381391380156387368"
const channelID = "1381391381687177415"



// Create Ticket
const createTicket = async (message, ticketChannel) => {
    const {channel, member, author, content, attachments} = message;
    const ticketId = String(randomNum(0,9))+String(randomNum(0,9))+String(randomNum(0,9))+String(randomNum(0,9))+String(randomNum(0,9))
    const ticketName = `🎫Ticket-${ticketId}`

    const ticketEmbed = new Discord.EmbedBuilder()
        .setTitle(`\`\`${ticketName}\`\``)
        .setThumbnail(author.displayAvatarURL())
        .setDescription(`\n**TOPIC:** \`\`${content.substring(0, 15)}\`\`\n**USER:** \`\`${author.tag}\`\`\n**STATUS:** \`\`Active\`\`\n\n||${author.id}||`)
        .setColor('#fcba03')

    const ticketButtons = new Discord.ActionRowBuilder() // Close ticket button.
        .addComponents(
            new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel(`Close Ticket`)
                .setCustomId(`ticket_close_${author.id}_${ticketId}`),
            
            new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Primary)
                .setLabel(`INFO`)
                .setCustomId(`ticket_info_${author.id}_${ticketId}`)
        );

    const ticketMessage = await ticketChannel.send({content: 'everyone', embeds: [ticketEmbed], components: [ticketButtons] }); // Setup ticket embed.
    const ticketThread = await ticketMessage.startThread({ name: ticketName.toLowerCase(), autoArchiveDuration: 1440, reason: `Created ${ticketName} for user ${author.id}`});

    // Send User Notice
    const userNoticeEmbed = new Discord.EmbedBuilder()
        .setTitle(`\`\`${ticketName}\`\``)
        .setDescription(`Please sit tight while we get one of our staff members to assist you. In the meantime, please specify in detail what you would like us to help you with if you haven't already.\n\n**TOPIC** \n${content}`)
        .setThumbnail('https://cdn.discordapp.com/attachments/726176190288756817/1091106740772290740/yellowticket.png')
        .setColor('#fcba03')

    author.send({ embeds: [userNoticeEmbed] });
    
    // Save ticket data
    await database(`SET/main/tickets/${author.id}`, {'active': {"topic": content, "messages": null, "thread": ticketThread.id}})
    return ticketThread.id
}

// Send Message
const sendMessageEmbed = async (message, entity) => {
    const {channel, member, author, content, attachments} = message;

    const imageUrls = [];
    attachments.forEach(a => {imageUrls.push(a.url);})

    let messageEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: author.username, iconURL: author.displayAvatarURL() })
        .setDescription(content || 'ㅤ')
        .setImage(imageUrls[0] || null)
        .setColor('#2F3136')

    await entity.send({ embeds: [messageEmbed] });
    
    // Send remaining images
    for (const [index, url] of Object.entries(imageUrls)) {
        if (index == 0) continue; // Skip first image

        messageEmbed.setAuthor(null);
        messageEmbed.setDescription('ㅤ');
        messageEmbed.setImage(url);

        await entity.send({ embeds: [messageEmbed] });
    };
}

const getActiveThread = async (id) => {
    let userTickets = await database(`GET/main/tickets/${id}`)
    return userTickets?.active
}

const sendThreadMessage = async (message, ticketChannel) => {
    const activeTicket = await getActiveThread(message.author.id)
    let threadId = activeTicket?.thread
    
    // Create ticket if it does not exist
    if (!threadId) threadId = await createTicket(message, ticketChannel)
    
    // Send message to thread
    const ticketThread = await ticketChannel.threads.cache.find(t => t.id === threadId);
    await sendMessageEmbed(message, ticketThread)
}

const sendDirectMessage = async (message, user) => {
    // Send direct message to user
    await sendMessageEmbed(message, user)
}



module.exports = async (bot) => {
    bot.on('messageCreate', async message => {
        const {channel, member, author, content, attachments} = message;
        if (author.bot) return;
        

        try {
            if (channel.type === 1) {
                // User to staff
                const ticketChannel = (await bot.guilds.cache.get(guildID)).channels.cache.get(channelID); // NOTE: Inefficient
                return await sendThreadMessage(message, ticketChannel)
            }

            if (!channel.isThread() || channel.parentId !== channelID) return 

            const userTickets = await database(`FIND/main/tickets`, {"active.thread": channel.id})
            const userId = userTickets?.id

            if (!userId) return

            // Staff to user
            const user = await bot.users.fetch(userId);
            if (!user) throw new Error("Could not resolve, user might have left server.");
            await sendDirectMessage(message, user)
        
        } catch (err) {
            console.error(err);
            channel.send(`**There was an unexpected error sending your message. Please try again later.**`).catch(err => {});
            
            //delete activeTickets[activeTickets[author.id]]; // Close thread ticket
            //delete activeTickets[author.id]; // Close user ticket
        }
    })
}