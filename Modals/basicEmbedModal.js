const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');

module.exports = (id, title=null, description=null, thumbnail=null, image=null, color=null) => {
    const titleInput = new TextInputBuilder()
        .setCustomId('title')
        .setLabel('Title')
        .setPlaceholder('title (url)')
        .setValue(title || '')
        .setStyle(TextInputStyle.Short);
        
    const descriptionInput = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('Description')
        .setPlaceholder('description')
        .setValue(description || '')
        .setStyle(TextInputStyle.Paragraph);

    const thumbnailInput = new TextInputBuilder()
        .setCustomId('thumbnail')
        .setLabel('Thumbnail')
        .setPlaceholder('url')
        .setValue(thumbnail || '')
        .setRequired(false)
        .setStyle(TextInputStyle.Short);

    const imageInput = new TextInputBuilder()
        .setCustomId('image')
        .setLabel('Image')
        .setPlaceholder('url')
        .setValue(image || '')
        .setRequired(false)
        .setStyle(TextInputStyle.Short);

    const colorInput = new TextInputBuilder()
        .setCustomId('color')
        .setLabel('Color')
        .setPlaceholder('#ffffff')
        .setValue(color || '')
        .setRequired(false)
        .setStyle(TextInputStyle.Short);


    // Create action rows and add the text inputs to them
    const titleActionRow = new ActionRowBuilder().addComponents(titleInput);
    const descriptionActionRow = new ActionRowBuilder().addComponents(descriptionInput);
    const colorInputActionRow = new ActionRowBuilder().addComponents(colorInput);
    const thumbnailActionRow = new ActionRowBuilder().addComponents(thumbnailInput);
    const imageActionRow = new ActionRowBuilder().addComponents(imageInput);
    

    // Create the modal
    const modal = new ModalBuilder()
        .setCustomId(`embed_basic_${id.toLowerCase()}`)
        .setTitle('Embed Create Basic')
        .addComponents(
            titleActionRow,
            descriptionActionRow,
            thumbnailActionRow,
            imageActionRow,
            colorInputActionRow
        );
    
    return modal
}