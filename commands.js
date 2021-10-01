
const Web3 = require("web3");
const chalk = require("chalk");
const Config = require("./config.js");

class Commands {
    commands = {};
    config = new Config();
    web3;

    constructor() {
        const prov = this.config.config.provider;
        if (!prov) {
            return;
        }

        this.initWeb3(prov);
    }

    initWeb3 = (prov) => {
        this.web3 = new Web3(new Web3.providers.HttpProvider(prov));
    }

    requireWeb3 = () => {
        if (!this.web3) {
            this.error("This command requires a valid provider to be set.");
        }
    }

    setConfig = (key, value) => {
        this.config.set(key, value)
    }

    add = (cmd) => {
        let {name, desc, usage, hidden, fn} = cmd;
        if (!name || !desc || !fn) {
            console.warn("invalid command format");
            return;
        }
    
        if (this.commands[name]) {
            console.warn("command already exists:", name);
        }
    
        this.commands[name] = cmd;
    }

    list = () => {
        console.log(chalk.magenta.bold("\nAvailable commands:"))  
        for(let name in this.commands) {
            let cmd = this.commands[name];
            if (cmd.hidden) {
                continue;
            }

            console.log(chalk.yellow(name), "\t"+cmd.desc, "\n\t\tUsage: "+chalk.magentaBright.italic(cmd.usage)+"");
        }
    }

    setResult = (data) => {
        console.log(data);
        this.setConfig("lastResult", data);
    }
    
    error = (msg, showHelp) => {
        console.log(chalk.red(msg))
        if (showHelp) {
            this.commands["help"].fn()
        }
    }

    execute = async (args = [], yargs) => {
        let cmd = this.findCommandFromArgs(args);
        if (!cmd) {
            console.log(chalk.redBright("\nUnrecognized command. Check below the currently supported ones."));
            this.list();
            yargs.showHelp();
            return;
        }

        // run command
        await cmd.fn(args, yargs, this);

        // update config if it was changed at any time during execution
        this.config.persist();
    }

    findCommandFromArgs = (args) => {
        if (args.length === 0) {
            return this.commands["help"];
        }

        if (args.length <= 1) {
            // we have no commands of single words
            return undefined;
        }

        let name = args[0] + " " + args[1];
        return this.commands[name];
    }
}

const notImplemented = (args, flags, commands) => {
    console.warn("not implemented");
};

const commands = new Commands();

commands.add({
    name: "help",
    usage: "haalppp",
    desc: "haaaaaalppp meeee",
    hidden: true,
    fn: (_, yargs) => {
        commands.list();
        yargs.showHelp();
    }
})

commands.add({
    name: "get config",
    usage: "pie3 get config",
    desc: "Prints the current cli config",
    fn: () => {
        console.log(commands.config.raw());
    }
})

commands.add({
    name: "set seed",
    usage: "pie3 set seed <seed>",
    desc: "Sets a seed from which to derive keys when creating transactions that need a signature.",
    fn: notImplemented
})

commands.add({
    name: "use account",
    usage: "pie3 use account <privKey|seedDerivationPath>",
    desc: "Determines which account will be used to sign transactions in the following commands.",
    fn: notImplemented
})

module.exports = commands;

