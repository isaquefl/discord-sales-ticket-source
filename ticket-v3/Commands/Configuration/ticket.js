const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "ticket",
    description: "Utilize para enviar uma embed para abrir um ticket",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({
            content: `**<a:errado1:1124475561545318462> | ${interaction.user}, Você precisa da permissão \`ADMNISTRATOR\` para usar este comando!**`,
            ephemeral: true,
        })

        await interaction.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.embeds_color.embed_invisible)
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .addFields(
                        { name: '<a:BSglobo:1124475443542765632> | Info', value: `> Para Criar um Ticket, basta clicar no botao Logo abaixo` },
                        { name: '<a:emoji_9:1124475548115144825> | Aviso!', value: `> Aguarde até q alguém venha atender seu ticket` }
                    )
                    .setImage("https://media.discordapp.net/attachments/1121635113147580557/1121659976822313030/standard.gif")
                    .setFooter({ text: `Copyright © skyline Store` })
            ],
            components: [
                new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('start_ticket')
                            .setLabel('Ticket')
                            .setEmoji('<:emjPastHurley:1124475544357052498>')
                            .setStyle(2)
                    )
            ]
        });

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.embeds_color.embed_success)
                    .setDescription(`<a:estrela:1124475564200296538> | Embed enviada com sucesso!`)
            ],
            ephemeral: true
        })
    }
}