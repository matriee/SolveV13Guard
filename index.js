const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const client = global.client = new Client({	allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
 
});
const set = require("./settings.json");
const Settings = require('./Configration.json');
const fs = require('fs')

client.login(set.token).catch(err => {console.error("The token is incorrect or you forgot to enter the token!")});

client.commands = new Collection();
const { readdirSync } = require("fs");   
const { join } = require("path");

const commandFiles = readdirSync(join(__dirname, "Commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(join(__dirname, "Commands", `${file}`));
    client.commands.set(command.code, command)
    console.log('[ '+command.code+' ] adlı komut başarıyla çalışıyor.');
}

readdirSync("./Events").filter(file => file.endsWith(".js")).forEach(file => {
    let event = require(`./Events/${file}`);
    client.on(event.conf.event, event.execute);
    console.log(` { ${file.replace(".js", "") } } adlı event başarıyla çalışıyor.`);
});

client.once("ready", async() => {
  console.log("Bot Başarıyla giriş yaptı!")
});


client.on("messageCreate", async (message) => {
if(message.author.bot) return;
  if(message.content.startsWith(set.prefix)) {
    const args = message.content.slice(set.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();


    var cmd = client.commands.get(command) || client.commands.array().find((x) => x.aliases && x.aliases.includes(command));    
    if(!cmd) return message.channel.send(`Komut dosyamda **${command}** adlı bir komut bulamadım.`);
    try { cmd.run(client, message, args, set); } catch (error){ console.error(error); }
  }

  if(cmd == "güvenli" || "g"){
    let son;
    let role = message.mentions.roles.first()
    let kisi = message.mentions.members.first();
    if(role) son = role;
    if(kisi) son = kisi;
    let safes = Settings.whitelist || [];
    if (!son) return message.channel.send(new MessageEmbed().setTitle("Hoba!").setDescription("Bir kişi/rol etiketlemen gerek Örnek: .g @(kisi/rol)").addField("Güvenli Liste", safes.length > 0 ? safes.map(g => (message.guild.roles.cache.has(g.slice(1)) || message.guild.members.cache.has(g.slice(1))) ? (message.guild.roles.cache.get(g.slice(1)) || message.guild.members.cache.get(g.slice(1))) : g).join('\n') : "Bulunamadı!"))
    if (safes.some(s => s.includes(son.id))) {
      safes = safes.filter(s => !s.includes(son.id));
      Settings.whitelist = safes;
      fs.writeFile("./Configration.json", JSON.stringify(Settings), (err) => {
        if (err) console.log(err);
      });
      message.channel.send(new MessageEmbed().setTitle("İşte bu kadar!").setDescription(`${son}, ${message.author} tarafından güvenli listeye eklendi!`));
    }
  }

});
  


