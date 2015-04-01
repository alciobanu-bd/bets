
weekModule

.directive('week', [
    'BetService', 'WeekFactory', 'RolesFactory', 'UserInformation', '$modal', 'Settings', '$translate',
    function(BetService, WeekFactory, RolesFactory, UserInformation, $modal, Settings, $translate) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            week: '=',
            bets: '=',
            errorObject: '=',
            refreshBets: '&',
            reload: '&',
            searchedWeekNumber: '='
        },
        templateUrl: "app/week/views/weekDirective.html",
        link: function(scope, element, attrs) {

            scope.RolesFactory = RolesFactory;
            scope.userInfo = UserInformation;

            scope.resetBetManager = function () {
                scope.BetService = BetService.newBetManager();
                scope.BetService.resetBetService();
            }

            scope.$watch('week._id', function () {
                scope.resetBetManager();
            });

            var sameDates = function (date1, date2) {
                return date1.getDate() == date2.getDate()
                    && date1.getMonth() == date2.getMonth()
                    && date1.getYear() == date2.getYear();
            }

            scope.isToday = function () {
                if (!scope.week) {
                    return false;
                }
                var today = new Date();
                return sameDates(today, new Date(scope.week.endDate));
            }

            scope.isTomorrow = function () {
                if (!scope.week) {
                    return false;
                }
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return sameDates(tomorrow, new Date(scope.week.endDate));
            }

            var updateBetsForThisWeek = function () {
                var eventScore = function (event) {
                    for (var i in scope.bets.scores) {
                        if (scope.bets.scores[i].index == event.index) {
                            return scope.bets.scores[i];
                        }
                    }
                    return null;
                }

                scope.week.events = _.map(scope.week.events, function (event) {
                    var score = eventScore(event);
                    if (score) {
                        event.homeScore = score.homeScore;
                        event.awayScore = score.awayScore;
                    }
                    return event;
                });
            }

            scope.$watch('bets', function () {

                if (scope.bets) {
                    // bet loaded

                    updateBetsForThisWeek();

                }

            });

            var getEvents = function () {

                var events = _.map(scope.week.events, function (event) {
                    var newEvent = JSON.parse(JSON.stringify(event));
                    delete newEvent.homeTeam;
                    delete newEvent.awayTeam;
                    delete newEvent.startDate;
                    delete newEvent.competition;
                    delete newEvent.diffTooHigh;

                    return newEvent;
                });

                return _.filter(events, function (event) {
                    return (event.awayScore || event.awayScore == '0') && (event.homeScore || event.homeScore == '0') &&
                        parseInt(event.awayScore) != NaN && parseInt(event.homeScore) != NaN;
                });

            }

            scope.checkScoreDifferenceTooHigh = function (match) {
                var maxDifference = Settings.week.events.maxScoreDifference;
                var ret = Math.abs(parseInt(match.homeScore) - parseInt(match.awayScore)) > maxDifference;
                match.diffTooHigh = ret;
            }

            scope.anyMatchWithDifferenceTooHigh = function () {
                for (var i = 0; i < scope.week.events.length; i++) {
                    if (scope.week.events[i].diffTooHigh) {
                        return true;
                    }
                }
                return false;
            }

            scope.resetMatchesWithDifferenceTooHigh = function () {
                for (var i = 0; i < scope.week.events.length; i++) {
                    scope.week.events[i].diffTooHigh = false;
                }
            }

            scope.validateScore = function (n) {
                n = parseInt(n);
                if (isNaN(n)) {
                   n = '';
                }
                return n;
            }

            scope.place = function () {

                var events = getEvents();
                var weekNumber = scope.week.number;
                var weekId = scope.week._id;

                scope.BetService.place({
                    scores: events,
                    weekNumber: weekNumber,
                    weekId: weekId
                },
                scope.bets,
                function () { // on success
                    scope.errorObject.active = false;

                    scope.refreshBets();

                });

            }

            scope.weekOptions = {
                showConfirm: false
            };
            scope.showConfirm = function () {
                scope.weekOptions.showConfirm = true;
            }

            scope.hideConfirm = function () {
                scope.weekOptions.showConfirm = false;
            }

            scope.updateScoreMode = false;

            scope.updateModeOn = function () {
                scope.updateScoreMode = true;
            }

            scope.updateModeOff = function () {
                scope.updateScoreMode = false;
            }

            scope.prepareEventsForResultsSaving = function () {
                scope.week.events = _.map(scope.week.events, function (event) {

                    event.homeScore = '';
                    event.awayScore = '';

                    return event;
                });
            }

            scope.refreshEventsForNonUpdateMode = function () {
                updateBetsForThisWeek();
            }

            scope.afterUpdateResults = {
                error: false,
                success: false,
                message: ''
            }

            scope.isResultsSaveDisabled = function () {
                if (!scope.week || !scope.week.events) {
                    return true;
                }
                return !_.every(scope.week.events, function (event) {
                    return (event.awayScore || event.awayScore == '0') && (event.homeScore || event.homeScore == '0') &&
                        !isNaN(parseInt(event.awayScore)) && !isNaN(parseInt(event.homeScore));
                });
            }

            scope.updateResults = function () {
                scope.afterUpdateResults.success = false;
                scope.afterUpdateResults.error = false;
                WeekFactory.updateResults(scope.week.events, scope.week._id, function () {
                    scope.afterUpdateResults.success = true;
                    scope.afterUpdateResults.message = $translate.instant('weekPage.weekDirective.afterUpdateSuccess');
                }, function () {
                    scope.afterUpdateResults.error = true;
                    scope.afterUpdateResults.message = $translate.instant('weekPage.weekDirective.afterUpdateError');
                });
            }

            var prepareWeekBeforeOpeningEditModal = function (week) {
                var preparedWeek = JSON.parse(JSON.stringify(week));
                for (var i = 0; i < preparedWeek.events.length; i++) {
                    var event = preparedWeek.events[i];
                    if (event.homeScore || event.homeScore == 0) {
                        delete event.homeScore;
                    }
                    if (event.awayScore || event.awayScore == 0) {
                        delete event.awayScore;
                    }
                }
                return preparedWeek;
            }

            scope.openEditWeekModal = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'app/week/views/weekEdit.html',
                    controller: 'WeekEditController',
                    size: 'lg',
                    resolve: {
                        week: function () {
                            return prepareWeekBeforeOpeningEditModal(scope.week);
                        }
                    }
                });

                modalInstance.result.then(function () {
                    scope.reload({weekNumber: scope.searchedWeekNumber});
                });
            }

            scope.openWeekHistoryModal = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'app/history/views/weekHistory.html',
                    controller: 'WeekHistoryController',
                    size: 'lg',
                    resolve: {
                        week: function () {
                            return prepareWeekBeforeOpeningEditModal(scope.week);
                        }
                    }
                });
            }

            scope.$on('$destroy', function () {
                scope.BetService = null;
            });

        }
    }
}]);

