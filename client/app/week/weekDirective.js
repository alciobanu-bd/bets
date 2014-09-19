
weekModule

.directive('week', [
    'BetService',
    function(BetService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            week: '=',
            bets: '=',
            errorObject: '='
        },
        templateUrl: "app/week/views/weekDirective.html",
        link: function(scope, element, attrs) {

            scope.resetBetManager = function () {
                scope.BetService = BetService.newBetManager();
                scope.BetService.resetBetService();
            }

            scope.resetBetManager();

            scope.$watch('bets', function () {

                if (scope.bets) {
                    // bet loaded

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

                    for (var i in scope.week.events) {
                        var event = scope.week.events[i];
                        event = _.map();
                    }

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

                scope.BetService.place({
                    scores: events,
                    weekNumber: weekNumber
                },
                function () { // on success
                    scope.errorObject.active = false;
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

            scope.$on('$destroy', function () {
                scope.BetService = null;
            });

        }
    }
}]);
