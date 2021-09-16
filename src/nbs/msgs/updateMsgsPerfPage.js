"use strict";
const { AuthenticationService, AppClient } = require("uu_appg01_server-client");

let bookkitUrl = process.argv[2]
let pageID = process.argv[3]
let version = process.argv[4]
let channel = process.argv[5]
let mecType = process.argv[6]
let mecValue = process.argv[7]
let ackValue = process.argv[8]
let buildID = process.argv[9]
let passwordFile = process.argv[10]

const loadPage = bookkitUrl + "/loadPage";
const updatePage = bookkitUrl + "/updatePage";
const buildIDPosition = 9
const dateTimePosition = 10
let dtoin = {"code": pageID }
let uu5DataMap;

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let timestamp = (date + "." + month + "." + year +" " + hours + ":" + minutes)


async function main() {
  let session = await AuthenticationService.authenticate(passwordFile);
  let options = { session };
  await console.log("\ngetting page\n")
  var output = await AppClient.get(loadPage, dtoin, options);
  uu5DataMap = JSON.parse(JSON.stringify(output.uu5DataMap));


//  await console.log("before")
//  await console.log(uu5DataMap.ftp.data)
 if( getRowPositionByBuildID() === null) {  await prepareNewRow(); }
  await updateRow();

//  await console.log("after")
//  await console.log(uu5DataMap.ws.data)

//  await console.log("updating page for env: " + environment + ", app: " + application + ", version: " + version)
  var postDtoIn = {"code": pageID , "uu5DataMap": uu5DataMap }

  //await console.log(postDtoIn)
  await AppClient.post(updatePage, postDtoIn, options);
  await console.log("\ndone")

  process.exit()

}

function getRowPositionByBuildID(){
var res = null
   uu5DataMap[channel].data.forEach((row, i ) => {
        if (row[buildIDPosition] === buildID) {
                 res = i;
       }
   });
    return res;
}

function updateRow(){
  console.log("\nupdating row")
    for (var key in uu5DataMap) {
           if (uu5DataMap.hasOwnProperty(key)) {
               if(key === channel ){
                    var mecPosition = getMecPosition()
                    var rowPosition = getRowPositionByBuildID()
                    uu5DataMap[channel].data[rowPosition][mecPosition] = mecValue + " - "+ ackValue
                    uu5DataMap[channel].data[rowPosition][dateTimePosition] = timestamp
               }
           }
       }
  console.log("\nupdating row - done\n" )
}

function getMecPosition(){
   var row = uu5DataMap[channel].data[0]
    for (let i = 0; i < row.length; i++) {
        if (row[i] === mecType) {
          return i;
        }
      }
      throw 'mec type is not exist, must be one of: ' + row;
}

async function prepareNewRow(){
    console.log("\npreparing new row")

    let row = [
              version, '','', '',
              '',   '', '', '',
              '', buildID,  timestamp
            ]
    for (var key in uu5DataMap) {
        if (uu5DataMap.hasOwnProperty(key)) {
            if(key === channel){
                uu5DataMap[key].data.push(row);
            }
        }
    }
    console.log("\npreparing new row - done\n")
}


main();