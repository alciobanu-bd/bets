
module.exports = {
    dev: {
        domainName: {
            address: "http://localhost:1111",
            beautifulName: "CanIHazBets"
        },
        port: 1111,
        dbPath: "mongodb://localhost/bets-dev"
    },
    prod: {
        domainName: {
            address: "http://canihazbets.me",
            beautifulName: "CanIHazBets"
        },
        port: 80,
        dbPath: "mongodb://localhost/bets"

    }
};
