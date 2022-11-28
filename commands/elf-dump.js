const { SlashCommandBuilder } = require('@discordjs/builders');
const { register, deregister, dump } = require('../modules/wishlist-manage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('elf-dump')
        .setDescription('Backup the elf database')
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        await interaction.deferReply();
        const channelId = interaction.client.channelId;
        const channel = interaction.client.channels.cache.get(channelId);
        let reply = await dump();
        if (!reply) {
            reply = 'Sorry, there was an error';
        }
        await channel.send({ content: reply, files: ['./assignments.csv'] });
        await interaction.editReply({ content: reply, ephemeral: true });
    },
    destroy: deregister,
    load: register,
};

