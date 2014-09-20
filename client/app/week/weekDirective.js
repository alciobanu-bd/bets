
weekModule

.directive('week', [
    'BetService', 'WeekFactory', 'RolesFactory', 'UserInformation',
    function(BetService, WeekFactory, RolesFactory, UserInformation) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            week: '=',
            bets: '=',
            errorObject: '=',
            refreshBets: '&'
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
                    return (event.awayScore || event.awayScore == 0) && (event.homeScore || event.homeScore == '0') &&
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

            scope.updateResults = function () {
                WeekFactory.updateResults(scope.week.events, scope.week._id, function () {
                    console.log('scored updated');
                });
            }

            scope.$on('$destroy', function () {
                scope.BetService = null;
            });

        }
    }
}]);
