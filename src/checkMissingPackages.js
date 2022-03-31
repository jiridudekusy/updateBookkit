// Script for parsing package-lock.json and checking if dependecies exists in repository

const http = require('http');
const fs = require('fs')

//path to package.lock file
let packagelock = process.argv[2]
let depsData = fs.readFileSync(packagelock);
let depsJson = JSON.parse(depsData);
let missingDepencencies = [];

async function checkDependency(dependency) {

    return new Promise((resolve, reject) => {
        const req = http.request( depsJson.dependencies[dependency].resolved, res => {
            console.log("\t checking url: " +  depsJson.dependencies[dependency].resolved + " statusCode: " + res.statusCode)
            if (res.statusCode != 200) {
                missingDepencencies.push(dependency);
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

    console.log("\nRecapitulation, missing packages below: ")
    console.log(missingDepencencies);

    process.exit()
}

main()

