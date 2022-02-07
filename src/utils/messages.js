const { MessageEmbed } = require('discord.js');

function embed() {
  return new MessageEmbed()
    .setColor('#9FF2A6')
    .setAuthor({ name: 'MCYT Bot', url: 'https://github.com/BenHall-1' });
}

module.exports = {
  reply: async (interaction, message, ephemeral = false, components = null) => {
    const e = embed().setDescription(message);
    await interaction.reply({ embeds: [e], ephemeral, components });
  },
  followUp: async (interaction, message, ephemeral = false, components = null) => {
    const e = embed().setDescription(message);
    await interaction.followUp({ embeds: [e], ephemeral, components });
  },
  send: async (channel, message) => {
    const e = embed().setDescription(message);
    await channel.send({ embeds: [e] });
  },
  editReply: async (interaction, message, ephemeral = false, components = null) => {
    const e = embed().setDescription(message);
    await interaction.editReply({ embeds: [e], ephemeral, components });
  },
};
