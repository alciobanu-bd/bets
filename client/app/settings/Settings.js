
settingsModule

.factory('Settings', [
function () {

    return {

        week: {
            maxNumberOfMatches: 10,
            events: {
                maxScoreDifference: 5
            }
        },
        user: {
            detailsRefreshInterval: 10000, // milliseconds
            tokenRefreshInterval: 60 * 60 * 1000 // 1 hour
        },
        home: {
            carouselInterval: 5000
        },
        login: {
            maxDaysOfKeepMeLoggedIn: 20
        },
        ranking: {
            limitUsers: 10
        },
        domain: {
            beautifulName: 'CanIHazBets'
        },
        loggly: {
            token: "5b79fefe-0852-450e-abbf-59c707dac80a"
        },
        geolocationAddresses: {
            ipApiCom: "http://ip-api.com/json"
        },
        sounds: {
            newMessageSoundUrl: "sounds/pling.mp3"
        },
        chat: {
            chatboxWidth: 255,
            maxNumberOfOpenChatboxes: Math.floor(window.innerWidth / 255),
            maxTimeoutSockets: 30000 // 30 seconds
        },
        utils: {
            throttleInputInterval: 300
        }

    };

}
]);
