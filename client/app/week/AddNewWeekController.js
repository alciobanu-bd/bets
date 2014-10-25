
weekModule

.controller('NewWeekController', [
'$scope', 'Settings', 'CallUrlService', 'InitUrls',
function ($scope, Settings, CallUrlService, InitUrls) {

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

    $scope.setMatchesArray = function () {
        $scope.matches = [];
        for (var i in $scope.range($scope.matchesNumber.total)) {
            $scope.matches.push({
                homeTeam: '',
                awayTeam: '',
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

        return !dateAfterToday || !correctTime;

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
            var newMatch = {};
            angular.extend(newMatch, match);
            newMatch.startDate.setHours(getHour(match.startTime), getMinutes(match.startTime));
            newMatch.index = parseInt(match.index);
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
            required: parseInt($scope.matchesNumber.required)
        };

        InitUrls.then(function (data) {
            CallUrlService.post({uri: data.week.address}, newWeek,
                function (data) {
                    $scope.afterSave.error = false;
                    $scope.afterSave.success = true;
                    $scope.save.inProgress = false;
                    $scope.afterSave.message = "Week saved successfully.";
                },
                function (response) {
                    $scope.afterSave.error = true;
                    $scope.afterSave.success = false;
                    $scope.save.inProgress = false;
                    if (response.data.message) {
                        $scope.afterSave.message = response.data.message;
                    }
                    else {
                        $scope.afterSave.message = "Week didn't save. Please try again.";
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
)
