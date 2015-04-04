
weekModule

.controller('NewWeekController', [
'$scope', 'Settings', 'CallUrlService', 'InitUrls', '$translate', '$timeout', 'WeekFactory', '$filter',
'$modal', 'TeamFactory',
function ($scope, Settings, CallUrlService, InitUrls, $translate, $timeout, WeekFactory, $filter,
$modal, TeamFactory) {

    $scope.range = function (n) {
        var intN = parseInt(n);
        if (n && isNaN(intN)) {
            return [];
        }
        return _.range(intN);
    }

    $scope.matchesNumber = {
        total: '',
        required: ''
    };

    $scope.weekOptions = {
        hidden: false
    };

    $scope.setMatchesArray = function () {
        $scope.matches = [];
        for (var i in $scope.range($scope.matchesNumber.total)) {
            $scope.matches.push({
                homeTeam: {
                    name: ''
                },
                awayTeam: {
                    name: ''
                },
                competition: '',
                startDate: null,
                startTime: '',
                index: i
            });
        }
    }

    $scope.validateNumberOfMatches = function () {
        var n = parseInt($scope.matchesNumber.total);
        if (isNaN(n)) {
            $scope.matchesNumber.total = '';
        }
        if (n > Settings.week.maxNumberOfMatches) {
            $scope.matchesNumber.total = Settings.week.maxNumberOfMatches.toString();
        }
    }

    $scope.publishError = function () {

        if (parseInt($scope.matchesNumber.total) < parseInt($scope.matchesNumber.required)) {
            return true;
        }

        if ($scope.save.inProgress) {
            return true;
        }

        var existTeamIds = _.every($scope.matches, function (match) {
            return match.awayTeam.teamId != undefined && match.awayTeam.teamId != undefined;
        });

        var dateAfterToday = _.every($scope.matches, function (match) {
            var startDate = match.startDate;
            var today00 = new Date();
            today00.setHours(0, 0);
            return startDate > today00;
        });

         var correctTime = _.every($scope.matches, function (match) {
            var timeRegex = RegExp(/[0-9][0-9]?:[0-9][0-9]/);
            if (!timeRegex.test(match.startTime)) {
                return false;
            }
            var splitted = match.startTime.split(":");
            return splitted[0] >= 0 && splitted[0] <= 24 && splitted[1] >= 0 && splitted[1] <= 59;
        });

        return !dateAfterToday || !correctTime || !existTeamIds;

    }


    $scope.inputThrottleInterval = Settings.utils.throttleInputInterval;

    $scope.getTeamsFromServer = function ($viewValue) {

        if (!$viewValue || $viewValue.trim().length < 3) {
            return [];
        }

        return TeamFactory.getTeamsByName($viewValue.trim())
        .then(function (teams) {
            var suggestions = teams;
            suggestions.push({
                name: $translate.instant('weekPage.addNewWeekPage.addNewTeam'),
                isSpecialSelection: true
            });
            return $filter('teamSelect')(suggestions, $viewValue);
        });

    }

    $scope.deleteTeamId = function (teamModel) {
        delete teamModel.teamId;
    }

    $scope.onTypeaheadSelect = function (teamModel, item, model, label) {
        if (item.isSpecialSelection) {
            // add new team
            var modalInstance = $modal.open({
                templateUrl: 'app/week/views/addNewTeam.html',
                controller: 'NewTeamController',
                backdrop: 'static'
            });
            teamModel.name = "";

            modalInstance.result.then(function (resolvedTeam) {
                teamModel.name = resolvedTeam.name;
                teamModel.teamId = resolvedTeam._id;
            });
        }
        teamModel.name = item.name;
        teamModel.teamId = item._id;
    }



    var getHour = function (timeString) {
        var splitted = timeString.split(":");
        return parseInt(splitted[0]);
    }

    var getMinutes = function (timeString) {
        var splitted = timeString.split(":");
        return parseInt(splitted[1]);
    }

    var getMatches = function () {
        return _.map($scope.matches, function (match) {
            var newMatch = JSON.parse(JSON.stringify(match));
            newMatch.startDate = new Date(newMatch.startDate);
            newMatch.startDate.setHours(getHour(match.startTime), getMinutes(match.startTime));
            newMatch.index = parseInt(match.index);
            delete newMatch.homeTeam.name;
            delete newMatch.awayTeam.name;
            delete newMatch.startTime;
            return newMatch;
        });
    }

    $scope.afterSave = {
        error: false,
        success: false,
        message: '',
        refresh: function () {
            $scope.newWeekPanel = false;
            $scope.matchesNumber.total = '';
            $scope.matchesNumber.required = '';
            $scope.matches = [];
            $scope.afterSave.error = false;
            $scope.afterSave.success = false;
            $scope.afterSave.message = '';
            $scope.save.inProgress = false;
            $scope.WeekFactory.resetWeekFactory();
            $scope.WeekFactory.fetchCurrentWeek(function () {
                $scope.WeekFactory.fetchCurrentWeekBet();
            });
            $scope.WeekFactory.fetchBeforeCurrentWeek(function () {
                $scope.WeekFactory.fetchBeforeCurrentWeekBet();
            });
        }
    };
    $scope.save = {
        inProgress: false
    };

    $scope.publish = function () {

        $scope.afterSave.error = false;
        $scope.afterSave.success = false;
        $scope.save.inProgress = true;

        var newWeek = {
            events: getMatches(),
            number: $scope.WeekFactory.currentWeek.number + 1,
            required: parseInt($scope.matchesNumber.required),
            hidden: $scope.weekOptions.hidden
        };

        InitUrls.then(function (data) {
            CallUrlService.post({uri: data.week.address}, newWeek,
                function (data) {
                    $scope.afterSave.error = false;
                    $scope.afterSave.success = true;
                    $scope.save.inProgress = false;
                    $scope.afterSave.message = $translate.instant('weekPage.addNewWeekPage.weekSavedSuccessfully');
                },
                function (response) {
                    $scope.afterSave.error = true;
                    $scope.afterSave.success = false;
                    $scope.save.inProgress = false;
                    if (response.data.message) {
                        $scope.afterSave.message = response.data.message;
                    }
                    else {
                        $scope.afterSave.message = $translate.instant('weekPage.addNewWeekPage.weekDidntSave');
                    }
                }
            );
        });

    }

    $scope.beforeSave = {
        showConfirm: false
    };
    $scope.showConfirm = function () {
        $scope.beforeSave.showConfirm = true;
    }

    $scope.hideConfirm = function () {
        $scope.beforeSave.showConfirm = false;
    }

}
]
);


