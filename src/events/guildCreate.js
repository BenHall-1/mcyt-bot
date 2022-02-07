module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    guild.client.user.setActivity(`${guild.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} members in ${guild.client.guilds.cache.size} servers`, { type: 'WATCHING' });
    console.log(`Joined a new guild '${guild.name}' (${guild.id}) with ${guild.memberCount} members`);
  },
};
