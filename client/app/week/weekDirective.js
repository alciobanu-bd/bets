
weekModule

.directive('week', [
    'BetService', 'WeekFactory', 'RolesFactory', 'UserInformation', '$modal',
    function(BetService, WeekFactory, RolesFactory, UserInformation, $modal) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            week: '=',
            bets: '=',
            errorObject: '=',
            refreshBets: '&',
            realScoreEvents: '=',
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

            scope.resetBetManager();

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
                    var newEvent = {};
                    angular.extend(newEvent, event);
                    delete newEvent.homeTeam;
                    delete newEvent.awayTeam;
                    delete newEvent.startDate;
                    return newEvent;
                });

                return _.filter(events, function (event) {
                    return (event.awayScore || event.awayScore == '0') && (event.homeScore || event.homeScore == '0') &&
                        parseInt(event.awayScore) != NaN && parseInt(event.homeScore) != NaN;
                });

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
                        parseInt(event.awayScore) != NaN && parseInt(event.homeScore) != NaN;
                });
            }

            scope.updateResults = function () {
                scope.afterUpdateResults.success = false;
                scope.afterUpdateResults.error = false;
                WeekFactory.updateResults(scope.week.events, scope.week._id, function () {
                    scope.afterUpdateResults.success = true;
                    scope.afterUpdateResults.message = 'The results were saved successfully.';
                }, function () {
                    scope.afterUpdateResults.error = true;
                    scope.afterUpdateResults.message = 'The results saved with errors.' +
                        'Please try to save them again urgently.' +
                        'If the problem persists, contact the developers as soon as you can.';
                });
            }

            scope.openEditWeekModal = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'app/week/views/weekEdit.html',
                    controller: 'WeekEditController',
                    size: 'lg',
                    resolve: {
                        week: function () {
                            return scope.week;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    scope.reload({weekNumber: scope.searchedWeekNumber});
                });
            }

            scope.$on('$destroy', function () {
                scope.BetService = null;
            });

        }
    }
}]);


weekModule
.controller('WeekEditController', [
    '$scope', '$modalInstance', 'week', 'InitUrls', 'CallUrlService',
    function ($scope, $modalInstance, week, InitUrls, CallUrlService) {

        $scope.week = JSON.parse(JSON.stringify(week)); // trick to deep clone object

        for (var i = 0; i < $scope.week.events.length; i++) {
            var event = $scope.week.events[i];
            var date = new Date(event.startDate);
            event.startTime = ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2);
            event.dateOpened = false;
        }

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

            var correctTime = _.every($scope.week.events, function (match) {
                var timeRegex = RegExp(/[0-9][0-9]?:[0-9][0-9]/);
                if (!timeRegex.test(match.startTime)) {
                    return false;
                }
                var splitted = match.startTime.split(":");
                return splitted[0] >= 0 && splitted[0] <= 24 && splitted[1] >= 0 && splitted[1] <= 59;
            });

            return !correctTime;
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
                newMatch.startDate.setHours(getHour(match.startTime), getMinutes(match.startTime));
                delete newMatch.startTime;
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

            setIndexesForEvents(updatedWeek);
            $scope.errorSaving = false;

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

