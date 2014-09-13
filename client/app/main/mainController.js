betsModule
.controller('MainController',[
'$scope', 'Templates', 'UserInformation', '$location', 'WeekFactory',
function ($scope, Templates, UserInfo, $location, WeekFactory) {

    $scope.Templates = Templates;
    $scope.userInfo = UserInfo;
    $scope.WeekFactory = WeekFactory;

    WeekFactory.resetWeekFactory();
    WeekFactory.fetchCurrentWeek();

    $scope.goHome = function () {
        if ($scope.userInfo.isLogged) {
            $scope.currentBodyView = Templates.welcome.logged;
        }
        else {
            $scope.currentBodyView = Templates.welcome.notLogged;
        }
        $location.path($scope.currentBodyView.route);
    }
    $scope.goHome();

    $scope.goToLogin = function () {
        $scope.currentBodyView = Templates.user.login;
        $location.path($scope.currentBodyView.route);
    }

    $scope.goToRegister = function () {
        $scope.currentBodyView = Templates.user.register;
        $location.path($scope.currentBodyView.route);
    }

    $scope.goToRanking = function () {
        $scope.currentBodyView = Templates.ranking;
        $location.path($scope.currentBodyView.route);
    }

    $scope.goToWeek = function () {
        $scope.currentBodyView = Templates.week;
        $location.path($scope.currentBodyView.route);
    }

}
]);