const discord = require("discord.js");
const client = new discord.Client()
const { token, prefix, ServerID } = require("./config.json")
client.on("ready", () => {

console.log("Yes le suis la.")



client.user.setActivity("Mes mp | julioju.fr",{type: "WATCHING"})
})

client.on("channelDelete", (channel) => {
    if(channel.parentID == channel.guild.channels.cache.find((x) => x.name == "TICKET").id) {
        const person = channel.guild.members.cache.find((x) => x.id == channel.name)

        if(!person) return;

        let yembed = new discord.MessageEmbed()

        .setAuthor("TICKET DELETED", client.user.displayAvatarURL())
        .setColor('RED')
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription("Votre ticket est supprimé par le modérateur et si vous avez un problème avec cela, vous pouvez ouvrir à nouveau un ticket en envoyant un message ici.")
    return person.send(yembed)
    
    }


})


client.on("message", async message => {
  if(message.author.bot) return;

  let args = message.content.slice(prefix.length).split(' ');
  let command = args.shift().toLowerCase();


  if(message.guild) {
      if(command == "setup") {
          if(!message.member.hasPermission("ADMINISTRATOR")) {
              return message.channel.send("Vous avez besoin des autorisations d'administrateur pour configurer le système modmail!")
          }

          if(!message.guild.me.hasPermission("ADMINISTRATOR")) {
              return message.channel.send("Le bot a besoin des autorisations d'administrateur pour configurer le système modmail!")
          }


          let role = message.guild.roles.cache.find((x) => x.name == "SUPPORT")
          let everyone = message.guild.roles.cache.find((x) => x.name == "@everyone")

          if(!role) {
              role = await message.guild.roles.create({
                  data: {
                      name: "SUPPORT",
                      color: "GREEN"
                  },
                  reason: "Rôle nécessaire pour le système de ticket"
              })
          }

          await message.guild.channels.create("TICKET", {
              type: "category",
              topic: "Tout les tickets seron ici: D",
              permissionOverwrites: [
                  {
                      id: role.id,
                      allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                  }, 
                  {
                      id: everyone.id,
                      deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                  }
              ]
          })


          return message.channel.send("La configuration est terminée: D")

      } else if(command == "close") {


        if(message.channel.parentID == message.guild.channels.cache.find((x) => x.name == "TICKET").id) {
            
            const person = message.guild.members.cache.get(message.channel.name)

            if(!person) {
                return message.channel.send("Je ne parviens pas à fermer le ticket et cette erreur survient car le nom du ticket est probablement modifié.")
            }

            await message.channel.delete()

            let yembed = new discord.MessageEmbed()
            .setAuthor("Close Ticket", client.user.displayAvatarURL())
            .setColor("RED")
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter("ticket fermé par " + message.author.username)
            if(args[0]) yembed.setDescription(args.join(" "))

            return person.send(yembed)

        }
      } else if(command == "open") {
          const category = message.guild.channels.cache.find((x) => x.name == "TICKET")

          if(!category) {
              return message.channel.send("Vous avez besoin du rôle support pour utiliser cette commande ... " + prefix + "setup")
          }

          if(!message.member.roles.cache.find((x) => x.name == "SUPPORT")) {
              return message.channel.send("Vous avez besoin du rôle support pour utiliser cette commande")
          }

          if(isNaN(args[0]) || !args.length) {
              return message.channel.send("Veuillez donner la pièce d'id de la personne")
          }

          const target = message.guild.members.cache.find((x) => x.id === args[0])

          if(!target) {
              return message.channel.send("Impossible de trouver cette personne.")
          }


          const channel = await message.guild.channels.create(target.id, {
              type: "text",
            parent: category.id,
            topic: "Le ticket a été ouvert directement par **" + message.author.username + "** entrer en contact avec " + message.author.tag
          })

          let nembed = new discord.MessageEmbed()
          .setAuthor("DETAILS", target.user.displayAvatarURL({dynamic: true}))
          .setColor("BLUE")
          .setThumbnail(target.user.displayAvatarURL({dynamic: true}))
          .setDescription(message.content)
          .addField("Name", target.user.username)
          .addField("Account Creation Date", target.user.createdAt)
          .addField("Direct Contact", "(yes)");

          channel.send(nembed)

          let uembed = new discord.MessageEmbed()
          .setAuthor("TICKET OPEN")
          .setColor("GREEN")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription("Vous avez été contacté par **" + message.guild.name + "**, Veuillez attendre qu'il vous envoie un autre message!");
          
          
          target.send(uembed);

          let newEmbed = new discord.MessageEmbed()
          .setDescription("A ouvert le Ticket : <#" + channel + ">")
          .setColor("GREEN");

          return message.channel.send(newEmbed);
      } else if(command == "help") {
          let embed = new discord.MessageEmbed()
          .setAuthor('TICKET BOT', client.user.displayAvatarURL())
          .setColor("GREEN")
          
        .setDescription("Ce bot est créé par julioju#1015")
        .addField(prefix + "setup", "Setup le ticket", true)
  
        .addField(prefix + "open", 'Vous permet d\'ouvrir un ticket pour contacter toute personne avec son identifiant', true)
        .setThumbnail(client.user.displayAvatarURL())
                    .addField(prefix + "close", "Fermez le ticket dans lequel vous utilisez cette commande.", true);

                    return message.channel.send(embed)
          
      }
  } 
  
  
  
  
  
  
  
  if(message.channel.parentID) {

    const category = message.guild.channels.cache.find((x) => x.name == "TICKET")
    
    if(message.channel.parentID == category.id) {
        let member = message.guild.members.cache.get(message.channel.name)
    
        if(!member) return message.channel.send('Impossible d\'envoyer le message')
    
        let lembed = new discord.MessageEmbed()
        .setColor("GREEN")
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setDescription(message.content)
    
        return member.send(lembed)
    }
    
    
      } 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  if(!message.guild) {
      const guild = await client.guilds.cache.get(ServerID) || await client.guilds.fetch(ServerID).catch(m => {})
      if(!guild) return;
      const category = guild.channels.cache.find((x) => x.name == "TICKET")
      if(!category) return;
      const main = guild.channels.cache.find((x) => x.name == message.author.id)


      if(!main) {
          let mx = await guild.channels.create(message.author.id, {
              type: "text",
              parent: category.id,
              topic: "Ce ticket est créé pour aider  **" + message.author.tag + " **"
          })

          let sembed = new discord.MessageEmbed()
          .setAuthor("MAIN OPENED")
          .setColor("GREEN")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription("Le ticket est maintenant lancée, vous serez bientôt contacté par le support")

          message.author.send(sembed)


          let eembed = new discord.MessageEmbed()
          .setAuthor("DETAILS", message.author.displayAvatarURL({dynamic: true}))
          .setColor("BLUE")
          .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
          .setDescription(message.content)
          .addField("Name", message.author.username)
          .addField("Account Creation Date", message.author.createdAt)
          .addField("Direct Contact", "(non)")


        return mx.send(eembed)
      }

      let xembed = new discord.MessageEmbed()
      .setColor("YELLOW")
      .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
      .setDescription(message.content)


      main.send(xembed)

  } 
  
  
  
 
})


client.login(token)
