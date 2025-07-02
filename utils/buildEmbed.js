const { EmbedBuilder } = require('discord.js');

module.exports = (title, description, color, thumbnail, image) => {
    try {
    const embedBuild = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setThumbnail(thumbnail)
        .setImage(image)
        //.setAuthor(authorName || null, authorUrl || null)
        //.setURL(embedUrl || null)
        //.setFields(fields || null)
        //.setFooter({text: embedData.footer || null})
        //.setTimestamp(timestamp|| null
        return embedBuild
    } catch (error) {
        console.error(`Error building embed: ${error}`)
        return null
    }
}