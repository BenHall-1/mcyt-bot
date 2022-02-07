/* eslint-disable no-param-reassign */
require('dotenv').config();
const { login } = require('./bot');

const clients = [];

clients[process.env.CLIENT_ID] = login(process.env.CLIENT_ID, process.env.DISCORD_TOKEN);

process.on('SIGINT', () => {
  console.log('Shutting down nicely...');
  clients.forEach((client) => client.destroy());
  process.exit();
});
