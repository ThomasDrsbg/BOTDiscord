const Discord = require('discord.js'),
    client = new Discord.Client(),
    config = require('./config.json'),
    fs = require('fs')

client.login(config.token)
client.commandes = new Discord.Collection()

fs.readdir('./commandes', (err, files) => {
    if (err) {
        throw err
    }
    files.forEach(file => {
        if (!file.endsWith('.js')) {
            return
        }
        const commande = require(`./commandes/${file}`)
        client.commandes.set(commande.name, commande)
    })
})

client.on('message', message => {
    if(message.type !== 'DEFAULT' || message.author.bot) return

    const args = message.content.trim().split(/ +/g)
    const nomCommande = args.shift().toLowerCase()
    if (!nomCommande.startsWith(config.prefix)) {
        return
    }
    const commande = client.commandes.get(nomCommande.slice(config.prefix.length))
    if (!commande) {
        return
    }
    commande.run(message, args, client)
})

client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(${member} a rejoint le serveur. Nous sommes désormais ${member.guild.memberCount} ! 🎉)
    member.roles.add(config.greeting.role)
})
 
client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(${member.user.tag} a quitté le serveur... 😢)
})