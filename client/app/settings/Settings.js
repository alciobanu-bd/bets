
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
        }

    };

}
])
