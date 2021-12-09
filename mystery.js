const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, channelId, signupsActive } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
client.channelId = channelId;
client.signupsActive = signupsActive;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.load) {
        console.log(`Attempting to load ${command.data.name}`);
        command.load().catch((err) => {
            console.log(`Error loading ${command.data.name}: ${err}`);
            throw err;
        });
    }
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(token);

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (client && client.commands) {
        client.commands.filter(command => 'destroy' in command).each(command => command.destroy());
    }
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null, { exit: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
