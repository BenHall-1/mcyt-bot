/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {
  deploy: (botId, botToken) => {
    const commands = [];
    const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

    commandFiles.forEach((file) => {
      const command = require(`./commands/${file}`);
      commands.push(command.data.toJSON());
    });

    const rest = new REST({ version: '9' }).setToken(botToken);

    rest.put(Routes.applicationCommands(botId), { body: commands })
      .then((data) => {
        console.log('Successfully registered application commands.');
        const cmds = data.map((c) => ({ id: c.id, name: c.name }));
        console.log(cmds);
      })
      .catch(console.error);
  },
};
