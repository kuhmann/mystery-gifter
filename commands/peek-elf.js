const { SlashCommandBuilder } = require('@discordjs/builders');
const { register, deregister, peek } = require('../modules/wishlist-manage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('peek-elf')
        .setDescription('Try to catch your elf in action'),
    async execute(interaction) {
        const user = interaction.user;
        let reply = peek(user.id);
        if (!reply) {
            reply = 'Sorry, there was an error';
        }
        try {
            await interaction.reply({ content: reply, ephemeral: true });
        } catch (e) {
            console.log(`Peek: ${e}`);
        }
    },
    destroy: deregister,
    load: register,
};

