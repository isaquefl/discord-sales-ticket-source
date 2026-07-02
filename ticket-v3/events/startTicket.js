const Discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment-timezone');
const sourcebin = require('sourcebin');

module.exports = {
    name: 'startTicket',
    async execute(interaction) {

        if (interaction.isButton() && interaction.customId === "start_ticket") {
            const channel = interaction.guild.channels.cache.find(c => c.name === `🎫-${interaction.user.username.toLowerCase().replace(/ /g, '-')}`);

            if (channel) return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_error)
                        .setDescription(`<a:errado1:1124475561545318462> | Você já possui um ticket aberto em ${channel}.`)
                ], ephemeral: true
            })

            const modal = new Discord.ModalBuilder()
                .setCustomId('modal_ticket')
                .setTitle(`Abrir novo ticket`)

            const title = new Discord.TextInputBuilder()
                .setCustomId('title')
                .setLabel('Qual é o motivo do ticket?')
                .setRequired(true)
                .setMaxLength(150)
                .setStyle(1)
                .setPlaceholder('Dúvida');

            const description = new Discord.TextInputBuilder()
                .setCustomId('description')
                .setLabel('Qual é o a descrição?')
                .setRequired(false)
                .setMaxLength(255)
                .setStyle(2)
                .setPlaceholder('Queria saber mais informações sobre...');

            modal.addComponents(
                new Discord.ActionRowBuilder().addComponents(title),
                new Discord.ActionRowBuilder().addComponents(description),
            );

            return interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId === "modal_ticket") {
            const title = interaction.fields.getTextInputValue('title')
            const description = interaction.fields.getTextInputValue('description') || 'Nenhum.'

            const channel = await interaction.guild.channels.create({
                name: `🎫-${interaction.user.username}`,
                type: 0,
                parent: config.ticket.category_id,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["ViewChannel"]
                    },
                    {
                        id: interaction.user.id,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions"]
                    },
                    {
                        id: config.ticket.support_role,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions"]
                    }
                ],
            })

            db.set(`ticket_${channel.id}`, { owner_id: interaction.user.id, title, description })

            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_success)
                        .setDescription(`<a:Dancarino:1124475537096708176> | Olá ${interaction.user}, Seu ticket criado com sucesso em ${channel}.`),
                ],
                components: [
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setEmoji('🔗')
                                .setLabel('Acessar ticket')
                                .setStyle(5)
                                .setURL(`${channel.url}`)
                        )
                ],
                ephemeral: true
            })

            channel.send({
                content: `||${interaction.user} - ${interaction.guild.roles.cache.get(config.ticket.support_role)}||`,
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_invisible)
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: true, format: "png", size: 4096 })}`)
                        .setDescription(`> **<@${interaction.user.id}>, boas vindas ao seu ticket.**\n`)
                        .addFields(
                            { name: `<:ID:1124475575059357696> Motivo`, value: `\`\`${title}\`\`` },
                            { name: '<a:BSglobo:1124475443542765632> Descrição', value: `\`\`${description}\`\`` }
                        )
                ],
                components: [new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("close_ticket")
                            .setEmoji("🔒")
                            .setLabel("Fechar")
                            .setStyle(4),
                        new Discord.ButtonBuilder()
                            .setCustomId("painel_member")
                            .setEmoji("👨‍💼")
                            .setLabel("Painel membro")
                            .setStyle(3),
                        new Discord.ButtonBuilder()
                            .setCustomId("painel_staff")
                            .setEmoji("💼")
                            .setLabel("Painel staff")
                            .setStyle(1),
                        new Discord.ButtonBuilder()
                            .setCustomId("painel_sale")
                            .setEmoji("🛒")
                            .setLabel("Painel vendas")
                            .setStyle(2)
                    )
                ]
            })
        }

        if (interaction.isButton() && interaction.customId === "close_ticket") {
            const ticket = await db.get(`ticket_${interaction.channel.id}`);

            const user = await interaction.guild.members.cache.get(ticket.owner_id)

            if (interaction.user.id !== user.id && !interaction.member.roles.cache.get(config.ticket.support_role)) return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_error)
                        .setDescription(`<a:errado1:1124475561545318462> | Você não tem permissão de utilizar esta opção!`)
                ],
                ephemeral: true
            })

            interaction.channel.edit({
                name: `closed-${interaction.user.username}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["ViewChannel"],
                    },
                    {
                        id: user.id,
                        deny: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions"],
                    },
                    {
                        id: config.ticket.support_role,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions"]
                    }
                ]
            })

            user.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_invisible)
                        .setDescription(`> 🔒 Olá ${interaction.user}, seu ticket ${interaction.channel} foi fechado, caso tenha alguma dúvida entre em contato com a administração!`)
                        .addFields(
                            { name: '📋 Fechado por', value: `\`\`\`${interaction.user.tag}\`\`\`` },
                            { name: '📅 Data de fechamento', value: `\`\`\`${moment().utc().tz('America/Sao_Paulo').format('DD/MM/Y - HH:mm:ss')}\`\`\`` }
                        )
                ]
            })

            interaction.update({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_invisible)
                        .setDescription(`🔒 O ticket foi fechado por ${interaction.user}.`)
                ],
                components: [
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId("open_ticket")
                                .setEmoji("🔓")
                                .setLabel("Abrir")
                                .setStyle(4),
                            new Discord.ButtonBuilder()
                                .setCustomId("delete_ticket")
                                .setEmoji("🗑️")
                                .setLabel("Deletar")
                                .setStyle(4),
                            new Discord.ButtonBuilder()
                                .setCustomId("painel_member")
                                .setEmoji("👨‍💼")
                                .setLabel("Painel membro")
                                .setStyle(3)
                                .setDisabled(true),
                            new Discord.ButtonBuilder()
                                .setCustomId("painel_staff")
                                .setEmoji("💼")
                                .setLabel("Painel staff")
                                .setStyle(1)
                                .setDisabled(true),
                            new Discord.ButtonBuilder()
                                .setCustomId("painel_sale")
                                .setEmoji("🛒")
                                .setLabel("Painel vendas")
                                .setStyle(2)
                                .setDisabled(true),
                        )
                ]
            })
        } else if (interaction.isButton() && interaction.customId === "open_ticket") {
            const ticket = await db.get(`ticket_${interaction.channel.id}`);

            const user = await interaction.guild.members.cache.get(ticket.owner_id)

            if (interaction.user.id !== user.id && !interaction.member.roles.cache.get(config.ticket.support_role)) return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_error)
                        .setDescription(`<a:errado1:1124475561545318462> | Você não tem permissão de utilizar esta opção!`)
                ],
                ephemeral: true
            })

            interaction.channel.edit({
                name: `🎫-${interaction.user.username}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["ViewChannel"],
                    },
                    {
                        id: user.id,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions"],
                    },
                    {
                        id: config.ticket.support_role,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions"]
                    }
                ]
            })

            user.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_invisible)
                        .setDescription(`> 🔓 Olá ${interaction.user}, seu ticket ${interaction.channel} foi aberto, caso tenha alguma dúvida entre em contato com a administração!`)
                        .addFields(
                            { name: '📋 aberto por', value: `\`\`\`${interaction.user.tag}\`\`\`` },
                            { name: '📅 Data de fechamento', value: `\`\`\`${moment().utc().tz('America/Sao_Paulo').format('DD/MM/Y - HH:mm:ss')}\`\`\`` }
                        )
                ]
            })

            interaction.update({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_invisible)
                        .setDescription(`🔓 O ticket foi aberto por ${interaction.user}.`)
                ],
                components: [new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("close_ticket")
                            .setEmoji("🔒")
                            .setLabel("Fechar")
                            .setStyle(4),
                        new Discord.ButtonBuilder()
                            .setCustomId("painel_member")
                            .setEmoji("👨‍💼")
                            .setLabel("Painel membro")
                            .setStyle(3),
                        new Discord.ButtonBuilder()
                            .setCustomId("painel_staff")
                            .setEmoji("💼")
                            .setLabel("Painel staff")
                            .setStyle(1),
                        new Discord.ButtonBuilder()
                            .setCustomId("painel_sale")
                            .setEmoji("🛒")
                            .setLabel("Painel vendas")
                            .setStyle(2)
                    )
                ]
            })
        } else if (interaction.isButton() && interaction.customId === "painel_member") {
            const ticket = await db.get(`ticket_${interaction.channel.id}`);

            const user = await interaction.guild.members.cache.get(ticket.owner_id)

            if (interaction.user.id !== user.id) return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_error)
                        .setDescription(`❌ | Você não tem permissão para abrir está função, somente o dono do ticket.`)
                ],
                ephemeral: true
            })

            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_invisible)
                        .setDescription(`✅ | Painel membro aberto com sucesso, escolha uma das opções abaixo:`)
                ],
                components: [
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.StringSelectMenuBuilder()
                                .setCustomId('options_member')
                                .setPlaceholder('Escolha uma opção!')
                                .addOptions(
                                    { label: '➕ Criar call', value: `create_call` },
                                    { label: '🗑️ Deletar call', value: `delete_call` },
                                    { label: '👤 Adicionar usuário', value: `add_user` },
                                    { label: '🗑️ Remover usuário', value: `remove_user` },
                                    { label: '💾 Salvar logs', value: `transcript` }
                                )
                        )
                ],
                ephemeral: true
            })
        } else if (interaction.isStringSelectMenu() && interaction.customId === "options_member") {
            const ticket = await db.get(`ticket_${interaction.channel.id}`);
            const user = await interaction.guild.members.cache.get(ticket.owner_id)

            const option = interaction.values[0];

            if (option === "create_call") {
                const channel_find = await interaction.guild.channels.cache.find(c => c.name === `📞-${interaction.user.username.toLowerCase().replace(/ /g, '-')}`)

                if (channel_find) return interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_error)
                            .setDescription(`❌ | Você já possui uma call aberta em ${channel_find}`)
                    ],
                    components: [
                        new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setStyle(5)
                                    .setLabel('Entrar na call')
                                    .setURL(channel_find.url)
                            )
                    ],
                    ephemeral: true
                })

                const channel = await interaction.guild.channels.create({
                    name: `📞-${interaction.user.username.toLowerCase().replace(/ /g, '-')}`,
                    type: 2,
                    parent: config.ticket.category_call_id,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"],
                        },
                        {
                            id: interaction.user.id,
                            allow: ["Connect", "ViewChannel"],
                        },
                        {
                            id: config.ticket.support_role,
                            allow: ["Connect", "ViewChannel"],
                        },
                    ]
                })

                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_success)
                            .setDescription(`✅ | Call criada com sucesso em ${channel}`)
                    ],
                    components: [
                        new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setStyle(5)
                                    .setLabel('Entrar na call')
                                    .setURL(channel.url)
                            )
                    ],
                    ephemeral: true,
                })
            } else if (option === "delete_call") {
                const channel_find = await interaction.guild.channels.cache.find(c => c.name === `📞-${interaction.user.username.toLowerCase().replace(/ /g, '-')}`)

                if (!channel_find) return interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_error)
                            .setDescription(`❌ | Você não nenhuma possui uma call aberta!`)
                    ],
                    components: [],
                    ephemeral: true
                })

                await channel_find.delete();

                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_success)
                            .setDescription(`✅ | Call deletada com sucesso!`)
                    ],
                    components: [],
                    ephemeral: true
                })
            } else if (option === "add_user") {
                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setDescription(`👤 | Marce ou envie o ID do usuário que você deseja adicionar!`)
                    ],
                    components: [],
                    ephemeral: true
                })

                const filter = i => i.member.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({ filter });

                collector.on('collect', async (collect) => {
                    const user_content = await collect.content;
                    collect.delete()

                    const user_collected = interaction.guild.members.cache.get(user_content);

                    if (!user_collected) return interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor(config.embeds_color.embed_error)
                                .setDescription(`❌ | Não foi possível encontrar o usuário \`${user_content}\`, tente novamente!`)
                        ],
                        components: [],
                        ephemeral: true
                    })

                    if (interaction.channel.permissionsFor(user_collected.id).has("ViewChannel")) return interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor(config.embeds_color.embed_error)
                                .setDescription(`❌ | O usuário ${user_collected}(\`${user_collected.id}\`) já possui acesso ao ticket!`)
                        ],
                        components: [],
                        ephemeral: true
                    })

                    await interaction.channel.edit({
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: ["ViewChannel"],
                            },
                            {
                                id: user.id,
                                allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                            },
                            {
                                id: user_collected.id,
                                allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                            },
                            {
                                id: config.ticket.support_role,
                                allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                            },
                        ]
                    })

                    interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor(config.embeds_color.embed_success)
                                .setDescription(`✅ | O usuário ${user_collected}(\`${user_collected.id}\`) foi adicionado com sucesso!`)
                        ],
                        components: [],
                        ephemeral: true
                    })

                    collector.stop()
                });
            } else if (option === "remove_user") {
                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setDescription(`👤 | Marce ou envie o ID do usuário que você deseja removerr!`)
                    ],
                    components: [],
                    ephemeral: true
                })

                const filter = i => i.member.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({ filter });

                collector.on('collect', async (collect) => {
                    const user_content = await collect.content;
                    collect.delete()

                    const user_collected = interaction.guild.members.cache.get(user_content);

                    if (!user_collected) return interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor(config.embeds_color.embed_error)
                                .setDescription(`❌ | Não foi possível encontrar o usuário \`${user_content}\`, tente novamente!`)
                        ],
                        components: [],
                        ephemeral: true
                    })

                    if (!interaction.channel.permissionsFor(user_collected.id).has("ViewChannel")) return interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor(config.embeds_color.embed_error)
                                .setDescription(`❌ | O usuário ${user_collected}(\`${user_collected.id}\`) não possui acesso ao ticket!`)
                        ],
                        components: [],
                        ephemeral: true
                    })

                    await interaction.channel.edit({
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: ["ViewChannel"],
                            },
                            {
                                id: user_collected.id,
                                denny: ["ViewChannel"],
                            },
                            {
                                id: user.id,
                                allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                            },
                            {
                                id: config.ticket.support_role,
                                allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                            },
                        ]
                    })

                    interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor(config.embeds_color.embed_success)
                                .setDescription(`✅ | O usuário ${user_collected}(\`${user_collected.id}\`) foi removido com sucesso!`)
                        ],
                        components: [],
                        ephemeral: true
                    })

                    collector.stop()
                });
            } else if (option === "transcript") {
                await interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setDescription(`<a:carregando_2:1124475451973316798> Salvando logs do ticket ${interaction.channel}, aguarde um pouco...`)
                    ],
                    components: [],
                    ephemeral: true
                })

                let output = interaction.channel.messages.cache.filter(m => m.author.bot !== true).map(m =>
                    `${new Date(m.createdTimestamp).toLocaleString('pt-BR')}-${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                ).reverse().join('\n');

                if (output.length < 1) output = "Nenhuma conversa aqui :)"

                try {
                    response = await sourcebin.create({
                        title: `Histórico do ticket: ${interaction.channel.name}`,
                        description: `Copyright © Skyline Store`,
                        files: [
                            {
                                content: output,
                                language: 'text',
                            },
                        ],
                    });
                } catch (e) {
                    return interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor(config.embeds_color.embed_error)
                                .setDescription(`❌ | Ocorreu um erro ao salvar as logs do ticket ${interaction.channel}, tente novamente!`)
                        ],
                        components: [],
                        ephemeral: true
                    })
                }

                await interaction.user.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setTitle(`📄 Historico de mensagens do ticket`)
                            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                            .addFields(
                                {
                                    name: '🎰 Canal:',
                                    value: `\`\`\`${interaction.channel.name}\`\`\``,
                                    inline: false
                                },
                                {
                                    name: '⌛ Protocolo:',
                                    value: `\`\`\`${interaction.channel.id}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: '📅 Data de emissão',
                                    value: `\`\`\`${moment().utc().tz('America/Sao_Paulo').format('DD/MM/Y - HH:mm:ss')}\`\`\``
                                },
                            )
                    ],
                    components: [
                        new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setStyle(5)
                                    .setEmoji('📄')
                                    .setLabel('Ir para logs')
                                    .setURL(response.url)
                            )
                    ]
                })

                interaction.editReply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setDescription(`✅ | As logs do ticket ${interaction.channel} foram enviadas em seu privado!`)
                    ],
                    components: [],
                    ephemeral: true
                })
            }
        } else if (interaction.isButton() && interaction.customId === "painel_staff") {
            if (!interaction.member.roles.cache.get(config.ticket.support_role)) return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_error)
                        .setDescription(`❌ | Você não tem permissão para abrir está função, somente a administração.`)
                ],
                ephemeral: true
            })

            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_invisible)
                        .setDescription(`✅ | Painel staff aberto com sucesso, escolha uma das opções abaixo:`)
                ],
                components: [
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.StringSelectMenuBuilder()
                                .setCustomId('options_staff')
                                .setPlaceholder('Escolha uma opção!')
                                .addOptions(
                                    { label: '💾 Salvar logs', value: `transcript` },
                                    { label: '🗑️ Deletar ticket', value: `delete_ticket` },
                                    { label: '🗑️ notificar usuario', value: `notify_user` },
                                )
                        )
                ],
                ephemeral: true
            })
        } else if (interaction.isStringSelectMenu() && interaction.customId === "options_staff") {
            const ticket = await db.get(`ticket_${interaction.channel.id}`);
            const user = await interaction.guild.members.cache.get(ticket.owner_id)

            const option = interaction.values[0];

            if (option === "notify_user") {
                await user.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setDescription(`⌛ Um staff está aguardando sua resposta no ticket ${interaction.channel}`)
                    ],
                    components: [
                        new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setStyle(5)
                                    .setLabel('Ir para ticket')
                                    .setURL(interaction.channel.url)
                            )
                    ]
                })

                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_success)
                            .setDescription(`✅ | O usuário ${user} foi notificado com sucesso!`)
                    ],
                    components: [],
                    ephemeral: true
                })
            } else if (option === "transcript") {
                await interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setDescription(`<a:carregando_2:1124475451973316798> Salvando logs do ticket ${interaction.channel}, aguarde um pouco...`)
                    ],
                    components: [],
                    ephemeral: true
                })

                let output = interaction.channel.messages.cache.filter(m => m.author.bot !== true).map(m =>
                    `${new Date(m.createdTimestamp).toLocaleString('pt-BR')}-${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                ).reverse().join('\n');

                if (output.length < 1) output = "Nenhuma conversa aqui :)"

                try {
                    response = await sourcebin.create({
                        title: `Histórico do ticket: ${interaction.channel.name}`,
                        description: `Copyright © Skyline Store`,
                        files: [
                            {
                                content: output,
                                language: 'text',
                            },
                        ],
                    });
                } catch (e) {
                    return interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor(config.embeds_color.embed_error)
                                .setDescription(`❌ | Ocorreu um erro ao salvar as logs do ticket ${interaction.channel}, tente novamente!`)
                        ],
                        components: [],
                        ephemeral: true
                    })
                }

                await interaction.user.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setTitle(`📄 Historico de mensagens do ticket`)
                            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                            .addFields(
                                {
                                    name: '🎰 Canal:',
                                    value: `\`\`\`${interaction.channel.name}\`\`\``,
                                    inline: false
                                },
                                {
                                    name: '⌛ Protocolo:',
                                    value: `\`\`\`${interaction.channel.id}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: '📅 Data de emissão',
                                    value: `\`\`\`${moment().utc().tz('America/Sao_Paulo').format('DD/MM/Y - HH:mm:ss')}\`\`\``
                                },
                            )
                    ],
                    components: [
                        new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setStyle(5)
                                    .setEmoji('📄')
                                    .setLabel('Ir para logs')
                                    .setURL(response.url)
                            )
                    ]
                })

                interaction.editReply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setDescription(`✅ | As logs do ticket ${interaction.channel} foram enviadas em seu privado!`)
                    ],
                    components: [],
                    ephemeral: true
                })
            } else if (option === "delete_ticket") {
                await interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setDescription(`<a:carregando_2:1124475451973316798> | Apagando ticket em 5 segundos...`)
                    ],
                    components: [],
                    ephemeral: true
                })

                for (let i = 4; i >= 1; i--) {
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor(config.embeds_color.embed_invisible)
                                .setDescription(`<a:carregando_2:1124475451973316798> | Apagando ticket em ${i} segundos...`)
                        ],
                        components: [],
                        ephemeral: true
                    });
                }

                let output = interaction.channel.messages.cache.filter(m => m.author.bot !== true).map(m =>
                    `${new Date(m.createdTimestamp).toLocaleString('pt-BR')}-${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                ).reverse().join('\n');

                if (output.length < 1) output = "Nenhuma conversa aqui :)"

                try {
                    response = await sourcebin.create({
                        title: `Histórico do ticket: ${interaction.channel.name}`,
                        description: `Copyright © Skyline Store`,
                        files: [
                            {
                                content: output,
                                language: 'text',
                            },
                        ],
                    });
                } catch (e) {
                    return interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor(config.embeds_color.embed_error)
                                .setDescription(`❌ | Ocorreu um erro ao salvar as logs do ticket ${interaction.channel}, tente novamente!`)
                        ],
                        components: [],
                        ephemeral: true
                    })
                }

                await interaction.user.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setDescription(`Seu ticket foi deletado por ${interaction.user}, para mais informações entre em contato com a administração!`),
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setTitle(`📄 Historico de mensagens do ticket`)
                            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                            .addFields(
                                {
                                    name: '🎰 Canal:',
                                    value: `\`\`\`${interaction.channel.name}\`\`\``,
                                    inline: false
                                },
                                {
                                    name: '⌛ Protocolo:',
                                    value: `\`\`\`${interaction.channel.id}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: '📅 Data de emissão',
                                    value: `\`\`\`${moment().utc().tz('America/Sao_Paulo').format('DD/MM/Y - HH:mm:ss')}\`\`\``
                                },
                            )
                    ],
                    components: [
                        new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setStyle(5)
                                    .setEmoji('📄')
                                    .setLabel('Ir para logs')
                                    .setURL(response.url)
                            )
                    ]
                })

                const channel_send = interaction.guild.channels.cache.get(config.ticket.channel_logs)
                await channel_send.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setTitle(`📄 Historico de mensagens do ticket ${interaction.channel.name.replace('closed-', '')}`)
                            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                            .addFields(
                                {
                                    name: '🎰 Canal:',
                                    value: `\`\`\`${interaction.channel.name}\`\`\``,
                                    inline: false
                                },
                                {
                                    name: '⌛ Protocolo:',
                                    value: `\`\`\`${interaction.channel.id}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: '📅 Data de emissão',
                                    value: `\`\`\`${moment().utc().tz('America/Sao_Paulo').format('DD/MM/Y - HH:mm:ss')}\`\`\``
                                },
                            )
                    ],
                    components: [
                        new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setStyle(5)
                                    .setEmoji('📄')
                                    .setLabel('Ir para logs')
                                    .setURL(response.url)
                            )
                    ]
                })
                interaction.channel.delete();
            }
        } else if (interaction.isButton() && interaction.customId === "painel_sale") {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_invisible)
                        .setDescription(`✅ | Painel vendas aberto com sucesso, escolha uma das opções abaixo:`)
                ],
                components: [
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.StringSelectMenuBuilder()
                                .setCustomId('options_sales')
                                .setPlaceholder('Escolha uma opção!')
                                .addOptions(
                                    { label: '⭐ PIX', value: `pix` },
                                    { label: '💾 QRCODE', value: `qrcode` },
                                )
                        )
                ],
                ephemeral: true
            })
        } else if (interaction.isStringSelectMenu() && interaction.customId === "options_sales") {
            const option = interaction.values[0];

            if (option === "pix") {
                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setDescription(`As informações para transferencias estão logo abaixo.`)
                            .addFields(
                                { name: '⭐ Chave pix', value: `\`\`\`${config.sales.pix}\`\`\`` },
                                { name: '🧑 Nome', value: `\`\`\`${config.sales.name}\`\`\`` }
                            )
                    ],
                    components: [],
                    ephemeral: true
                })
            } else if (option === "qrcode") {
                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setDescription(`Abra a camera de seu celular e aponte para o qrcode.`)
                            .addFields(
                                { name: '🧑 Nome', value: `\`\`\`${config.sales.name}\`\`\`` }
                            )
                            .setImage(`${config.sales.qrcode}`)
                    ],
                    components: [],
                    ephemeral: true
                })
            }
        } else if (interaction.isButton() && interaction.customId === "delete_ticket") {
            const ticket = await db.get(`ticket_${interaction.channel.id}`);

            const user = await interaction.guild.members.cache.get(ticket.owner_id)

            if (interaction.user.id !== user.id) return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_error)
                        .setDescription(`❌ | Você não tem permissão para abrir está função, somente o dono do ticket.`)
                ],
                ephemeral: true
            })

            await interaction.update({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_invisible)
                        .setDescription(`<a:carregando_2:1124475451973316798> | Apagando ticket em 5 segundos...`)
                ],
                components: [],
            })

            for (let i = 4; i >= 1; i--) {
                await new Promise(resolve => setTimeout(resolve, 1000));

                interaction.editReply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_invisible)
                            .setDescription(`<a:carregando_2:1124475451973316798> | Apagando ticket em ${i} segundos...`)
                    ],
                    components: [],
                });
            }

            let output = interaction.channel.messages.cache.filter(m => m.author.bot !== true).map(m =>
                `${new Date(m.createdTimestamp).toLocaleString('pt-BR')}-${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
            ).reverse().join('\n');

            if (output.length < 1) output = "Nenhuma conversa aqui :)"

            try {
                response = await sourcebin.create({
                    title: `Histórico do ticket: ${interaction.channel.name}`,
                    description: `Copyright © Skyline Store`,
                    files: [
                        {
                            content: output,
                            language: 'text',
                        },
                    ],
                });
            } catch (e) {
                return interaction.editReply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.embeds_color.embed_error)
                            .setDescription(`❌ | Ocorreu um erro ao salvar as logs do ticket ${interaction.channel}, tente novamente!`)
                    ],
                    components: [],
                    ephemeral: true
                })
            }

            await user.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_invisible)
                        .setDescription(`Seu ticket foi deletado por ${interaction.user}, para mais informações entre em contato com a administração!`),
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_invisible)
                        .setTitle(`📄 Historico de mensagens do ticket`)
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .addFields(
                            {
                                name: '🎰 Canal:',
                                value: `\`\`\`${interaction.channel.name}\`\`\``,
                                inline: false
                            },
                            {
                                name: '⌛ Protocolo:',
                                value: `\`\`\`${interaction.channel.id}\`\`\``,
                                inline: true
                            },
                            {
                                name: '📅 Data de emissão',
                                value: `\`\`\`${moment().utc().tz('America/Sao_Paulo').format('DD/MM/Y - HH:mm:ss')}\`\`\``
                            },
                        )
                ],
                components: [
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setStyle(5)
                                .setEmoji('📄')
                                .setLabel('Ir para logs')
                                .setURL(response.url)
                        )
                ]
            })

            const channel_send = interaction.guild.channels.cache.get(config.ticket.channel_logs)
            await channel_send.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.embeds_color.embed_invisible)
                        .setTitle(`📄 Historico de mensagens do ticket ${interaction.channel.name.replace('closed-', '')}`)
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .addFields(
                            {
                                name: '🎰 Canal:',
                                value: `\`\`\`${interaction.channel.name}\`\`\``,
                                inline: false
                            },
                            {
                                name: '⌛ Protocolo:',
                                value: `\`\`\`${interaction.channel.id}\`\`\``,
                                inline: true
                            },
                            {
                                name: '📅 Data de emissão',
                                value: `\`\`\`${moment().utc().tz('America/Sao_Paulo').format('DD/MM/Y - HH:mm:ss')}\`\`\``
                            },
                        )
                ],
                components: [
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setStyle(5)
                                .setEmoji('📄')
                                .setLabel('Ir para logs')
                                .setURL(response.url)
                        )
                ]
            })

            interaction.channel.delete();
        }
    }
}