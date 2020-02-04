const {google} = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

const Const = require('./Constant.js');
const FuncGoogleSHEET = require('./FuncGoogleSHEET')
const db = Const.db

module.exports = {

  AuthCALL : function SheetAPI(FunctionToCall){
              fs.readFile('credentials.json', (err, content) => {
                if (err) return console.log('Error loading client secret file:', err);
                authorize(JSON.parse(content), FunctionToCall);
              });
              function authorize(credentials, callback) {
                const {client_secret, client_id, redirect_uris} = credentials.installed;
                const oAuth2Client = new google.auth.OAuth2(
                    client_id, client_secret, redirect_uris[0]);
                fs.readFile(TOKEN_PATH, (err, token) => {
                  if (err) return getNewToken(oAuth2Client, callback);
                  oAuth2Client.setCredentials(JSON.parse(token));
                  callback(oAuth2Client);
                });
              }
              function getNewToken(oAuth2Client, callback) {
                const authUrl = oAuth2Client.generateAuthUrl({
                  access_type: 'offline',
                  scope: SCOPES,
                });
                console.log('Authorize this app by visiting this url:', authUrl);
                const rl = readline.createInterface({
                  input: process.stdin,
                  output: process.stdout,
                });
                rl.question('Enter the code from that page here: ', (code) => {
                  rl.close();
                  oAuth2Client.getToken(code, (err, token) => {
                    if (err) return console.error('Error while trying to retrieve access token', err);
                    oAuth2Client.setCredentials(token);
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                      if (err) return console.error(err);
                      console.log('Token stored to', TOKEN_PATH);
                    });
                    callback(oAuth2Client);
                  });
                });
              }
        },
  
  GetNumberOfColums : async function(auth,start,end) {
      return new Promise((resolve, reject) => {

          const sheets = google.sheets({version: 'v4', auth});
        sheets.spreadsheets.values.get({spreadsheetId : Const.GspreadsheetID,range: 'Laurencius!'+start+':'+end}, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            const numRows = result.data.values ? result.data.values.length : 0;
            resolve(numRows);
          }
        });
      })
  },
  
  TimeReset : function(auth){
    
    let ToSend = new Array()
    
    for(let x = 0; x<db.get('ListNextRaid').value().length;x++){
      ToSend.push(["","","","","","","","","",""])
    }
    
    let sheets = google.sheets({version: 'v4', auth});
    let data = [{range:'Groupes_Raid_Prototype!A2:J'+(db.get('ListNextRaid').value().length+2),values:ToSend}];

    const resource = {data,valueInputOption:"USER_ENTERED",};

    sheets.spreadsheets.values.batchUpdate({spreadsheetId:Const.GspreadsheetID, resource : resource}, (err, result) => {
     if (err) {
       console.log(err);
       
      } else {
      }
      });
  },
  UpdateAbsenceNextRaid: async function(auth){
    let ListNextRaid = db.get('ListNextRaid').value()
    let sheets = google.sheets({version: 'v4', auth});

    for(let x = 0; x<ListNextRaid.length;x++){
      let temp = db.get('Users').find({ DiscordID: ListNextRaid[x] }).value()
      if(temp.NextRaid=="0"){ // temp.DisplayName.substring(temp.DisplayName.length-2,temp.DisplayName.length-1)

        if(temp.GameCharacter=="Erreur"){
          temp.DisplayNameClean = temp.DisplayName
        } 

        let PP = Math.round(temp.Assiduity/temp.TotalRaid*100)
        let IC = Math.round(temp.TrustIndicator/temp.Assiduity*100)
        let data = [{range:'Groupes_Raid_Prototype!A'+(2+x)+':J'+(2+x),values:[[temp.DiscordRole,temp.DisplayNameClean,temp.GameCharacter,temp.Lvl,temp.NextRaid,PP,IC,temp.House,temp.BooleanWeapongSiege,""]]}];

          const resource = {data,valueInputOption:"USER_ENTERED",};

          sheets.spreadsheets.values.batchUpdate({spreadsheetId:Const.GspreadsheetID, resource : resource}, (err, result) => {
             if (err) {
               console.log(err);

              } else {
              }
            });
      }
    }
  },
  
  Stat : async function(auth){
    
    let Stat = db.get('Users').value()
    
    Stat.sort(function(PlayerA,PlayerB){
      
      let PPA = Math.round(PlayerA.Assiduity/PlayerA.TotalRaid*100) // Pourcentage de présence du joueur A
      let PPB = Math.round(PlayerB.Assiduity/PlayerB.TotalRaid*100) // Pourcentage de présence du joueur B
      let ICA = Math.round(PlayerA.TrustIndicator/PlayerA.Assiduity*100) // Indicateur de confiance du joueur A
      let ICB = Math.round(PlayerB.TrustIndicator/PlayerB.Assiduity*100) // Indicateur de confiance du joueur B

      if(PPA<PPB){
        return 1
      }
      if(PPA>PPB){
        return -1
      }
      if(PlayerA.TotalRaid<PlayerB.TotalRaid){
        return 1
      }
      if(PlayerA.TotalRaid>PlayerB.TotalRaid){
        return -1
      }
      if(PlayerA.TrustIndicator<PlayerB.TrustIndicator){
        return 1
      }
      if(PlayerA.TrustIndicator>PlayerB.TrustIndicator){
        return -1
      }
      if(PlayerA.Absence=="Non"&&PlayerB.Absence=="Oui"){
        return 1
      }
      if(PlayerA.Absence=="Oui"&&PlayerB.Absence=="Non"){
        return -1
      }
      return 0    
})
    
    let ToSend = new Array()
    
    for(let x = 0; x<Stat.length;x++){

      let temp = Stat[x] // CurrrentPlayer
      if(temp.GameCharacter=="Erreur"){
        temp.DisplayNameClean = temp.DisplayName
      } 

      let PP = Math.round(temp.Assiduity/temp.TotalRaid*100)
      let IC = Math.round(temp.TrustIndicator/temp.Assiduity*100)
      ToSend.push([temp.DisplayNameClean,temp.DiscordRole,PP,temp.TotalRaid,IC,temp.Lvl,temp.Absence])
    }
    
    let sheets = google.sheets({version: 'v4', auth});
    const data = [{range:'Statistiques!A6:H'+(ToSend.length+6),values:ToSend}];


    let resource = {data,valueInputOption:"USER_ENTERED",};

    sheets.spreadsheets.values.batchUpdate({spreadsheetId:Const.GspreadsheetID, resource : resource}, (err, result) => {
     if (err) {
       console.log(err);
       
      } else {
      }
      });
  },
  
  UpdateNextRaid: async function(auth){
     
  let ListNextRaid = db.get('ListNextRaid').value()
    
    let ToSend = new Array()
    
    for(let x = 0; x<ListNextRaid.length;x++){
      
      let temp = db.get('Users').find({ DiscordID: ListNextRaid[x] }).value()
      
      if(temp.GameCharacter=="Erreur"){
        temp.DisplayNameClean = temp.DisplayName
      } 

      let PP = Math.round(temp.Assiduity/temp.TotalRaid*100)
      let IC = Math.round(temp.TrustIndicator/temp.Assiduity*100)
      ToSend.push([temp.DiscordRole,temp.DisplayNameClean,temp.GameCharacter,temp.Lvl,temp.NextRaid,PP,IC,temp.House,temp.BooleanWeaponSiege])
    }
    
    let sheets = google.sheets({version: 'v4', auth});
    const data = [{range:'Groupes_Raid_Prototype!A2:I'+(db.get('ListNextRaid').value().length+2),values:ToSend}];


    let resource = {data,valueInputOption:"USER_ENTERED",};

    sheets.spreadsheets.values.batchUpdate({spreadsheetId:Const.GspreadsheetID, resource : resource}, (err, result) => {
     if (err) {
       console.log(err);
       
      } else {
      }
      });
  },
}

