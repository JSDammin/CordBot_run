const Discord = require('discord.js');
//const replyEmbed = require('../../utils/replyEmbed');


module.exports = {
    name: 'help',
    description: 'Show a list of commands.',
    usage: '',
    permissions: [Discord.PermissionFlagsBits.Administrator],
    cooldown: 5,
    options: [],
    
    async execute(interaction) {
        let fields = []
        const commandList = interaction.client.commands
        console.log(typeof commandList)


        //commandList.forEach((value, key) => {
        //    console.log(commandName)
            //fields.push({key: key, value: value.description, inline: true })
        //})

        const helpEmbed = new Discord.EmbedBuilder()
            .setTitle(`HELP`)
            .setDescription(`The following are a list of commands and proper usage.`)
            //.setThumbnail('')
            .addFields(fields)
            .setColor('#ffffff')


        await interaction.reply({ embeds: [helpEmbed] })
    }
};