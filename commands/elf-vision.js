const { SlashCommandBuilder } = require('@discordjs/builders');
const { stalk } = require('../modules/wishlist-manage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('elf-vision')
        .setDescription('See what your person is "secretly" wishing for.'),
    async execute(interaction) {
        const user = interaction.user;
        let reply = stalk(user.id);
        if (!reply) {
            reply = 'Sorry, there was an error';
        }
        await interaction.reply({ content: reply, ephemeral: true });
    },
};

