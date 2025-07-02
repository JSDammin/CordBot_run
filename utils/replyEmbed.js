const {EmbedBuilder, MessageFlags, ComponentsV2Assertions} = require('discord.js');

module.exports.status = {
	success: {
		emoji: '✅',
		color: '#19ff81',
	},
	failed: {
		emoji: '❌',
		color: '#ff4b19',
	},
	warn: {
		emoji: '⚠️',
		color: '#ff9d00',
	},
	error: {
		emoji: '⁉️',
		color: '#ff4b19',
	},
	idle: {
		emoji: '',
		color: '#ffffff',
	},
}

module.exports.getReplyEmbed = (status, content) => {
	let replyEmbed = new EmbedBuilder();

	replyEmbed.setDescription(`${status.emoji} **${content}**`);
    replyEmbed.setColor(status.color || this.status.idle.color);

	return replyEmbed;
};


module.exports.reply = async (interaction, content, status, ephemeral = false) => {
	let replyEmbed = this.getReplyEmbed(status, content)
	return interaction.reply({embeds: [replyEmbed], flags: ephemeral ? MessageFlags.Ephemeral : null});
};
module.exports.editReply = async (interaction, content, status, ephemeral = false) => {
	let replyEmbed = this.getReplyEmbed(status, content)
	return interaction.editReply({embeds: [replyEmbed], flags: ephemeral ? MessageFlags.Ephemeral : null});
};
module.exports.followUp = async (interaction, content, status, ephemeral = false) => {
	let replyEmbed = this.getReplyEmbed(status, content)
	return interaction.followUp({embeds: [replyEmbed], flags: ephemeral ? MessageFlags.Ephemeral : null});
};
module.exports.update = async (interaction, content, status, ephemeral = false) => {
	let replyEmbed = this.getReplyEmbed(status, content)
	return interaction.update({embeds: [replyEmbed], content: '', components: [], flags: ephemeral ? MessageFlags.Ephemeral : null});
};