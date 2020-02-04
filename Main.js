const FuncData = require('./FuncData.js')
const FuncGoogleSHEET = require('./FuncGoogleSHEET.js')
const FuncRaid = require('./FuncRaid.js');
const Const = require('./Constant.js');
const moment = require('moment-timezone');
const CronJob = require('cron').CronJob;
const Bot = Const.Bot

const http = require('http');
const express = require('express');
const app = express();

var BotChan
var BotChanBienvenue
var ODT
var BotChanAfk
var BotChanAbsence
var BotSave
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(8080);
setInterval(() => {
http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 300000);

Bot.on('ready', function () {
BotChan = Bot.channels.get("559066985405743144") // Ordre des templiers : 559066985405743144
BotSave = Bot.channels.get("600102059378868224")
BotChanBienvenue = Bot.channels.get("505373486974369794") // Ordre des templiers : 505373486974369794
BotChanAbsence = Bot.channels.get("525063141852315651") // Ordre des templiers : 525063141852315651
ODT = Bot.guilds.get('505373486974369792')
TaskHandle(BotChan)
});

Bot.on('messageReactionAdd', async (reaction, user) => {
        /*if (reaction.emoji.name === ":regional_indicator_o: " ) {}
            // ici tu ajoute ce que ton bot doit faire quand il y a la bonne réaction*/
  console.log(reaction)
  
});
        
Bot.on('message', async message => {
  
var MC = message.content.toLowerCase()
var AuthorID = message.author.id

FuncData.PlayerCreateOrUpdate(message)
  
  if(message.channel.id=="505391449374720000"||message.channel.id=="564119810212888587"||message.channel.id=="526492817972002817"||message.channel.id=="524308876775129098"){
    let Boolean = false
    message.attachments.forEach(function(CurrentAttachment){if(CurrentAttachment.filename.length>0){Boolean=true}})
    if(MC.substring(0,4)=="http"){Boolean=true}
    
    if(Boolean==false){message.delete()}
  }
  //console.log(message.attachments.file)
//console.log(message.attachments)
  if(MC.startsWith("/do")){
    /*ODT.members.forEach(await function(CurrentMember){
      let MemberDisplayName = CurrentMember.displayName
      let temp = db.get("Users").find({DiscordID: CurrentMember.id}).value()
      db.get("Users").find({DiscordID : CurrentMember.id}).assign({DiscordID : temp.DiscordID, DisplayName: temp.DisplayName, GameCharacter: temp.GameCharacter, DiscordRole : temp.DiscordRole, NextRaid : temp.NextRaid, TotalRaid : temp.TotalRaid,  Assiduity : temp.Assiduity, DisplayNameClean : temp.DisplayNameClean, Absence : temp.Absence, TrustIndicator : temp.TrustIndicator, House : temp.House, MNDR : temp.MNDR, Lvl : temp.Lvl,BooleanWeaponSiege:"Non"}).write()
      FuncData.PlayerUpdateId(CurrentMember.id)
    })*/}
  
  if(MC.startsWith("/getsave")){  
    if(Const.BooleanAdmin(AuthorID)==true){
      let CurrentDate = new Date(Date.now() + (moment().tz("Europe/Paris").utcOffset()*60*1000));
      BotSave.send(CurrentDate, {files: ["./db.json"]})
      BotChan.send("<@"+AuthorID+"> Succès !")
    } else{Const.MessageInsufficientAuthority(AuthorID,BotChan)}
  }
  
  if(MC.startsWith("/lvl")){
    if(MC.substring(4,MC.length)>0){
      var temp = db.get('Users').find({ DiscordID: AuthorID }).value()
      temp.Lvl = MC.substring(4,MC.length)
      BotChan.send("<@"+AuthorID+"> votre level a été mit à jour ! Votre lvl est maintenant de : **"+MC.substring(4,MC.length)+"**")
      
     FuncGoogleSHEET.AuthCALL(FuncGoogleSHEET.UpdateNextRaid)
    } else {BotChan.send("<@"+AuthorID+"> le format du lvl indiqué est incorrect")}
  }
  if(MC.startsWith('/houses')){
    if(MC.includes("update")){
      if(Const.BooleanAdmin(AuthorID)==true){
        
        let Guild = Const.Bot.guilds.get(Const.ServerID)
        let ODTI = Guild.roles.find('name','ODTI')
        let ODTII = Guild.roles.find('name','ODTII')
        let ODTIII = Guild.roles.find('name','ODTIII')
        let EnCoursDattribution = Guild.roles.find('name','Attribution de maison en cours')
        
        await Guild.members.forEach(setTimeout(async function(CurrentMember){

          /*if(CurrentMember.highestRole.name!="Novice"&&CurrentMember.highestRole.name!="Ambassadeur"&&CurrentMember.highestRole.name!="Alliés"&&CurrentMember.highestRole.name!="Convive de l'Ordre"){
            //Guild.members.get(CurrentMember.user.id).removeRole(EnCoursDattribution)
            let CurrentMemberHouse = await CurrentMember.displayName.substring(CurrentMember.displayName.lastIndexOf('[')+4,CurrentMember.displayName.length-1)
            if(CurrentMemberHouse==1){await Guild.members.get(CurrentMember.user.id).addRole(ODTI)}
            if(CurrentMemberHouse==2){await Guild.members.get(CurrentMember.user.id).addRole(ODTII)}
            if(CurrentMemberHouse==3){await Guild.members.get(CurrentMember.user.id).addRole(ODTIII)}
            if(CurrentMemberHouse!=1&&CurrentMemberHouse!=2&&CurrentMemberHouse!=3){await Guild.members.get(CurrentMember.user.id).addRole(EnCoursDattribution)}
          }
        }),3000 )*/
          if(CurrentMember.highestRole.name=="Novice"||CurrentMember.highestRole.name=="Ambassadeur"||CurrentMember.highestRole.name=="Alliés"||CurrentMember.highestRole.name=="Convive de l'Ordre"){
            Guild.members.get(CurrentMember.user.id).removeRole(EnCoursDattribution)
          }
        },3000))
      }else{Const.MessageInsufficientAuthority(AuthorID,BotChan)}
    }
  }
  if(MC.startsWith('/raid')){
    if(MC.includes("reset")){
      if(Const.BooleanAdmin(AuthorID)==true){
       FuncRaid.Reset(AuthorID,BotChan)
      } else{Const.MessageInsufficientAuthority(AuthorID,BotChan)}
    }
  
  }
  if(MC.startsWith('/data')){
    FuncData.EmbedData(BotChan,message)
  }
  if(MC.startsWith('/present')||MC.startsWith('/présent')){
    
    let B = db.get('Users').find({ DiscordID: AuthorID }).value()
    
      if(MC.includes('-')){
        B.BooleanWeaponSiege="Non";Const.MessageWeaponSiegeDeleteYes(AuthorID,BotChan)
        FuncGoogleSHEET.AuthCALL(FuncGoogleSHEET.UpdateNextRaid)
        if(FuncRaid.BooleanPlayerCanRaid(AuthorID)==true){FuncRaid.Present(AuthorID)
          FuncRaid.ListNextRaid(AuthorID)
          FuncGoogleSHEET.AuthCALL(FuncGoogleSHEET.UpdateNextRaid)
      }
      }else if(MC.includes('+')){
        B.BooleanWeaponSiege="Oui";Const.MessageWeaponSiegeYes(AuthorID,BotChan)
        FuncGoogleSHEET.AuthCALL(FuncGoogleSHEET.UpdateNextRaid)
        if(FuncRaid.BooleanPlayerCanRaid(AuthorID)==true){FuncRaid.Present(AuthorID)
          FuncRaid.ListNextRaid(AuthorID)
          FuncGoogleSHEET.AuthCALL(FuncGoogleSHEET.UpdateNextRaid)
      }
      }else if(FuncRaid.BooleanPlayerCanRaid(AuthorID)==true){FuncRaid.Present(AuthorID)
        FuncRaid.ListNextRaid(AuthorID)
       FuncGoogleSHEET.AuthCALL(FuncGoogleSHEET.UpdateNextRaid)
         Const.MessageRaidPresent(AuthorID,BotChan)
      }else{
        FuncGoogleSHEET.AuthCALL(FuncGoogleSHEET.UpdateNextRaid);Const.MessageAlreadyInRaid(AuthorID,BotChan)
      }

    }
   
  if(MC.startsWith('/absent')){
     FuncRaid.Absent(AuthorID)
     FuncGoogleSHEET.AuthCALL(FuncGoogleSHEET.UpdateAbsenceNextRaid)
     Const.MessageRaidAbsent(AuthorID,BotChan)
   }
  
  if(message.channel==BotChanAbsence){
    let temp = db.get("Users").find({DiscordID : message.author.id}).value()
    temp.Absence = "Oui"
    
  }
  if(MC.startsWith('/stat')){
      if(Const.BooleanAdmin(AuthorID)==true){
        Const.MessageStat(AuthorID,BotChan)
      }else{Const.MessageInsufficientAuthority(AuthorID,BotChan)}
  }
  
  FuncGoogleSHEET.AuthCALL(FuncGoogleSHEET.Stat)
});

Bot.on("guildMemberUpdate", function(oldMember, newMember){
    
  FuncData.PlayerUpdate(newMember)
  FuncGoogleSHEET.AuthCALL(FuncGoogleSHEET.UpdateNextRaid)
  
  let Oldusername = oldMember.displayName
  let Newusername = newMember.displayName
  let OldHouse = Oldusername.substring(Oldusername.lastIndexOf("[")+4,Oldusername.length-1)
  let NewHouse = Newusername.substring(Newusername.lastIndexOf("[")+4,Newusername.length-1)
  
  if(Oldusername.substring(0,Oldusername.length-6)!=Newusername.substring(0,Newusername.length-6)){
    BotChanBienvenue.send("**"+Oldusername+"** a changé son pseudo en **"+Newusername+"** : <@"+newMember.user.id+">") 
  }
  

  if(OldHouse!=NewHouse){
    console.log(oldMember.highestRole.name)
    if(newMember.highestRole.name!="Ambassadeur"&&newMember.highestRole.name!="Alliés"&&newMember.highestRole.name!="Convive de l'Ordre"){
      
      let Guild = Const.Bot.guilds.get(Const.ServerID)
      let ODTI = Guild.roles.find('name','ODTI')
      let ODTII = Guild.roles.find('name','ODTII')
      let ODTIII = Guild.roles.find('name','ODTIII')
      let EnCoursDattribution = Guild.roles.find('name','Attribution de maison en cours')
      
      console.log(OldHouse)
      console.log(NewHouse)
      
      if(OldHouse==1){Guild.members.get(newMember.user.id).removeRole(ODTI)}
      if(OldHouse==2){Guild.members.get(newMember.user.id).removeRole(ODTII)}
      if(OldHouse==3){Guild.members.get(newMember.user.id).removeRole(ODTIII)}
      if(OldHouse!=1&&OldHouse!=2&&OldHouse!=3){Guild.members.get(newMember.user.id).removeRole(EnCoursDattribution)}
      if(NewHouse==1){Guild.members.get(newMember.user.id).addRole(ODTI)}
      if(NewHouse==2){Guild.members.get(newMember.user.id).addRole(ODTII)}
      if(NewHouse==3){Guild.members.get(newMember.user.id).addRole(ODTIII)}
      if(NewHouse!=1&&NewHouse!=2&&NewHouse!=3){Guild.members.get(newMember.user.id).addRole(EnCoursDattribution)}
      
    }
  }
});



const db = Const.db

function TaskHandle(BotChan){
  
  let CurrentDate = new Date(Date.now() + (moment().tz("Europe/Paris").utcOffset()*60*1000));
  

  new CronJob('0 */1 20 * * 6,2', function() {
    ODT.channels.forEach(function(CurrentChan) {
          if(CurrentChan.type=='voice'){
            if(CurrentChan.id!='505380984842354698'){
              CurrentChan.members.forEach(function(CurrentMember){
                let temp = db.get("Users").find({DiscordID : CurrentMember.user.id}).value()
                temp.MNDR+=1
                db.get("Users").find({DiscordID : CurrentMember.user.id}).assign(temp).write()
              })
            }
          }
        }) 
  }, null, true, 'Europe/Paris');
  
  new CronJob('0 0 21 * * 6,2', function() {
    
          FuncGoogleSHEET.AuthCALL(FuncGoogleSHEET.TimeReset)
        
          var AllValue = db.get('Users').value()
          
          for(var CurrentPlayer = 0;CurrentPlayer<AllValue.length;CurrentPlayer++){
            AllValue[CurrentPlayer].BooleanWeaponSiege="Non"
            if(AllValue[CurrentPlayer].MNDR>=35){
              AllValue[CurrentPlayer].TrustIndicator+=1
              AllValue[CurrentPlayer].MNDR=0
            } else if(AllValue[CurrentPlayer].MNDR!=0){
              AllValue[CurrentPlayer].MNDR=0
            }
            if(AllValue[CurrentPlayer].NextRaid=="0"){
              AllValue[CurrentPlayer].TotalRaid+=1
            } else if(AllValue[CurrentPlayer].NextRaid=="1"){
              AllValue[CurrentPlayer].TotalRaid+=1
              AllValue[CurrentPlayer].Assiduity+=1
              AllValue[CurrentPlayer].NextRaid="0"
            }
          }

          
          db.set('ListNextRaid', []).write()
          db.get('Users').assign(AllValue).write()
          Const.MessageEndRaid(BotChan)
  }, null, true, 'Europe/Paris');
  
  
  new CronJob('0 0 22,12 * * *', function() {
      BotSave.send(CurrentDate, {files: ["./db.json"]})
  }, null, true, 'Europe/Paris');
}
  




Bot.on("voiceStateUpdate", function(oldMember, newMember){
  FuncData.PlayerCreateJoinChannel(oldMember.user.id)
});

Bot.login(process.env.TOKEN);