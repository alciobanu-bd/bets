betsModule
.controller('MainController',[
'$scope', 'Templates', 'UserInformation', '$location', 'InitUrls',
function ($scope, Templates, UserInfo, $location, InitUrls) {

    $scope.Templates = Templates;
    $scope.userInfo = UserInfo;

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

}
]);