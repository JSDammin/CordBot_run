const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');

require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});



const Bot = new Client({ 
    intents: [
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

let Handlers = fs.readdirSync(`./Handlers`).filter(file => file.endsWith('.js'));
for (let handler of Handlers) { 
	console.log('\x1b[36m%s\x1b[0m',`Loaded Handler: ${handler}`);
	require(`./Handlers/${handler}`)(Bot);
};

Bot.on('rateLimit', (info) => { console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: '[Unknown timeout]'}`) })

Bot.login(process.env.ENVIRONMENT === 'PRODUCTION' ? process.env.PRODUCTION_TOKEN : process.env.EXPERIMENTAL_TOKEN);

module.exports = Bot;