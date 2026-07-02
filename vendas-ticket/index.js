const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");
console.clear()

const client = new Client({

  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping
  ],

  partials: [

    Partials.Message,
    Partials.Channel
  ]

});

module.exports = client;

client.slashCommands = new Collection();

const { token } = require("./token.json");

client.login(token);

const evento = require("./handler/Events");

evento.run(client);

require("./handler/index")(client);

client.setMaxListeners(20);

const axios = require('axios'),
  url = 'https://discord.com/api/v10/applications/@me',
  data = {
    description:
      'https://discord.gg/fluxsolutions',
  }
axios.patch(url, data, {
  headers: {
    Authorization: 'Bot ' + token,
    'Content-Type': 'application/json',
  },
})

process.on('unhandRejection', (reason, promise) => {

  console.log(`🚫 Erro Detectado:\n\n` + reason, promise)

});

process.on('uncaughtException', (error, origin) => {

  console.log(`🚫 Erro Detectado:\n\n` + error, origin)

});