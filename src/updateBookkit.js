"use strict";
const { AuthenticationService, AppClient } = require("uu_appg01_server-client");

let bookkitUrl = process.argv[2]
let pageID = process.argv[3]
let environment = process.argv[4]
let application = process.argv[5]
let version = process.argv[6]
let passwordFile = process.argv[7]

const loadPage = bookkitUrl + "/loadPage";
const updatePage = bookkitUrl + "/updatePage";
let dtoin = {"code": pageID }


async function main() {
  let session = await AuthenticationService.authenticate(passwordFile);
  let options = { session };
  await console.log("getting page")
  var output = await AppClient.get(loadPage, dtoin, options);
  var uu5DataMap = output.uu5DataMap;

 // await console.log("before")
 // await console.log(uu5DataMap.table1.data)

  await console.log("processing")

  let index = getApplicationIndex(application,uu5DataMap.table1.data[0]);
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();

  uu5DataMap.table1.data.forEach((x) => {
       if (x[0] === environment) {
            x[index] = version + " (" + (date + "." + month + "." + year +" " + hours + ":" + minutes) + ")"
       }
  });

 // await console.log("after")
  //await console.log(uu5DataMap.table1.data)


  await console.log("updating page")
  var postDtoIn = {"code": pageID , "uu5DataMap": uu5DataMap }

 // await console.log(postDtoIn)
  await AppClient.post(updatePage, postDtoIn, options);
  await console.log("done")

  process.exit()

}

function getApplicationIndex(application,row) {
  for (let i = 0; i < row.length; i++) {
    if (row[i] === application) {
      return i;
    }
  }
  throw 'Application is not exist, must be one of: ' + row;
}

main();
