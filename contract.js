
const commands = require("./commands");
const Web3 = require("web3");


const setContract = async (args) => {
    commands.requireWeb3();
    
    const web3 = commands.web3;
    const addr = args[2];
    if (!web3.utils.isAddress(addr)) {
        commands.error("Contract address does not seem to be valid.");
        return;
    }

    let bytecode = await web3.eth.getCode(addr);
    if (bytecode === "0x") {
        commands.error("Address does not seem to contain a contract");
        return;
    }

    commands.setConfig("contract", addr);
}

const callContract = async (args) => {
    commands.requireWeb3();

    const web3 = commands.web3;
    let parsed = parseFunction(args[2])

    //console.log(parsed)
    let sig = web3.eth.abi.encodeFunctionSignature(parsed.sig);
    let params = web3.eth.abi.encodeParameters(parsed.argTypes, parsed.argVals)
    let data = sig + (params.replace("0x", ""));


    let res = await web3.eth.call({
        to: commands.config.config.contract,
        data
    })
    commands.setResult(res);
}

const decodeResult = (args) => {
    commands.requireWeb3();

    const web3 = commands.web3;
    const res = commands.config.config.lastResult;
    const type = args[2];

    commands.setResult(web3.eth.abi.decodeParameter(type, res))
}

const parseFunction = (fnName) => {
    let args_ = "("+fnName.substring(fnName.indexOf('(')+1)
    let args_s = args_.split(")")

    let returns = args_s[1].trim();
    let args = args_s[0]+")";
    let name = fnName.replace(args_, "");


    let sig = name + "(";
    let argTypes = [];
    let argVals = [];
    let argPairs = args.replace(/\(|\)/g, "").split(",")
    for (let pair of argPairs) {
        pair = pair.trim().replace(/ +/g, " ").split(" ")
        sig += pair[0] + ","
        
        argTypes.push(pair[0])
        argVals.push(pair[1])
    }
    sig = sig.slice(0, -1) + ")"

    return {
        sig,
        argTypes,
        argVals,
        name,
        returns,
    }
}

module.exports = (() => {
    commands.add({
        name: "use contract",
        usage: "pie3 use contract <contractAddress>",
        desc: "Sets the address of a contract with which to interact with the command `call`",
        fn: setContract
    })

    commands.add({
        name: "contract call",
        usage: "pie3 contract call \"<someContractViewFunction(type value, type2 value2)>\"",
        desc: "Attempts to make a function call on the contract currently in use.",
        fn: callContract
    })

    commands.add({
        name: "decode last",
        usage: "pie3 decode last <types",
        desc: "Will attempt to decode the data obtained in the last call with a given type.",
        fn: decodeResult,
    })
})();