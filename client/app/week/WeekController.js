
weekModule

.controller('WeekController', [
'$scope', 'WeekFactory', 'RolesFactory', 'UserInformation',
function ($scope, WeekFactory, RolesFactory, UserInformation) {

    $scope.WeekFactory = WeekFactory;
    WeekFactory.resetWeekFactory();
    WeekFactory.fetchCurrentWeek(function () {
        WeekFactory.fetchCurrentWeekBet();
    });
    WeekFactory.fetchBeforeCurrentWeek(function () {
        WeekFactory.fetchBeforeCurrentWeekBet();
    });

    $scope.userInfo = UserInformation;
    $scope.RolesFactory = RolesFactory;
}
])

;
