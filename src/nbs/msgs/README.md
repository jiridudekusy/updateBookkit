# downloadBinary

script for updating bookit page with msgs perf test results
 
## How to run

```javascript
npm install 
node src/nbs/msgs/updateMsgsPerfPage.js bookKitUrl binaryFileCode  msgsVersion msgsChannel mecType mecValue ackValue teamcityBuildID pathToPasswordFile
```



example: 
```javascript
node src/nbs/msgs/updateMsgsPerfPage.js  https://uuapp.plus4u.net/uu-bookkit-maing01/1111111 123 17.1.2.3 ws 1MEC 12 42 1589 /tmp/uuEE /tmp/passwordFile
```

## password file
```bash
accessCode1=mysecret1
accessCode2=mysecret2
```
