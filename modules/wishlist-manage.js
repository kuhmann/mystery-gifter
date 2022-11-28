
const { loadDataFromJSON, saveDataAsJSON, saveDataAsCSV } = require('../modules/file-utils');

const wishlist_filename = 'assignments.json';
let data_updated = false;
let clients = 0;
let initialized = false;

const wishlists = {};
let file_save_interval;

async function register() {
    clients = clients + 1;
    console.log(`Registered command, ${clients} registered`);
    if (!initialized) {
        return await load();
    }
}

async function deregister() {
    clients = clients - 1;
    console.log(`Deregistered command, ${clients} registered`);
    if (clients === 0) {
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
    console.log('Saving wishlist!');
    await saveWishes();
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
    if (data_updated && Object.keys(wishlists).length) {
        const didSave = await saveDataAsJSON(path, wishlists);
        console.log(`Wishlists: ${didSave ? 'Saved' : 'Failed to save'} ${Object.keys(wishlists).length} to '${path}'`);
        data_updated = false;
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
            data_updated = true;
            return [`Your person is <@${target}> and they are Hunter `,
                `${wishlists[target].hunterId} - `,
                `<https://mshnt.ca/p/${wishlists[target].hunterId}>`,
                `\nTheir secret wish is for "${wish}"`,
                `\nWhen you're ready, ||send your gift to <@${wishlists[target].helperDiscordId}> `,
                `at <https://mshnt.ca/p/${wishlists[target].helperId}>||`].join('');
        } else {
            return 'This is embarrassing, looks like we didn\'t assign you to anyone';
        }
    } else {
        return 'Sorry, looks like you aren\'t signed up';
    }
}

/**
 * Toggle if you can be seen by the person you are buying for
 * @param {Snowflake} userId - discord ID for the person running the command
 * @returns Current status 
 */
function reveal(userId) {
    if (userId in wishlists) {
        //confirm they're registered
        const target = Object.keys(wishlists).filter(registered => wishlists[registered]['buyer'] === userId)[0];
        if (target) {
            if ('can_see_santa' in wishlists[target]) {
                wishlists[target].can_see_santa = !wishlists[target].can_see_santa;
            } else {
                wishlists[target].can_see_santa = true;
            }
            data_updated = true;
            return wishlists[target].can_see_santa ? 'Your person can see who sent them a present' : 'You are hidden from your person';
        } else {
            return 'You seem to be participating but are not assigned to anyone yet';
        }
    }
    return 'You do not appear to be participating';
}

function peek(userId) {
    // To see who sent you something you must be registered.
    // They must have set can_see_santa
    if (userId in wishlists) {
        if ('can_see_santa' in wishlists[userId] && wishlists[userId].can_see_santa) {
            // The person has chosen to reveal themself
            return `Your mystery gifter was none other than ||<@${wishlists[userId].buyer}>||!`;
        } else {
            return 'You tried your best but your mystery gifter will remain a mystery although you can try again later...';
        }
    }
    return 'You do not appear to be participating';
}

async function dump_as_csv_string() {
    const out_array = [['person', 'buyer', 'hunterId', 'helper', 'helperId', 'helperDiscordId', 'stalked', 'can_see_santa', 'wishlist']];
    for (const hunter in wishlists) {
        out_array.push([
            hunter,
            wishlists[hunter].buyer,
            wishlists[hunter].hunterId,
            wishlists[hunter].helper,
            wishlists[hunter].helperId,
            wishlists[hunter].helperDiscordId,
            'stalked' in wishlists[hunter],
            'can_see_santa' in wishlists[hunter] ? wishlists[hunter].can_see_santa : false,
            wishlists[hunter].wishlist,
        ]);
    }
    // Build a long string of CSV
    await saveDataAsCSV('assignments.csv', out_array);
    return 'Data saved';
}
exports.save = saveWishes;
exports.loader = load; // I think this should be register
exports.unloader = destroy; // I think this should be deregister
exports.getWish = getWish;
exports.stalk = stalk;
exports.dump = dump_as_csv_string;
exports.reveal = reveal;
exports.peek = peek;
exports.register = register;
exports.deregister = deregister;
