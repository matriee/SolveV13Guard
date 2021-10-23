const { MessageEmbed } = require("discord.js");
const client = global.client;
const Settings = require("../Configration.json")


exports.execute = async (oldGuild, newGuild) => {

    let entry = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(vectra => vectra.entries.first());

    function guvenli(birisi) {
        let uye = client.guilds.cache.get(Settings.GuildId).members.cache.get(birisi);
        let guvenliler = Settings.whitelist || [];
        if (!uye || uye.id === client.user.id || uye.id === Settings.Author || uye.id === uye.guild.ownerId || guvenliler.some(g => uye.id === g.slice(1) || uye.roles.cache.has(g.slice(1)))) return true
    }

    function kuralsiz(birisi, ceza) {
        let uye = client.guilds.cache.get(Settings.GuildId).members.cache.get(birisi);
        if(!uye) return;
        if( ceza == "JAİL") return uye.roles.set(Settings.JailRole);
        if(ceza == "BAN") return uye.ban({reason: "Vectra Guard System"})
    }

    if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !Settings.Guards.ServerGuard) return;
    kuralsiz(entry.executor.id, "BAN");
    if (newGuild.name !== oldGuild.name) newGuild.setName(oldGuild.name);
    if (newGuild.iconURL({dynamic: true, size: 2048}) !== oldGuild.iconURL({dynamic: true, size: 2048})) newGuild.setIcon(oldGuild.iconURL({dynamic: true, size: 2048}));
    let kanal = client.channels.cache.get(Settings.LogKanal);
    if(kanal) return kanal.send(new MessageEmbed().setTitle("Sunucu Güncellendi!").setDescription(`${entry.executor}, sunucuyu güncellemeye çalıştı fakat ben durdurdum ve eski haline getirdim. Güncelleyen kişi banlandı.`))



}