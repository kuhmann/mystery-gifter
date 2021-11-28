const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('elf-me')
        .setDescription('Registers for the mystery gift program!')
        .addStringOption(option => option.setName('hunterId').setDescription('Your Hunter ID')),
    async execute(interaction) {
        await interaction.reply(`Registering you with ${interaction.options.getString('hunterId')}`);
    },
    ephemeral: true,
};