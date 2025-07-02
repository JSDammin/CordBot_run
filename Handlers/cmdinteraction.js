const discord = require('discord.js');
const replyEmbed = require('../utils/replyEmbed');
const fs = require('fs');
const path = require('path');



module.exports = async (bot) => {
    const commandDir = path.join(__dirname, '../Commands');
    bot.commands = new discord.Collection();

    // Read the command directory
    const commandFiles = fs.readdirSync(commandDir).flatMap(dir => {
        const fullDir = path.join(commandDir, dir);
        return fs.readdirSync(fullDir).map(file => path.join(fullDir, file));
    }).filter(file => file.endsWith('.js'));

    // Load each command file
    await Promise.all(commandFiles.map(async (filePath) => {
        const command = require(filePath);

        if (!command.name) return;

        const fileName = (path.basename(filePath, path.extname(filePath))).toUpperCase()
        console.log('\x1b[2m%s\x1b[0m', `- Loaded Command: ${fileName}`);

        await bot.commands.set(fileName, command);
    }));

    // Command interaction handler
    bot.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return; // Only listen to command interactions
        
        const commandName = interaction.commandName.toUpperCase();
        const command = bot.commands.get(commandName);

        if (!command) return replyEmbed.reply(interaction, `That command does not exist`, replyEmbed.status.error, true)

        // Check for member permissions
        let member = interaction.member
        let hasPermission = false
        command.permissions.forEach(p => {if (member.permissions.has(p)) return hasPermission = true});
        if (!hasPermission) return replyEmbed.reply(interaction, `You do not have permission to execute that command`, replyEmbed.status.warn, true)

        // Check for roles
        //let hasRole = command.roles[0] ? false : true;
        //command.roles.forEach(r => {if (interaction.member.roles.cache.has(r)) return hasRole = true});
        //if (!hasRole) return plugins.reply(`You do not have permission to execute thast command...`, 'DANGER', interaction, {ephemeral: true});

        //if (utils.cooldowns(commandName, command.cooldown)) return; // Cooldown
        //interaction.reply({content: `**⏰ Please wait ${Math.ceil((this.var.cooldowns[category][interaction.user.id] - Date.now()) / 1000)} more seconds.**`, ephemeral: true }).catch(err => {});

        try {
            await command.execute(interaction)

            //var final_message = ''
            //Object.values(interaction.options.data).forEach(obj => {
            //    const type = obj.type
            //    const name = obj.name
            //    const value = obj.value
            //    
            //    final_message += `\n${name.toUpperCase()}: ${value}`
            //});
            // send to log channel and save on db

        } catch (err) {
            console.error(err)
            //const message = replyEmbed.truncateMessage(`There was an error executing that command\n\`\`${err}\`\``)
            //return replyEmbed.reply(interaction, message, replyEmbed.status.error, true)
        }
    });
};