
settingsModule

.factory('Settings', [
function () {

    return {

        week: {
            maxNumberOfMatches: 10
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
        }

    };

}
])
