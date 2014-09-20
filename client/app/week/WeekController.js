
weekModule

.controller('WeekController', [
'$scope', 'WeekFactory', 'RolesFactory', 'UserInformation',
function ($scope, WeekFactory, RolesFactory, UserInformation) {

    $scope.WeekFactory = WeekFactory;
    WeekFactory.resetWeekFactory();
    WeekFactory.fetchCurrentWeek(
    function (weekWithRealScores) {
        $scope.currentWeekWithScores = {};
        angular.extend($scope.currentWeekWithScores, weekWithRealScores);
    },
    function () {
        WeekFactory.fetchCurrentWeekBet();
    });
    WeekFactory.fetchBeforeCurrentWeek(
    function (weekWithRealScores) {
        $scope.beforeCurrentWeekWithScores = {};
        angular.extend($scope.beforeCurrentWeekWithScores, weekWithRealScores);
    },
    function () {
        WeekFactory.fetchBeforeCurrentWeekBet();
    });

    $scope.refreshBets = function () {
        WeekFactory.fetchCurrentWeekBet();
        WeekFactory.fetchBeforeCurrentWeekBet();
    }

    $scope.userInfo = UserInformation;
    $scope.RolesFactory = RolesFactory;
}
])

;