weekModule.controller('WeekHistoryController', [
'$scope', '$modalInstance', 'week', 'HistoryFactory', '$translate',
function ($scope, $modalInstance, week, HistoryFactory, $translate) {

    $scope.week = week;

    $scope.status = {
        inProgress: true,
        error: false,
        success: false,
        message: ''
    };

    $scope.history = [];

    $scope.paging = {
        page: 1,
        totalPages: 1, // will be overwritten by response from server
        itemsPerPage: 4, // will be overwritten by response from server
        totalItems: 0 // will be overwritten by response from server
    };

    $scope.getBetByIndex = function (bet, index) {
        return _.find(bet.scores, function (item) {
            return item.index == index;
        });
    }

    var loadPage = function (page) {
        HistoryFactory.loadHistoryForAWeek(week._id, page).then(
            function (data) {
                $scope.status.inProgress = false;
                $scope.status.error = false;
                $scope.status.success = true;
                $scope.history = data.bets;
                $scope.paging.totalPages = data.numberOfPages;
                $scope.paging.totalItems = data.count;
                $scope.paging.itemsPerPage = data.itemsPerPage;
            },
            function (response) {
                $scope.status.inProgress = false;
                $scope.status.error = true;
                $scope.status.success = false;
                if (response.data.message) {
                    $scope.status.message = response.data.message;
                }
                else {
                    $scope.status.message = $translate.instant('weekPage.weekHistory.couldntBeFetched');
                }
            }
        );
    }

    $scope.$watch('paging.page', function () {
        loadPage($scope.paging.page - 1);
    });

    $scope.close = function () {
        $modalInstance.close();
    }

}
]);

