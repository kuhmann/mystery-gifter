
const { loadDataFromJSON, saveDataAsJSON } = require('../modules/file-utils');

const wishlist_filename = 'assignments.json';
let data_updated = false;
let clients = 0;
let initialized = false;

const wishlists = {};
let file_save_interval;

async function register() {
    clients = clients + 1;
    if (!initialized) {
        return await load();
    }
}

async function deregister() {
    clients = clients - 1;
    if (clients <= 0) {
        return await destroy();
    }
}


async function load() {
    if (initialized) {
        return true;
    }
    initialized = true;
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
    initialized = false;
    return true;
}

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

function getWish(userId, wish) {
    // This is also a setter so probably a bad name for it
    if (userId in wishlists && 'wishlist' in wishlists[userId]) {
        const current_wish = wishlists[userId]['wishlist'];
        if (wish) {
            wishlists[userId]['wishlist'] = wish;
            console.log(`set ${userId}'s wish to '${wish}'`);
            data_updated = true;
            return 'Wishlist updated, your elf was not alerted';
        } else {
            return `Your current wish: '${current_wish ? current_wish : 'None'}'`;
        }
    } else {
        return 'Sorry, looks like you aren\'t signed up';
    }

}

function stalk(userId) {
    if (userId in wishlists) {
        // This means they registered
        const target = Object.keys(wishlists).filter(registered => wishlists[registered]['buyer'] === userId)[0];
        if (target) {
            const wish = wishlists[target].wishlist || 'None yet';
            wishlists[target].stalked = true;
            return [`Your person is <@${target}> and they are Hunter`,
                `${wishlists[target].hunterId} - `,
                `<https://mshnt.ca/p/${wishlists[target].hunterId}>`,
                `\nTheir secret wish is for "${wish}"`].join('');
        } else {
            return 'This is embarrassing, looks like we didn\'t assign you to anyone';
        }
    } else {
        return 'Sorry, looks like you aren\'t signed up';
    }
}

function dump_as_csv_string() {
    // Build a long string of CSV
}

exports.save = saveWishes;
exports.loader = load; // I think this should be register
exports.unloader = destroy; // I think this should be deregister
exports.getWish = getWish;
exports.stalk = stalk;
exports.register = register;
exports.deregister = deregister;
