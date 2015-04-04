
teamModule
.filter(
'excludeTeamByCountryObject', [
function () {

    return function (teamsArray, countryObjectFilter) {

        var array = [];

        if (!teamsArray) {
            return teamsArray;
        }

        for (var i = 0; i < teamsArray.length; i++) {
            var team = teamsArray[i];
            if (countryObjectFilter[team.countryCode] || !team.isClub) {
                array.push(team);
            }
        }

        return array;

    }

}
]);
