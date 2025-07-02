const Discord = require('discord.js');
const replyEmbed = require('../../utils/replyEmbed');


module.exports = {
	name: 'test',
	description: 'Admins use this command to test code before distribution.',
	usage: '[execute]',
	permissions: [Discord.PermissionFlagsBits.Administrator],
	cooldown: 5,
	options: [
		
		{
			type: 6,
			name: 'user',
			description: 'Insert user here.',
			required: false
		},
		{
			type: 3,
			name: 'string',
			description: 'Insert string here.',
			required: false
		},
		{
			type: 5,
			name: 'bool',
			description: 'Insert boolian here.',
			required: false
		},
		
	],
	
	async execute(interaction) {
		console.log('[===TEST=EXECUTED===]');
		let string = interaction.options.getString('string');
		let user = interaction.options.getUser('user');
		let member = interaction.guild.members.cache.get(interaction.user.id);
		await interaction.deferReply();
		await replyEmbed.editReply(interaction,`\`\`TEST COMMAND EXECUTED\`\``, replyEmbed.status.warn);

	}
};