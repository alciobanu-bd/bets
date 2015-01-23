
var settingsProfiles = {
    dev: {
        domainName: {
            address: "http://localhost",
            beautifulName: "CanIHazBets",
            dns: "canihazbets.me"
        },
        port: 9066,
        dbPath: "mongodb://localhost/bets",
        mail: {
            smtp: {
                host: "smtp.rdslink.ro",
                port: 25
            }
        },
        privateMessagesWorkerProcesses: 3
    },
    prod: {
        domainName: {
            address: "http://canihazbets.me",
            beautifulName: "CanIHazBets",
            dns: "canihazbets.me"
        },
        port: 80,
        dbPath: "mongodb://localhost/bets",
        mail: {
            smtp: {
                host: "localhost",
                port: 25
            }
        },
        privateMessagesWorkerProcesses: 3
    }
};

module.exports = settingsProfiles.prod;
