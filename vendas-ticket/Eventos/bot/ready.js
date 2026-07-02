const colors = require("colors");

module.exports = {
    name: "ready",
    run: async (client) => {

        console.log(colors.green('[STATUS]') + " " + client.user.username + " acabou de iniciar.");
        console.log(colors.green("[STATUS]") + " Online em " + client.guilds.cache.size + " servidores");
        console.log(" ");
        console.log(colors.grey("[dev]") + " @caduzzx");
        console.log(colors.cyan("[vazamentos da 6m nao tem comu]") + " => https://discord.gg/fluxsolutions");

    }
}
