
var settingsProfiles = {
    dev: {
        profileName: 'dev',
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
        privateMessagesWorkerProcesses: 3,
        inbox: {
            numberOfConversationsOnInboxEmit: 7,
            numberOfMessagesToLoadPerCoversation: 10
        }
    },
    prod: {
        profileName: 'prod',
        domainName: {
            address: "http://canihazbets.me",
            beautifulName: "CanIHazBets",
            dns: "canihazbets.me"
        },
        port: 9066,
        dbPath: "mongodb://localhost/bets",
        mail: {
            smtp: {
                host: "localhost",
                port: 25
            }
        },
        privateMessagesWorkerProcesses: 3,
        inbox: {
            numberOfConversationsOnInboxEmit: 7,
            numberOfMessagesToLoadPerCoversation: 50
        }
    },
    mutual: {
        // settings which are mutual for prod and dev
        team: {
            minImageSize: 500,
            maxImageSize: 2000,
            logoPath: {
                prefix: 'client/',
                dir: 'images/team-logos/'
            }
        }
    }
};




var returnVal = settingsProfiles.prod; // change this line to switch between profiles
// add mutual settings
for (var i in settingsProfiles.mutual) {
    returnVal[i] = settingsProfiles.mutual[i];
}

returnVal.isDev = function () {
    return returnVal.profileName == 'dev';
}

returnVal.isProd = function () {
    return returnVal.profileName == 'prod';
}

module.exports = returnVal;
