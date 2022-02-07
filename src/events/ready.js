const { deploy } = require('../deploy-commands');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    try {
      console.log(`Ready! Logged in as ${client.user.tag}`);
      client.user.setActivity(`${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} members in ${client.guilds.cache.size} servers`, { type: 'WATCHING' });
      if (process.env.ADMIN_COMMAND_ID === '') {
        deploy(process.env.CLIENT_ID, process.env.DISCORD_TOKEN);
      }
    } catch (e) {
      console.error(e);
    }
  },
};
