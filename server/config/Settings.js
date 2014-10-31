
module.exports = {
    dev: {
        domainName: {
            address: "http://localhost:1111",
            beautifulName: "CanIHazBets",
            dns: "canihazbets.me"
        },
        port: 80,
        dbPath: "mongodb://localhost/bets",
        mail: {
            smtp: {
                host: "smtp.rdslink.ro",
                port: 25
            }
        }
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
        }
    }
};
