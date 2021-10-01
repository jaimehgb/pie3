

const commands = require("./commands");

const ZERO = "0x0000000000000000000000000000000000000000";

const setProvider = async (args, yargs) => {
    const url = args[2];
    if (!isValidHttpUrl(url)) {
        commands.error("Invalid provider url.");
        return;
    }
    
    // validate that the provider works
    commands.initWeb3(url)
    try {
        await commands.web3.eth.getBalance(ZERO);
    } catch (err) {
        commands.error(err);
        return;
    }

    commands.setConfig("provider", url)
}

const web3Proxy = async (args, yargs) => {
    commands.requireWeb3();

    const fnName = args[2];
    let fnArgs = fnName
        .replace(")", "")
        .replace(" ", "")
        .split("(")

    let path = fnArgs[0].split(".");
    fnArgs = fnArgs[1].split(",");

    let fn = commands.web3;
    for (let i = 0; i < path.length; i++) {
        arg = path[i]
        fn = fn[arg];
    }

    console.log(await fn(...fnArgs))
}

function isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }


module.exports = (() => {
    commands.add({
        name: "set provider",
        usage: "pie3 set provider <url>",
        desc: "Sets the web3 http provider to use. It can be a seed node, infura, etc...",
        fn: setProvider
    })

    commands.add({
        name: "web3 proxy",
        usage: "pie3 web3 \"<some web3 function>\" (i.e.: pie3 web3 \"eth.balance(address))\"",
        desc: "Allows you to run web3 commands on the fly",
        fn: web3Proxy,
    })
})();