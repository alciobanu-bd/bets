
weekModule

.directive('week', [
    'BetService',
    function(BetService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            week: '=',
            bets: '='
        },
        templateUrl: "app/week/views/weekDirective.html",
        link: function(scope, element, attrs) {

            scope.BetService = BetService.newBetManager();
            scope.BetService.resetBetService();

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
                        console.log(event);
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

                    console.log(scope.week);
                    console.log(scope.bets);
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
                    return parseInt(event.awayScore) != NaN && parseInt(event.homeScore);
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
                });

            }

            scope.week = {
                showConfirm: false
            };
            scope.showConfirm = function () {
                scope.week.showConfirm = true;
            }

            scope.hideConfirm = function () {
                scope.week.showConfirm = false;
            }

            scope.$on('$destroy', function () {
                scope.BetService = null;
            });

        }
    }
}]);