weekModule
.controller('NewTeamController', [
'$scope', '$modalInstance', 'Languages', 'CurrentLanguageFactory', 'CountryCodes', 'FileUploader',
'InitUrls', 'CallUrlService', 'TeamSerializer',
function ($scope, $modalInstance, Languages, CurrentLanguageFactory, CountryCodes, FileUploader,
InitUrls, CallUrlService, TeamSerializer) {

    $scope.Languages = Languages;
    $scope.CountryCodes = CountryCodes;

    $scope.cancel = function () {
        $modalInstance.close("closed");
    }

    $scope.team = {
        name: {},
        city: {},
        details: {},
        nicknames: {},
        country: {
            code: '',
            name: ''
        },
        founded: '',
        website: '',
        image: null,
        isClub: true
    };

    for (var i in Languages.list) {
        var lang = Languages.list[i];
        $scope.team.name[lang.code] = "";
        $scope.team.city[lang.code] = "";
        $scope.team.details[lang.code] = "";
        $scope.team.nicknames[lang.code] = "";
    }

    $scope.selectedLangs = {
        name: CurrentLanguageFactory.getCurrentLanguage().code,
        city: CurrentLanguageFactory.getCurrentLanguage().code,
        details: CurrentLanguageFactory.getCurrentLanguage().code,
        nicknames: CurrentLanguageFactory.getCurrentLanguage().code
    };

    $scope.onTypeaheadCountrySelect = function (item) {
        $scope.team.country = {
            name: item.name,
            code: item.code
        };
    }

    $scope.savingStatus = {
        error: false,
        message: ""
    };

    $scope.save = function () {

        $scope.savingStatus.error = false;

        var onSaveError = function (response) {
            $scope.savingStatus.error = true;
            $scope.savingStatus.message = response.message;
        }

        InitUrls.then(function (urls) {
            FileUploader.uploadFile({uri: urls.team.logoUpload, file: $scope.team.image},
            function (data) {

                CallUrlService.post({uri: urls.team.address}, TeamSerializer.serialize($scope.team, data.path),
                function (data) {

                    TeamSerializer.adjustTeamForCurrentLanguage(data);
                    $modalInstance.close(data);

                }, onSaveError);

            }, onSaveError
            );
        });
    }

}
]);
