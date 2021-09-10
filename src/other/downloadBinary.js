const { AuthenticationService, AppClient } = require("uu_appg01_server-client");
const fs = require("fs");

let bookkitUrl = process.argv[2]
let binaryCode = process.argv[3]
let downloadPath = process.argv[4]
let passwordFile = process.argv[5]

const getBinary = bookkitUrl + "/getBinaryData?code=" + binaryCode;

async function main() {
  let session = await AuthenticationService.authenticate(passwordFile);
  let options = { session };
  await console.log("\ngetting binary: " + getBinary+"\n")
  let response = await AppClient.get(getBinary, null, options);

  let filePath = downloadPath + '/' + response.data.filename;
  await console.log("\nstoring content to: " + filePath +"\n")
  response.data.pipe(fs.createWriteStream(filePath));

  await console.log("\ndone: " + response.data.filename+" downloaded \n")
}

if (fs.existsSync(downloadPath)) {
    main();
} else {
    console.log("\n"+downloadPath + ' not found.');
}

