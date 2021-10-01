#! /usr/bin/env node

const yargs = require("yargs");
const os = require("os");

require("../provider");
require("../contract");


const options = yargs
    .option("value", {
        describe: "Value in ether to send in a given transaction", 
        type: "string",
        demandOption: false 
    })
    .option("gasLimit", {
        describe: "Max gas allowed to be consumed in this transaction", 
        type: "number",
        demandOption: false 
    })
    .option("gasPrice", {
        describe: "Transaction gas price in wei", 
        type: "number",
        demandOption: false 
    })
    .help(true)  
    .argv;



const args = process.argv.slice(2);

const commands = require("../commands.js");

(async () => {
    await commands.execute(args, yargs);
})()



// commands:
//   $ cli set provider <url>
//   $ cli set seed <seed>
//   $ cli use account <privKey|seedDerivationPath>
//   $ cli use contract <address>
//   $ cli call <methodName(params)>
//   $ cli send <methodName(params)> [--value valueInEther] [--gas gasLimit] [--gasPrice gasPriceWei]