weekModule
.controller('WeekEditController', [
'$scope', '$modalInstance', 'week', 'InitUrls', 'CallUrlService', 'TeamFactory', '$translate', '$filter',
'$modal',
function ($scope, $modalInstance, week, InitUrls, CallUrlService, TeamFactory, $translate, $filter,
$modal) {

        $scope.week = JSON.parse(JSON.stringify(week)); // trick to deep clone object

        for (var i = 0; i < $scope.week.events.length; i++) {
            var event = $scope.week.events[i];
            var date = new Date(event.startDate);
            event.startTime = ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2);
            event.dateOpened = false;
            event.homeTeam = {
                teamId: event.homeTeam._id,
                name: event.homeTeam.name
            };
            event.awayTeam = {
                teamId: event.awayTeam._id,
                name: event.awayTeam.name
            };
            if (event.realHomeScore || event.realHomeScore == 0) {
                event.homeScore = event.realHomeScore;
                delete event.realHomeScore;
            }
            if (event.realAwayScore || event.realAwayScore == 0) {
                event.awayScore = event.realAwayScore;
                delete event.realAwayScore;
            }
        }

        $scope.resetScoreCheckbox = false;
        $scope.hiddenCheckbox = week.hidden;

        $scope.openDate = function (match, $event) {
            $event.preventDefault();
            $event.stopPropagation();

            match.dateOpened = true;
        }

        $scope.dateFormat = 'dd-MMMM-yyyy';

        $scope.isSavingDisabled = function () {
            if (parseInt($scope.week.required) < 1) {
                return true;
            }

            var existTeamIds = _.every($scope.week.events, function (match) {
                return match.awayTeam.teamId != undefined && match.awayTeam.teamId != undefined;
            });

            var correctTime = _.every($scope.week.events, function (match) {
                var timeRegex = RegExp(/[0-9][0-9]?:[0-9][0-9]/);
                if (!timeRegex.test(match.startTime)) {
                    return false;
                }
                var splitted = match.startTime.split(":");
                return splitted[0] >= 0 && splitted[0] <= 24 && splitted[1] >= 0 && splitted[1] <= 59;
            });

            return !existTeamIds || !correctTime;
        }

        $scope.removeMatch = function (index) {
            $scope.week.events.splice(index, 1);

            if ($scope.week.events.length < $scope.week.required) {
                $scope.week.required = $scope.week.events.length;
            }
        }

        $scope.addNewEvent = function () {
            $scope.week.events.push({});
        }

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
            return _.map($scope.week.events, function (match) {
                var newMatch = JSON.parse(JSON.stringify(match));
                newMatch.startDate = new Date(newMatch.startDate);
                delete newMatch.dateOpened;
                newMatch.startDate.setHours(getHour(match.startTime), getMinutes(match.startTime));
                delete newMatch.startTime;
                delete newMatch.diffTooHigh;
                delete newMatch.homeTeam.name;
                delete newMatch.awayTeam.name;
                return newMatch;
            });
        }

        var setIndexesForEvents = function (week) {
            for (var i = 0; i < week.events.length; i++) {
                week.events[i].index = i;
            }
        }

        $scope.ok = function () {

            var updatedWeek = JSON.parse(JSON.stringify($scope.week));
            updatedWeek.events = getMatches();
            updatedWeek.hidden = $scope.hiddenCheckbox;

            setIndexesForEvents(updatedWeek);
            $scope.errorSaving = false;

            if ($scope.resetScoreCheckbox) {
                for (var i = 0; i < updatedWeek.events.length; i++) {
                    var event = updatedWeek.events[i];
                    if (event.homeScore || event.homeScore == 0) {
                        delete event.homeScore;
                    }
                    if (event.awayScore || event.awayScore == 0) {
                        delete event.awayScore;
                    }
                }
            }

            InitUrls.then(function (urls) {
                CallUrlService.put({uri: urls.week.edit, id: $scope.week._id},
                    updatedWeek,
                    function (data) {
                        $modalInstance.close(data);
                    },
                    function (response) {
                        $scope.errorSaving = true;
                    });
            });
        }

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }

    }
]);

