const discord = require('discord.js');
const randomNum = require('../utils/randomNum');

const activitiesList = ['DM To Contact Staff','DM To Contact Staff!','DM = Help Ticket', 'DM = Support Ticket', 'DM To Create Ticket', 'DM = Modmail', 'DM For Modmail', '338 Dark Knights', 'Who are we? 338', 'What are we? Dark Knights'];

module.exports = async (bot) => {
    bot.on('ready', async() => {
        try {
            bot.user.setPresence({ activities: [{ name: 'Bot is back online!' }], status: 'idle' });
            setInterval(() => {
                bot.user.setPresence({ activities: [{ name: activitiesList[String(randomNum(0,activitiesList.length-1))] }], status: 'online' });
            }, 10000);
        } catch (error) {
            console.error(Error('setPresence '+error))
        }

        // Load commands in in all guilds
        for (const guild of bot.guilds.cache.values()) {
            await guild.commands.set(bot.commands);
        }

        console.log("\x1b[33m%s\x1b[0m",`Environment [${process.env.ENVIRONMENT}]`);
        console.log("\x1b[32m%s\x1b[0m",`${bot.user.tag} [READY]`);
    });
};
