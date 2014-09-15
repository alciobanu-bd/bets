
weekModule

.directive('week', [
    'BetFactory',
    function(BetFactory) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            week: '='
        },
        templateUrl: "app/week/views/weekDirective.html",
        link: function(scope, element, attrs) {

            var getEvents = function () {

                return _.map(scope.week.events, function (event) {
                    var newEvent = {};
                    angular.extend(newEvent, event);
                    delete newEvent.homeTeam;
                    delete newEvent.awayTeam;
                    delete newEvent.startDate;
                    return newEvent;
                });

            }

            scope.place = function () {

                var events = getEvents();
                var weekNumber = scope.week.number;

                BetFactory.place({
                    scores: events,
                    weekNumber: weekNumber
                });

            }

        }
    }
}]);
