
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

    thisFactory.getTeams = function (queryObject, onSuccess, onError) {

        if (typeof queryObject != 'object') {
            throw new Error("Query object @getTeams method is not present.");
        }

        var requestObject = {};
        requestObject.isClub = queryObject.isClub;

        InitUrls.then(function (urls) {
            requestObject.uri = urls.team.address;
            CallUrlService.getArray(requestObject,
                function (data) {
                    var teams = [];
                    for (var i = 0; i < data.length; i++) {
                        TeamSerializer.adjustTeamForCurrentLanguage(data[i]);
                        teams.push(data[i]);
                    }
                    if (typeof onSuccess === 'function') {
                        onSuccess(teams);
                    }
                },
                function (response) {
                    if (typeof onError === 'function') {
                        onError(response);
                    }
                });
        });
    }

    thisFactory.getTeamById = function (_id, onSuccess, onError) {

        InitUrls.then(function (urls) {
            CallUrlService.get({uri: urls.team.address, id: _id},
                function (data) {
                    TeamSerializer.adjustTeamForCurrentLanguage(data);
                    if (typeof onSuccess === 'function') {
                        onSuccess(data);
                    }
                },
                function (response) {
                    if (typeof onError === 'function') {
                        onError(response);
                    }
                });
        });
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
            founded: teamModel.founded,
            website: teamModel.website,
            ground: teamModel.ground,
            stadiumCapacity: teamModel.stadiumCapacity,
            isClub: teamModel.isClub
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
                value: teamModel.city[i]
            });
        }
        team.nicknames = [];
        for (var i in teamModel.nicknames) {
            var nicknamesSplit = teamModel.nicknames[i].split(",");
            for (var j = 0; j < nicknamesSplit.length; j++) {
                if (nicknamesSplit[j]) {
                    team.nicknames.push({
                        lang: i,
                        value: nicknamesSplit[j]
                    });
                }
            }
        }

        return team;

    }

    thisFactory.adjustTeamForCurrentLanguage = function (team) {

        if (!team._id) {
            return;
        }

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