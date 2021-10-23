const { MessageEmbed } = require("discord.js");
const client = global.client;
const Settings = require("../Configration.json")


exports.execute = async (member) => {

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

    let giris = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(vectra => vectra.entries.first());
    if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 ||  guvenli(entry.executor.id) || !Settings.Guards.KickGuard ) return;
    let kanal = client.channels.cache.get(Settings.LogKanal);
    kuralsiz(member, "JAİL");
    if(kanal) return kanal.send( new MessageEmbed().setTitle("Sağ Tık Kick Atıldı!").setDescription(`${member} - ${member.id},  ${entry.executor} **(${entry.executor.id})** tarafından sunucudan sağ tık ile kicklendi! Kickleyen kişi jaile atıldı.`).setFooter("Vectra Koruma"))
}


exports.conf = {
  event: "guildMemberRemove"
};
