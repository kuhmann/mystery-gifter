const fs = require('fs');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, channelId, signupsActive } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let is_exiting = false;

client.commands = new Collection();
client.channelId = channelId;
client.signupsActive = signupsActive;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (typeof command.load === 'function') {
        console.log(`Attempting to load ${command.data.name}`);
        command.load().catch((err) => {
            console.log(`Error loading ${command.data.name}: ${err}`);
            throw err;
        });
    }
    client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
    console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'I had a whoopsie!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'I had a whoopsie-doodle!', ephemeral: true });
        }
        // return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(token);

// Async functions aren't allowed here... so this will never run
async function exitHandler(options, exitCode) {
    if (is_exiting) {
        console.log('Already exiting');
        return;
    }
    is_exiting = true;
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(`Received ${exitCode}`);
    if (client && client.commands) {
        await doSaveAll();
        console.log('Destroys done');
    }
    if (options.exit) process.exit();
}

async function doSaveAll() {
    const destroys = client.commands.filter(command => typeof command.destroy === 'function');
    console.log(`Destroying ${[...destroys].length} commands`);
    const allDestroyed = await Promise.all(destroys.map(c => {
        console.log(`Destroying command "${c.data.name}"`);
        return c.destroy();
    }));
    console.log('All destroyed');
    return allDestroyed.every(destroyed => destroyed);
}

process.on('exit', exitHandler.bind(null, { exit: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
