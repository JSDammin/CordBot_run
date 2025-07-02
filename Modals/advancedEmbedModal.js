const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');

module.exports = (id, author=null, content=null, fields=null) => {
    const authorInput = new TextInputBuilder()
        .setCustomId('author')
        .setLabel('Author')
        .setPlaceholder('name (url)')
        .setValue(author || '')
        .setRequired(false)
        .setStyle(TextInputStyle.Short);

    const contentInput = new TextInputBuilder()
        .setCustomId('content')
        .setLabel('Content')
        .setPlaceholder('content')
        .setValue(content || '')
        .setRequired(false)
        .setStyle(TextInputStyle.Paragraph);

    const fieldsInput = new TextInputBuilder()
        .setCustomId('fields')
        .setLabel('Fields')
        .setPlaceholder('key, value')
        .setValue(fields || '')
        .setRequired(false)
        //.setDisabled(true)
        .setStyle(TextInputStyle.Paragraph);


    // Create action rows and add the text inputs to them
    const authorInputActionRow = new ActionRowBuilder().addComponents(authorInput);
    const contentInputActionRow = new ActionRowBuilder().addComponents(contentInput);
    const fieldsInputActionRow = new ActionRowBuilder().addComponents(fieldsInput);
    

    // Create the modal
    const modal = new ModalBuilder()
        .setCustomId(`embed_advanced_${id.toLowerCase()}`)
        .setTitle('Embed Advanced')
        .addComponents(
            authorInputActionRow,
            contentInputActionRow,
            fieldsInputActionRow,
        );
    
    return modal
}