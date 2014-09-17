
weekModule

.directive('week', [
    'BetService',
    function(BetService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            week: '='
        },
        templateUrl: "app/week/views/weekDirective.html",
        link: function(scope, element, attrs) {

            scope.BetService = BetService.newBetManager();
            scope.BetService.resetBetService();

            scope.$on('$destroy', function () {
                scope.BetService = null;
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

        }
    }
}]);
