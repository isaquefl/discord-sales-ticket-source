const { General, Carrinhos } = require("../../Database/index");

module.exports = {
    name: "guildMemberAdd",
    run: async (member, client) => {


        const TrafegoLogs = await General.get(`Config.logs.trafego`);
        const ChannelLog = await client.channels.cache.get(TrafegoLogs);

        const roleauto = await General.get(`Config.Roles.member`)

        if (roleauto !== '') {
            if (!member.roles.cache.has(roleauto)) {
                try {
                    await member.roles.add(roleauto);
                } catch (error) {
                    console.error('Erro ao atribuir cargo automatico' + error);
                }
            }
        }

        if (ChannelLog) {
            try {
                ChannelLog.send({ content: `**Entrada**\nO usuário ${member} entrou no servidor!.` });
            } catch (error) {
                console.error('Erro log Saidas:', error);
            }
        }

    }
};