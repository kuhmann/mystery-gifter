const { SlashCommandBuilder } = require('@discordjs/builders');
const { loadDataFromJSON, saveDataAsJSON } = require('../modules/file-utils');
const wishlist_filename = 'assignments.json';
let data_updated = false;

const wishlists = {};
let file_save_interval;


async function load() {
    console.log('wl: loading wishlists');
    file_save_interval = setInterval(() => saveWishes(), 1*60*1000);
    console.log('wl: interval set');
    const wishes = await loadWishes();
    Object.assign(wishlists, wishes);
    console.log(`wl: loaded ${Object.keys(wishlists).length} lists`);
    return true;
}

async function destroy() {
    saveDataAsJSON('assignments.json', wishlists);
    clearInterval(file_save_interval);
    return true;
}

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
        if (user.id in wishlists && 'wishlist' in wishlists[user.id]) {
            const current_wish = wishlists[user.id]['wishlist'];
            if (wish) {
                wishlists[user.id]['wishlist'] = wish;
                console.log(`set ${user.id}'s wish to '${wish}'`)
                await interaction.reply({ content: 'Wishlist updated, your elf was not alerted', ephemeral: true });
                data_updated = true;
            } else {
                await interaction.reply({ content: `Your current wish: '${current_wish ? current_wish : 'None'}'`, ephemeral: true});
            }
        } else {
            await interaction.reply({ content: 'Sorry, looks like you aren\'t signed up', ephemeral: true });
        }
    },
    destroy: destroy,
    load: load,
};

async function loadWishes(path = wishlist_filename) {
    try {
        return await loadDataFromJSON(path);
    } catch (err) {
        console.error(`Problem loading from ${path}: ${err}`);
        return {};
    }
}

async function saveWishes(path = wishlist_filename) {
    if (data_updated) {
        const didSave = await saveDataAsJSON(path, wishlists);
        console.log(`Wishlists: ${didSave ? 'Saved' : 'Failed to save'} ${Object.keys(wishlists).length} to '${path}'`);
    }
}