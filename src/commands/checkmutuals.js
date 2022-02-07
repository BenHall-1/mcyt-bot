const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { reply } = require('../utils/messages');
const { has } = require('../utils/permissionUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkmutuals')
    .setDescription('Checks the mutual servers of the given Id(s)')
    .addStringOption((options) => options.setName('user_ids')
      .setDescription('The Id(s) that you want to check (Separated by commas)')
      .setRequired(true)),
  async execute(interaction) {
    if (!has(interaction.member, 'ADMINISTRATOR')) return;
    const userIdString = interaction.options.getString('user_ids');
    const userIds = userIdString.split(',');
    await reply(interaction, `Checking mutual servers for ${userIds.map((id) => `**${id}**`).join(',')}`);
    const checkedIdsWithGuilds = new Map();
    const userIdSearchFinished = new Promise((resolve) => {
      userIds.forEach((userId, index, array) => {
        interaction.client.users.fetch(userId).then(((user) => {
          interaction.client.guilds.cache.filter(async (guild) => {
            guild.members.fetch(user).then((gMem) => {
              if (gMem != null) {
                if (checkedIdsWithGuilds.get(user) === undefined) {
                  checkedIdsWithGuilds.set(user, []);
                }
                checkedIdsWithGuilds.get(user).push({ id: guild.id, name: guild.name });
              }
              if (index === array.length - 1) resolve();
            }).catch((e) => console.log(e));
          });
        }));
      });
    });
    userIdSearchFinished.then(() => {
      checkedIdsWithGuilds.forEach(async (guilds, user) => {
        const embed = new MessageEmbed()
          .setDescription(`Mutual servers for **${user}**`)
          .setColor('#9FF2A6')
          .setAuthor({ name: 'MCYT Bot', url: 'https://github.com/BenHall-1' });
        let msg = '';
        const fields = [];
        guilds.forEach((g) => {
          const msgToAdd = `- ${g.name} *(${g.id})*\n`;
          if ((msg + msgToAdd).length > 1024) {
            fields.push(msg);
            msg = msgToAdd;
          } else {
            msg += msgToAdd;
          }
        });
        fields.push(msg);
        fields.forEach((fMsg) => {
          embed.addField('\u200b', fMsg);
        });
        embed.addField('Requestor Information:', `- User Id: ${interaction.user.id}\n- Name: ${interaction.user}`);
        await interaction.followUp({ embeds: [embed] });
      });
    });
  },
};
