
const fs = require("fs");
const os = require("os");

const configPath = os.homedir()+"/.pie3.json";

class Config {
    config = {};
    configWasUpdated = false;

    constructor() {
        try {
            this.config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        } catch(err) {
            if (err.code === "ENOENT") {
                console.log("Creating config file ...");
                this.persist();
            }
        }
    }

    raw = () => {
        return this.config;
    }

    set = (key, value) => {
        this.config[key] = value;
        this.configWasUpdated = true;
    }

    persist = () => {
        if (!this.configWasUpdated) {
            return;
        }
        fs.writeFileSync(configPath, JSON.stringify(this.config))
    }
}

module.exports = Config;