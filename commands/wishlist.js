const { SlashCommandBuilder } = require('@discordjs/builders');
const { loader, unloader, getWish } = require('../modules/wishlist-manage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wishlist')
        .setDescription('Help your mystery elf by giving them gift ideas')
        .addStringOption(option => option.setName('wish')
            .setDescription('Your gift wishes')
            .setRequired(false)),
    async execute(interaction) {
        const user = interaction.user;
        const wish = interaction.options.getString('wish');
        let reply = getWish(user.id, wish);
        if (!reply) {
            reply = 'Sorry, there was an error';
        }
        await interaction.reply({ content: reply, ephemeral: true });
    },
    destroy: unloader,
    load: loader,
};

