
settingsModule

.factory('Settings', [
function () {

    return {

        week: {
            maxNumberOfMatches: 10
        },
        user: {
            detailsRefreshInterval: 10000 // milliseconds
        }

    };

}
])
