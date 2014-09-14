
weekModule

.controller('WeekController', [
'$scope', 'WeekFactory', 'RolesFactory', 'UserInformation',
function ($scope, WeekFactory, RolesFactory, UserInformation) {

    $scope.WeekFactory = WeekFactory;
    WeekFactory.resetWeekFactory();
    WeekFactory.fetchCurrentWeek();
    WeekFactory.fetchBeforeCurrentWeek();

    $scope.userInfo = UserInformation;
    $scope.RolesFactory = RolesFactory;
}
])

;
