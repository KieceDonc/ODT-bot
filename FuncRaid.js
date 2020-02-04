const Const = require('./Constant.js')
const FuncRaid = require('./FuncRaid')
const db = Const.db

module.exports = {
    
  Reset : function(AuthorID,BotChan){          
    let AllValue = db.get('Users').value()
          for(let CurrentPlayer = 0;CurrentPlayer<AllValue.length;CurrentPlayer++){

              AllValue[CurrentPlayer].NextRaid="Aucune donnée"
              AllValue[CurrentPlayer].TotalRaid=0
              AllValue[CurrentPlayer].Assiduity=0
              AllValue[CurrentPlayer].TrustIndicator=0
              AllValue[CurrentPlayer].Absence="Non"
          }
          db.get('Users').assign(AllValue).write()
    
    Const.MessageResetDataRaid(AuthorID,BotChan)
  },   
  
  Present : function(AuthorID){
      var temp = db.get('Users').find({ DiscordID: AuthorID }).value()
      temp.NextRaid="1"
  },
  
  Absent : function(AuthorID){
      var temp = db.get('Users').find({ DiscordID: AuthorID }).value()
      temp.NextRaid ="0"
  },
  
  ListNextRaid : function(AuthorID){
    let PlayerNextRaid = db.get('ListNextRaid').value()
    let PushOk = true
    
    for(let x = 0; x<PlayerNextRaid.length;x++){
      if(PlayerNextRaid[x]==AuthorID){
        PushOk = false
      }
    }
      
    if(PushOk==true){
      db.get("ListNextRaid").push(AuthorID).write()
    }
  },
  
  BooleanPlayerCanRaid : function(AuthorID){
    let PlayerNextRaid = db.get('ListNextRaid').value()
    let BooleanToReturn = true
  
    for(let x = 0; x<PlayerNextRaid.length;x++){
      if(PlayerNextRaid[x]==AuthorID){
        let CurrentPlayer = db.get("Users").find({DiscordID : PlayerNextRaid[x]}).value()
        if(CurrentPlayer.NextRaid=="1"){
          BooleanToReturn = false        
        } 
      }
    }
    
    return BooleanToReturn
  }

}