// Script for parsing package-lock.json and checking if dependecies exists in repository

const http = require('http');
const fs = require('fs')

//path to package.lock file
let packagelock = process.argv[2];
let packageLockRegistry = process.argv[3];
let checkRegistry = process.argv[4];
let depsData = fs.readFileSync(packagelock);
let depsJson = JSON.parse(depsData);
let missingDepencencies = [];
let missingDepencenciesLength = 0;

async function checkDependency(dependency) {

    return new Promise((resolve, reject) => {
        let url = depsJson.dependencies[dependency].resolved;
        url = url.replace(packageLockRegistry, checkRegistry);
        if(!url.includes(checkRegistry)) {
            throw new Error(`Replac e was not successful depUrl: ${url} packageLockRegistry: ${packageLockRegistry} checkRegistry: ${checkRegistry}`);
        }
        const req = http.request( url, res => {
            console.log("\t checking url: " +  depsJson.dependencies[dependency].resolved + " statusCode: " + res.statusCode)
            if (res.statusCode != 200) {
                missingDepencenciesLength = missingDepencencies.push(dependency);
            }
            res.on('data', d => {
                //console.log('data obtained')
            })
        })

        req.on('error', error => {
            console.error(error)
        })

        req.on('close', () => {
           // console.log('connection close')
            resolve()
        })

        req.end()
    })
}

async function main() {
    let dependenciesCount = Object.keys(depsJson.dependencies).length;

    for (let dependency in depsJson.dependencies) {
        console.log(dependenciesCount + " processing " + dependency);
        await checkDependency(dependency);
        dependenciesCount--;
    }

    console.log("\nRecapitulation: ")
    if(missingDepencenciesLength > 0){
        console.log("\tmissing packages below: " );
        console.log(missingDepencencies);
        process.exit(1)
    }
    console.log("\t all done");
    process.exit(0)
}

main()

