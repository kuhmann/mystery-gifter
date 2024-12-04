const { SlashCommandBuilder } = require('discord.js');
const { registerUser, isRegistered } = require('../modules/wishlist-manage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('elf-me')
        .setDescription('Registers for the mystery gift program!')
        .addIntegerOption(option => option.setName('hunterid')
            .setDescription('Your Hunter ID')),
    async execute(interaction) {
        const user = interaction.user;
        const channelId = interaction.client.channelId;
        const channel = interaction.client.channels.cache.get(channelId);
        const hunterId = interaction.options.getInteger('hunterid').toString();
        const signupsActive = interaction.client.signupsActive;
        if (channel) {
            if (signupsActive) {
                await interaction.deferReply({ ephemeral: true });
                const alreadyRegistered = isRegistered(user.id);
                if (alreadyRegistered) {
                    if (hunterId && hunterId !== alreadyRegistered) {
                        // Using a new hunter Id
                        const registered = registerUser(user.id, hunterId);
                        if (registered) {
                            try {
                                await channel.send({
                                    content: `${user.id} aka <@${user.id}> CHANGED their hunter id from ${alreadyRegistered} to ${hunterId} which is <https://p.mshnt.ca/${hunterId}>`,
                                });
                                await interaction.editReply({
                                    content: `You changed from ${alreadyRegistered} to hunter id ${registered}`,
                                    ephemeral: true,
                                });
                            } catch (error) {
                                console.error(`ELF-ME: ${user} had an error: ${error}`);
                                await interaction.editReply({
                                    content: 'There was an error, sorry',
                                    ephemeral: true,
                                });
                            }
                        } else {
                            //Registration with the new hunter id failed
                            try {
                                await channel.send({
                                    content: `${user.id} aka <@${user.id}> FAILED to change their hunter id from ${alreadyRegistered} to ${hunterId} -- probably because someone else is using it.`,
                                });
                                await interaction.editReply({
                                    content: `You are still registered as ${alreadyRegistered} because I could not change you to ${hunterId}`,
                                    ephemeral: true,
                                });
                            } catch (error) {
                                console.error(`ELF-ME: ${user} had an error: ${error}`);
                                await interaction.editReply({
                                    content: 'There was an error, sorry',
                                    ephemeral: true,
                                });
                            }
                        }
                    } else if (hunterId && hunterId === alreadyRegistered) {
                        // Don't bother changing to what's already set
                        try {
                            await interaction.editReply({
                                content: `You are still registered as ${hunterId}`,
                                ephemeral: true,
                            });
                        } catch (error) {
                            console.error(`ELF-ME: ${user} had an error: ${error}`);
                            await interaction.editReply({
                                content: 'There was an error, sorry',
                                ephemeral: true,
                            });
                        }
                    } else if (alreadyRegistered) {
                        try {
                            await interaction.editReply({
                                content: `You are registered as ${alreadyRegistered}`,
                                ephemeral: true,
                            });
                        } catch (error) {
                            console.error(`ELF-ME: ${user} had an error: ${error}`);
                            await interaction.editReply({
                                content: 'There was an error, sorry',
                                ephemeral: true,
                            });
                        }
                    } else {
                        try {
                            await channel.send({
                                content: `${user.id} aka <@${user.id}> somehow got registered without a hunter ID... help!`,
                            });
                            await interaction.editReply({
                                content: 'Somehow you registered without a hunterId which should not be possible. I\'ve alerted the authorities but you should also contact a helper or Modmail.',
                                ephemeral: true,
                            });
                        } catch (error) {
                            console.error(`ELF-ME: ${user} had an error: ${error}`);
                            await interaction.editReply({
                                content: 'There was an error, sorry',
                                ephemeral: true,
                            });
                        }
                    }
                } else {
                    // This is a new user, they need a hunter Id
                    if (hunterId) {
                        const registered = registerUser(user.id, hunterId);
                        if (Array.isArray(registered) && registered.length === 1 && registered[0] === hunterId) {
                            try {
                                await channel.send({
                                    content: `${user.id} aka <@${user.id}> registered as ${hunterId} which is <https://p.mshnt.ca/${hunterId}>`,
                                });
                                await interaction.editReply({
                                    content: `You registered as ${registered}. That's <https://p.mshnt.ca/${registered}>. Please double-check, then you can set your wishlist.`,
                                    ephemeral: true,
                                });
                            } catch (error) {
                                console.error(`ELF-ME: ${user} had an error: ${error}`);
                                await interaction.editReply({
                                    content: 'There was an error, sorry',
                                    ephemeral: true,
                                });
                            }
                        } else {
                            try {
                                await channel.send({
                                    content: `${user.id} aka <@${user.id}> tried to register as ${hunterId} but failed, possibly because it was taken. ${registered}`,
                                });
                                await interaction.editReply({
                                    content: 'Registration failed for some reason. We let the helpers know but you can try modmail if you haven\'t heard from them',
                                    ephemeral: true,
                                });
                            } catch (error) {
                                console.error(`ELF-ME: ${user} had an error: ${error}`);
                                await interaction.editReply({
                                    content: 'There was an error, sorry',
                                    ephemeral: true,
                                });
                            }
                        }
                    } else {
                        try {
                            await interaction.editReply({
                                content: 'You are not registered. To register you will need to provide your hunterId',
                                ephemeral: true,
                            });
                        } catch (error) {
                            console.error(`ELF-ME: ${user} had an error: ${error}`);
                            await interaction.followUp({
                                content: 'There was an error, sorry',
                                ephemeral: true,
                            });
                        }
                    }
                }
            } else {
                await interaction.reply({ content: 'Signups are not active, sorry', ephemeral: true });
            }
        } else {
            console.error(`Couldn't find channel ${channelId}`);
            await interaction.reply({
                content: 'Sorry, this bot isn\'t set up right',
                ephemeral: true,
            });
        }
    },
};