
teamModule.
factory('TeamFactory', [
'$q', 'InitUrls', 'CallUrlService', 'TeamSerializer',
function ($q, InitUrls, CallUrlService, TeamSerializer) {

    var thisFactory = [];

    thisFactory.getTeamsByName = function (name) {

        var defered = $q.defer();

        InitUrls.then(function (urls) {

            CallUrlService.getArray({uri: urls.team.getByName, id: name},
                function (data) {
                    var teams = [];
                    for (var i = 0; i < data.length; i++) {
                        TeamSerializer.adjustTeamForCurrentLanguage(data[i]);
                        teams.push(data[i]);
                    }
                    defered.resolve(teams);
                },
                function (response) {
                    defered.reject(response);
                }
            );

        });

        return defered.promise;

    }

    return thisFactory;

}
])

.factory('TeamSerializer', [
'CurrentLanguageFactory',
function (CurrentLanguageFactory) {

    var thisFactory = {};

    thisFactory.serialize = function (teamModel, imagePath) {

        var team = {
            imageUrl: imagePath,
            countryCode: teamModel.country.code.toLowerCase(),
            founded: teamModel.founded
        };
        team.name = [];
        for (var i in teamModel.name) {
            team.name.push({
                lang: i,
                value: teamModel.name[i]
            });
        }
        team.details = [];
        for (var i in teamModel.details) {
            team.details.push({
                lang: i,
                value: teamModel.details[i]
            });
        }
        team.city = [];
        for (var i in teamModel.city) {
            team.city.push({
                lang: i,
                value: teamModel.details[i]
            });
        }
        team.nicknames = [];
        for (var i in teamModel.nicknames) {
            var nicknamesSplit = teamModel.nicknames[i].split(",");
            for (var j = 0; j < nicknamesSplit.length; j++) {
                team.nicknames.push({
                    lang: i,
                    value: nicknamesSplit[j]
                });
            }
        }

        return team;

    }

    thisFactory.adjustTeamForCurrentLanguage = function (team) {

        var currentLangFn = function (item) {
            return item.lang == CurrentLanguageFactory.getCurrentLanguage().code;
        }

        var getValueOnly = function (item) {
            return item.value;
        }

        team.searchingWord = "";
        for (var i = 0; i < team.name.length; i++) {
            team.searchingWord += team.name[i].value + ",";
        }

        team.name = _.find(team.name, currentLangFn);
        if(!team.name) {
            delete team.name;
        }
        else {
            team.name = team.name.value;
        }

        team.city = _.find(team.city, currentLangFn);
        if(!team.city) {
            delete team.city;
        }
        else {
            team.city = team.city.value;
        }

        team.details = _.find(team.details, currentLangFn);
        if(!team.details) {
            delete team.details;
        }
        else {
            team.details = team.details.value;
        }

        team.nicknames = _.map(_.filter(team.nicknames, currentLangFn), getValueOnly);

    }

    return thisFactory;

}
]);
