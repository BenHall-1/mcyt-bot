/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { deploy: deployCommands } = require('./deploy-commands');

module.exports = {
  login: (botId, botToken) => {
    const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    // Register Commands & Menus
    client.commands = new Collection();
    client.menus = new Collection();

    const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

    commandFiles.forEach((file) => {
      const command = require(`./commands/${file}`);
      client.commands.set(command.data.name, command);
    });

    const eventFiles = fs.readdirSync('./src/events').filter((file) => file.endsWith('.js'));

    eventFiles.forEach((file) => {
      const event = require(`./events/${file}`);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    });

    client.on('interactionCreate', async (interaction) => {
      try {
        if (interaction.isCommand()) {
          const command = client.commands.get(interaction.commandName);
          if (!command) return;

          await command.execute(interaction);
        }

        return;
      } catch (error) {
        console.error(error);
      }
    });

    client.on('ready', () => {
      deployCommands(botId, botToken);
    });

    client.login(botToken);

    return client;
  },
};
