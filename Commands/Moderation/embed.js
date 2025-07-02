const { StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags, PermissionFlagsBits} = require('discord.js');
const replyEmbed = require('../../utils/replyEmbed');
const database = require('../../utils/database');
const basicEmbedModal = require('../../Modals/basicEmbedModal')
const advancedEmbedModal = require('../../Modals/advancedEmbedModal')
const buildEmbed = require('../../utils/buildEmbed');
const cleanName = require('../../utils/cleanName')



const embedCreate = async (interaction, embedName) => {
	const modal = basicEmbedModal(embedName)

	// Show the modal to the user
	await interaction.showModal(modal);
}

const embedAdvanced = async (interaction, embedName) => {
	const embedData = await database(`GET/main/embeds/${embedName}`)
	if (!embedData) return replyEmbed.reply(interaction, `Embed \`\`${embedName}\`\` does not exist`, replyEmbed.status.warn, true)

	const { author, content, fields } = embedData

	const modal = advancedEmbedModal(embedName, author, content, fields)

	// Show the modal to the user
	await interaction.showModal(modal);
}

const embedShow = async (interaction, embedName) => {
	const embedData = await database(`GET/main/embeds/${embedName}`)
	if (!embedData) return replyEmbed.reply(interaction, `Embed \`\`${embedName}\`\` does not exist`, replyEmbed.status.warn, true)

	const {title, description, color, thumbnail, image, content} = embedData

	const embed = buildEmbed(title, description, color, thumbnail, image)
	if (!embed) return

	interaction.channel.send({ content: content, embeds: [embed] })
	await replyEmbed.reply(interaction, `Sent \`\`${embedName}\`\` embed to \`\`${interaction.channel.name}\`\` channel`, replyEmbed.status.success, true)
}

const embedEdit = async (interaction, embedName) => {
	const embedData = await database(`GET/main/embeds/${embedName}`)
	if (!embedData) return replyEmbed.reply(interaction, `Embed \`\`${embedName}\`\` does not exist`, replyEmbed.status.warn, true)

	const {title, description, color, thumbnail, image} = embedData

	const modal = basicEmbedModal(embedName, title, description, thumbnail, image, color)

	// Show the modal to the user
	await interaction.showModal(modal);
}

const embedDelete = async (interaction, embedName) => {
	const embedData = await database(`GET/main/embeds/${embedName}`)
	if (!embedData) replyEmbed.reply(interaction, `Embed \`\`${embedName}\`\` does not exist`, replyEmbed.status.warn, true)

	await database(`DEL/main/embeds/${embedName}`)

	return replyEmbed.reply(interaction, `Deleted embed \`\`${embedName}\`\``, replyEmbed.status.success, true)
}


const embedList = async (interaction) => { // WORKKKKKKK	
	const embeds = await database(`GETALL/main/embeds`)
	let string = '|'

	for (const key in embeds) {
		string += ` ${embeds[key].id} |`
	}

	return replyEmbed.reply(interaction, `Saved Embeds\n${string}`, replyEmbed.status.idle, true)
}

/*
const createEmbedList = async (interaction, subCommand) => {
	await interaction.deferReply({flags: MessageFlags.Ephemeral})

    const embeds = await database(`GETALL/main/embeds`);
    if (!embeds) return; // Note: Handle better

    const optionsList = embeds.map(embed => ({ label: embed.id, value: embed.id }));

    if (optionsList.length === 0) return interaction.editReply({ content: 'There are currently no embeds saved.', flags: MessageFlags.Ephemeral });

    const customId = subCommand === 'show' ? 'embed_show' : 'embed_edit';
    const placeholder = subCommand === 'show' ? 'Choose an embed to show...' : 'Choose an embed to edit...';

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(customId)
        .setPlaceholder(placeholder)
        .addOptions(optionsList);
showEmbed
    const row = new ActionRowBuilder().addComponents(selectMenu);
    interaction.editReply({ content: `Select the embed you would like to ${subCommand}.`, components: [row], flags: MessageFlags.Ephemeral });
}
*/



module.exports = {
	name: 'embed',
	description: 'Embed',
	usage: '',
	permissions: [PermissionFlagsBits.BanMembers, PermissionFlagsBits.KickMembers],
	cooldown: 5,
	options: [
		{
			name: 'create',
			description: 'Create a new embed',
			type: 1,
			options: [
				{
					name: 'name',
					description: 'Give the embed a unique name',
					type: 3,
					required: true,
				}
			]
		},
		{
			name: 'advanced',
			description: 'Change advanced settings on an embed',
			type: 1,
			options: [
				{
					name: 'name',
					description: 'Name of the embed you would like to modify',
					type: 3,
					required: true,
				}
			]
		},
		{
			name: 'show',
			description: 'Show an embed',
			type: 1,
			options: [
				{
					name: 'name',
					description: 'Name of the embed you would like to show',
					type: 3,
					required: true,
				}
			]
		},
		{
			name: 'edit',
			description: 'Edit an embed',
			type: 1,
			options: [
				{
					name: 'name',
					description: 'Name of the embed you would like to edit',
					type: 3,
					required: true,
				}
			]
		},
		{
			name: 'delete',
			description: 'Delete an embed',
			type: 1,
			options: [
				{
					name: 'name',
					description: 'Name of the embed you would like to delete',
					type: 3,
					required: true,
				}
			]
		},
		{
			name: 'list',
			description: 'list all saved embeds',
			type: 1
		}
	],
	
	async execute(interaction) {	
		const subCommand = interaction.options.getSubcommand()

		if (subCommand === 'list') {
			return await embedList(interaction)
		}

		const inputName = interaction.options.getString('name');
		const embedName = cleanName(inputName)
		if (!embedName) return replyEmbed.reply(interaction, `Embed name must contain only letters, numbers, hyphens (-), and underscores (_)`, replyEmbed.status.failed, true)


		if (subCommand === 'create') {
			await embedCreate(interaction, embedName);
		}
		if (subCommand === 'advanced') {
			await embedAdvanced(interaction, embedName)
		}
		if (subCommand === 'show') {
			await embedShow(interaction, embedName)
		}
		if (subCommand === 'edit') {
			await embedEdit(interaction, embedName)
		}
		if (subCommand === 'delete') {
			await embedDelete(interaction, embedName)
		}
	}
};