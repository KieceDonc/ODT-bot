const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

const Discord = require('discord.js');
const bot = new Discord.Client();

const Const = require('./Constant.js');


module.exports = {
    
  ServerID : '505373486974369792', //Ordre des templiers : 505373486974369792
  
  Discord : Discord,
  
  Bot : bot,
  
  Admin : ["234251360831275008","302529594685128707"],     // Sguiz || Kièce?
  
  BooleanAdmin : function (DiscordPlayerID){
  
    let ListAdmin = ["234251360831275008","302529594685128707"]
    let Admin = false 

      for(var CurrentAdmin = 0; CurrentAdmin<ListAdmin.length; CurrentAdmin++){
        if(ListAdmin[CurrentAdmin]==DiscordPlayerID){
          Admin = true 
        }
      }

      return Admin
    },
  
  MessageInsufficientAuthority : function (AuthorID,BotChan){
    BotChan.send("<@" + AuthorID + "> Vous n'avez pas l'autorité nécessaire ! ")
  },
  
  MessageResetDataRaid : function(AuthorID,BotChan){
    BotChan.send("<@" + AuthorID + "> Reset des données à propos des raids terminé ! ")},
  
  MessageRaidPresent : function(AuthorID,BotChan){
    BotChan.send("<@" + AuthorID + "> noté **présent** pour le prochain raid !")
  },
  
  MessageStat : function(AuthorID,BotChan){
    BotChan.send("<@" + AuthorID + "> statistiques mises à jour !")
  },
  
  MessageRaidAbsent : function(AuthorID,BotChan){
    BotChan.send("<@" + AuthorID + "> noté **absent** pour le prochain raid !")
  },
  
  MessageAlreadyInRaid : function(AuthorID,BotChan){
    BotChan.send("<@" + AuthorID + "> vous êtes déjà noté présent pour le prochain raid !")
  },
  
  MessageEndRaid : function(BotChan){
    BotChan.send("<@234251360831275008> <@302529594685128707> Reset du raid terminé ! Les membres peuvent s'indiquer présent pour le prochain raid avec /present")
  },
  MessageWeaponSiegeYes : function(AuthorID,BotChan){
    BotChan.send("<@" + AuthorID + "> vous vous êtes mis présent avec de/des arme/s de siège !")
  },
  MessageWeaponSiegeDeleteYes : function(AuthorID,BotChan){
    BotChan.send("<@" + AuthorID + "> vous vous êtes mis présent sans arme/s de siège !")
  },
  MessageEndCommand : function(AuthorID,BotChan){
    BotChan.send("Fin!")
  },
  
  db : db,
  
  GspreadsheetID : '1HE_jR-YcStg_Oq111IP9N3TJhy5TE-FtbDXq1mGszFE',
  
  toColumnName : function (num) {
    for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
      ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
    }
    return ret;
  },
  
  DiscordUnauthorizedRole : ["Ambassadeur","Alliés","Bot","Novice","508230130800394261"], // 1. Ambassadeur, 2. Alliés, 3. Bot, 4. En cours de recrutement, 5. Convive de l'ordre
  
}