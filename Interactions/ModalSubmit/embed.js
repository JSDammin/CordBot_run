const { MessageFlags, Message } = require('discord.js');
const database = require('../../utils/database')
const buildEmbed = require('../../utils/buildEmbed')
const replyEmbed = require('../../utils/replyEmbed')
const isValidHexColor = require('../../utils/isValidHexColor')
const isValidImageURL = require('../../utils/isValidImageURL')
const truncated = require('../../utils/truncated')


const previewEmbed = async (interaction, options) => {
    const previewEmbed = buildEmbed(options.title, options.description, options.color, options.thumbnail, options.image)
    await interaction.editReply({content: `${options.content}`, embeds: [previewEmbed], flags: MessageFlags.Ephemeral})
}


const basicEmbedSubmit = async (interaction, embedName) => {
    await interaction.deferReply({flags: MessageFlags.Ephemeral})

    const title = interaction.fields.getTextInputValue('title') || null;
    const description = interaction.fields.getTextInputValue('description') || null;
    const thumbnail = interaction.fields.getTextInputValue('thumbnail') || null;
    const image = interaction.fields.getTextInputValue('image') || null;
    const color = interaction.fields.getTextInputValue('color') || '#ffffff';

    // Validate user inputs
    if (!title || !description) return replyEmbed.followUp(interaction, `Title and description are required fields`, replyEmbed.status.warn, true)
    if (thumbnail && !isValidImageURL(thumbnail)) return replyEmbed.followUp(interaction, `Thumbnail must be a valid url`, replyEmbed.status.warn, true)
    if (image && !isValidImageURL(image)) return replyEmbed.followUp(interaction, `Image must be a valid url`, replyEmbed.status.warn, true)
    if (!isValidHexColor(color)) return replyEmbed.followUp(interaction, `Color must be correct format (ex. #ffffff)`, replyEmbed.status.warn, true)

    const options = {
        title: truncated(title, 40),
        description: truncated(description, 2000),
        thumbnail: thumbnail,
        image: image,
        color: color,
        content: ''
    }
    
    await database(`SET/main/embeds/${embedName}`, options)

    await previewEmbed(interaction, options)
} 

const advancedEmbedSubmit = async (interaction, embedName) => {
    await interaction.deferReply({flags: MessageFlags.Ephemeral})

    const author = null;
    const content = interaction.fields.getTextInputValue('content') || '';
    const fields = null;

    const oldOptions = await database(`GET/main/embeds/${embedName}`)
    const options = { ...oldOptions, ...{'author': author, 'content': truncated(content, 1000), 'fields': fields}}

    await database(`SET/main/embeds/${embedName}`, options)
    
    await previewEmbed(interaction, options)
}

module.exports = async (interaction) => {
    const parms = interaction.customId.split('_')
    const modal = parms[0]
    const action = parms[1]
    const embedName = parms[2]

    switch (action) {
        case 'basic':
            basicEmbedSubmit(interaction, embedName)
            break;
        case 'advanced':
            advancedEmbedSubmit(interaction, embedName)
    }
};