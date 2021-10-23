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

    let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(vectra => vectra.entries.first());
    if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !Settings.Guards.ChannelGuard) return;
    kuralsiz(entry.executor.id, "BAN");
    await channel.clone({ reason: "Vectra Guard System" }).then(async kanal => {
        if (channel.parentID != null) await kanal.setParent(channel.parentID);
        await kanal.setPosition(channel.position);
        if (channel.type == "category") await channel.guild.channels.cache.filter(k => k.parentID == channel.id).forEach(x => x.setParent(kanal.id));
      });
      let kanal = client.channels.cache.get(Settings.LogKanal);
      if(kanal) return kanal.send(new MessageEmbed().setTitle("Bir Kanal Silindi!").setDescription(`${entry.executor}, bir kanal silmeye çalıştı fakat ben izin vermedim! Kanalı silmeye çalışna kişi banlandı.`))

}