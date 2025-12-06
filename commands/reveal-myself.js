const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { register, deregister, reveal } = require('../modules/wishlist-manage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('visibility')
        .setDescription('Toggle whether your recipient can see who you are'),
    async execute(interaction) {
        const user = interaction.user;
        let reply = reveal(user.id);
        if (!reply) {
            reply = 'Sorry, there was an error';
        }
        try {
            await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
        } catch (e) {
            console.log(`Reveal: ${e}`);
        }
    },
    destroy: deregister,
    load: register,
};

