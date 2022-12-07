const { SlashCommandBuilder } = require('@discordjs/builders');
const { stalk, register, deregister } = require('../modules/wishlist-manage');

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
        try {
            await interaction.reply({ content: reply, ephemeral: true });
        } catch (e) {
            console.log(`Elf-vision: ${e}`);
        }
    },
    destroy: deregister,
    load: register,
};

