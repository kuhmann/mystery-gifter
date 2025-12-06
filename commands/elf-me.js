const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { registerUser, isRegistered, register, deregister } = require('../modules/wishlist-manage');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('elf-me')
        .setDescription('Registers for the mystery gift program!')
        .addIntegerOption(option => option.setName('hunterid')
            .setDescription('Your Hunter ID').setRequired(true)),
    async execute(interaction) {
        const user = interaction.user;
        const channelId = interaction.client.channelId;
        const channel = interaction.client.channels.cache.get(channelId);
        const hunterId = interaction.options.getInteger('hunterid').toString();
        const signupsActive = interaction.client.signupsActive;
        if (channel) {
            if (signupsActive) {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });
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
                                    flags: MessageFlags.Ephemeral,
                                });
                            } catch (error) {
                                console.error(`ELF-ME: ${user} had an error: ${error}`);
                                await interaction.editReply({
                                    content: 'There was an error, sorry',
                                    flags: MessageFlags.Ephemeral,
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
                                    flags: MessageFlags.Ephemeral,
                                });
                            } catch (error) {
                                console.error(`ELF-ME: ${user} had an error: ${error}`);
                                await interaction.editReply({
                                    content: 'There was an error, sorry',
                                    flags: MessageFlags.Ephemeral,
                                });
                            }
                        }
                    } else if (hunterId && hunterId === alreadyRegistered) {
                        // Don't bother changing to what's already set
                        try {
                            await interaction.editReply({
                                content: `You are still registered as ${hunterId}`,
                                flags: MessageFlags.Ephemeral,
                            });
                        } catch (error) {
                            console.error(`ELF-ME: ${user} had an error: ${error}`);
                            await interaction.editReply({
                                content: 'There was an error, sorry',
                                flags: MessageFlags.Ephemeral,
                            });
                        }
                    } else if (alreadyRegistered) {
                        try {
                            await interaction.editReply({
                                content: `You are registered as ${alreadyRegistered}`,
                                flags: MessageFlags.Ephemeral,
                            });
                        } catch (error) {
                            console.error(`ELF-ME: ${user} had an error: ${error}`);
                            await interaction.editReply({
                                content: 'There was an error, sorry',
                                flags: MessageFlags.Ephemeral,
                            });
                        }
                    } else {
                        try {
                            await channel.send({
                                content: `${user.id} aka <@${user.id}> somehow got registered without a hunter ID... help!`,
                            });
                            await interaction.editReply({
                                content: 'Somehow you registered without a hunterId which should not be possible. I\'ve alerted the authorities but you should also contact a helper or Modmail.',
                                flags: MessageFlags.Ephemeral,
                            });
                        } catch (error) {
                            console.error(`ELF-ME: ${user} had an error: ${error}`);
                            await interaction.editReply({
                                content: 'There was an error, sorry',
                                flags: MessageFlags.Ephemeral,
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
                                    flags: MessageFlags.Ephemeral,
                                });
                            } catch (error) {
                                console.error(`ELF-ME: ${user} had an error: ${error}`);
                                await interaction.editReply({
                                    content: 'There was an error, sorry',
                                    flags: MessageFlags.Ephemeral,
                                });
                            }
                        } else {
                            try {
                                await channel.send({
                                    content: `${user.id} aka <@${user.id}> tried to register as ${hunterId} but failed, possibly because it was taken. ${registered}`,
                                });
                                await interaction.editReply({
                                    content: 'Registration failed for some reason. We let the helpers know but you can try modmail if you haven\'t heard from them',
                                    flags: MessageFlags.Ephemeral,
                                });
                            } catch (error) {
                                console.error(`ELF-ME: ${user} had an error: ${error}`);
                                await interaction.editReply({
                                    content: 'There was an error, sorry',
                                    flags: MessageFlags.Ephemeral,
                                });
                            }
                        }
                    } else {
                        try {
                            await interaction.editReply({
                                content: 'You are not registered. To register you will need to provide your hunterId',
                                flags: MessageFlags.Ephemeral,
                            });
                        } catch (error) {
                            console.error(`ELF-ME: ${user} had an error: ${error}`);
                            await interaction.followUp({
                                content: 'There was an error, sorry',
                                flags: MessageFlags.Ephemeral,
                            });
                        }
                    }
                }
            } else {
                await interaction.reply({ content: 'Signups are not active, sorry', flags: MessageFlags.Ephemeral });
            }
        } else {
            console.error(`Couldn't find channel ${channelId}`);
            await interaction.reply({
                content: 'Sorry, this bot isn\'t set up right',
                flags: MessageFlags.Ephemeral,
            });
        }
    },
    destroy: deregister,
    load: register,
};