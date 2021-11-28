const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('elf-me')
        .setDescription('Registers for the mystery gift program!')
        .addStringOption(option => option.setName('hunterid')
                .setDescription('Your Hunter ID')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user;
        const channelId = interaction.client.channelId;
        const channel = interaction.client.channels.cache.get(channelId);
        const hunterId = interaction.options.getString('hunterid');
        if (channel) {
            await interaction.deferReply({ephemeral: true});
            try {
                await channel.send({
                    content: `${user.id} aka <@${user.id}> is hunter id ${hunterId} which is <https://mshnt.ca/p/${hunterId}>`,
                });
            } catch (error) {
                console.error(`ELF-ME: ${user} had an error: ${error}`);
                await interaction.editReply({
                    content: "There was an error, sorry",
                    ephemeral: true,
                });
            }
            await interaction.editReply({
                content: `Registered you with ${interaction.options.getString('hunterid')}`,
                ephemeral: true,
            });
        } else {
            console.error(`Couldn't find channel ${channelId}`);
            await interaction.reply({
                content: "Sorry, this bot isn't set up right",
                ephemeral: true,
            })
        }
    }
};