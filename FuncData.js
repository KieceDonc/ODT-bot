const Const = require('./Constant.js')
const FuncData = require('./FuncData.js')
const Discord = require('discord.js');
const db = Const.db
const Bot = Const.Bot

module.exports = {
  
  PlayerCreateOrUpdate : async function(message){
    let ID = message.author.id
    AboutPlayer(ID)
  },
  
  PlayerCreateJoinChannel : async function(ID){
    AboutPlayer(ID)
  },
  
  PlayerUpdate : function(Guild){
    let ID = Guild.user.id
    AboutPlayer(ID)
  },
  
  PlayerUpdateId : function(Id){AboutPlayer(Id)},
  
  EmbedData : function(BotChan,message){
    
    let CurrentPlayer = db.get("Users").find({DiscordID : message.author.id}).value()
    let PPLPR = "Aucune donnée"
    let PP = Math.round(CurrentPlayer.Assiduity/CurrentPlayer.TotalRaid*100)
    let IC = Math.round(CurrentPlayer.TrustIndicator/CurrentPlayer.Assiduity*100)
    
    if(CurrentPlayer.NextRaid=="1"){PPLPR="Présent"}else if(CurrentPlayer.NextRaid=="0")(PPLPR="Absent")
    
   /* const embed = new Discord.RichEmbed()
          .setTitle("**__"+CurrentPlayer.DisplayNameClean+"__**")
          .setColor(0,0,0)
          .setFooter("Ordre des Templiers","http://www.rw-designer.com/icon-image/10850-256x256x32.png")
          .setThumbnail(Bot.users.get(message.author.id).avatarURL)
          .addField("Rôle discord :",CurrentPlayer.DiscordRole)
          .addField("Classe :",CurrentPlayer.GameCharacter,true)
          .addField("Pourcentage de présence","En cours de test")
          .addField("Pourcentage de confiance","En cours de test")
          .addField("Nombre total de raid : ",CurrentPlayer.TotalRaid,true)
          .addField("Présence pour le prochain raid",PPLPR)
          .addField("Numéro de maison :",CurrentPlayer.House,true)*/
    const embed = {
        "title": "**__"+CurrentPlayer.DisplayNameClean+"__**",
        "color": 13373715,
        "footer": {
          "icon_url": "http://www.rw-designer.com/icon-image/10850-256x256x32.png",
          "text": "Ordre des Templiers"
        },
        "thumbnail": {
          "url": Bot.users.get(message.author.id).avatarURL
        },
        "fields": [
          {
            "name": "Rôle discord :",
            "value": CurrentPlayer.DiscordRole
          },
          {
            "name": "Classe :",
            "value": CurrentPlayer.GameCharacter,
            "inline": true
          },
          {
            "name": "Pourcentage de présence :",
            "value": PP+" %"
          },
          {
            "name": "Pourcentage de confiance",
            "value": IC+" %"
          },
          {
            "name": "Nombre total de raid :",
            "value": CurrentPlayer.TotalRaid,
            "inline": true
          },
          {
            "name": "Présence pour le prochain raid :",
            "value": PPLPR
          },
          {
            "name": "Arme(s) de siège pour le prochain raid:",
            "value": ""+CurrentPlayer.BooleanWeaponSiege
          },
          {
            "name": "Numéro de maison :",
            "value": CurrentPlayer.House,
            "inline": true
          },
          {
            "name": "Level :",
            "value": ""+CurrentPlayer.Lvl
          }
        ]
      };
    BotChan.send({embed})
  }
}


function AboutPlayer(MemberID){
    
    let Guild = Const.Bot.guilds.get(Const.ServerID)
    let MemberDiscordRole = Guild.members.get(MemberID).highestRole.name
    
    let BooleanPlayerCanBeAdd = true
    
    Const.DiscordUnauthorizedRole.forEach(function(CurrentDiscordUnauthorizedRole) {
      if(MemberDiscordRole==CurrentDiscordUnauthorizedRole){
        BooleanPlayerCanBeAdd = false
      }  
    }) 
  
    if(BooleanPlayerCanBeAdd=true){
      let MemberDisplayName = Guild.members.get(MemberID).displayName
      let MemberAcronym = MemberDisplayName.substring(MemberDisplayName.lastIndexOf('[')+1,MemberDisplayName.lastIndexOf('[')+4).toLowerCase()
      let MemberHouse = MemberDisplayName.substring(MemberDisplayName.length-2,MemberDisplayName.length-1)
      let MemberGameCharacter = "Erreur"
      let Acronyms = db.get("Acronym").value()
      let GameCharacter = db.get("GameCharacter").value()

      if(MemberDiscordRole=="@everyone"){
        MemberDiscordRole="Erreur"
      }

      for(let x = 0; x<Acronyms.length;x++){
        if(Acronyms[x]==MemberAcronym){
          MemberGameCharacter = GameCharacter[x]
        }
      }

    if(!(MemberHouse=="1"||MemberHouse=="2"||MemberHouse=="3"||MemberHouse=="4"||MemberHouse=="5"||MemberHouse=="6"||MemberHouse=="7"||MemberHouse=="8"||MemberHouse=="9")){
      MemberHouse = "Erreur"
    } else {MemberHouse = parseInt(MemberHouse);}

      if(db.get("Users").find({DiscordID : MemberID}).value()){

        let NextRaid = db.get("Users").find({DiscordID : MemberID}).value().NextRaid
        let TotalRaid = db.get("Users").find({DiscordID : MemberID}).value().TotalRaid
        let Assiduity = db.get("Users").find({DiscordID : MemberID}).value().Assiduity
        let PlayerAbsence = db.get("Users").find({DiscordID : MemberID}).value().Absence
        let PlayerTrustIndicator = db.get("Users").find({DiscordID : MemberID}).value().TrustIndicator
        let MNDR =  db.get("Users").find({DiscordID : MemberID}).value().MNDR
        let Lvl = db.get("Users").find({DiscordID : MemberID}).value().Lvl

        db.get("Users").find({DiscordID : MemberID}).assign({DiscordID : MemberID, DisplayName: MemberDisplayName, GameCharacter: MemberGameCharacter, DiscordRole : MemberDiscordRole, NextRaid : NextRaid, TotalRaid : TotalRaid,  Assiduity : Assiduity, DisplayNameClean : MemberDisplayName.substring(0,MemberDisplayName.length-6), Absence : PlayerAbsence, TrustIndicator : PlayerTrustIndicator, House : MemberHouse, MNDR : MNDR, Lvl : Lvl})
                    .write()
      } else {
        db.get("Users").push({DiscordID : MemberID, DisplayName: MemberDisplayName, GameCharacter: MemberGameCharacter, DiscordRole : MemberDiscordRole, NextRaid : 0 , TotalRaid : 0,  Assiduity :0, DisplayNameClean : MemberDisplayName.substring(0,MemberDisplayName.length-6), Absence : "Non", TrustIndicator : 0, House : MemberHouse, MNDR : 0, Lvl :0 })
                    .write()
      }
    }
  }