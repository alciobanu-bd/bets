betsModule
.controller('MainController',[
'$scope', 'Templates', 'UserInformation', '$location',
function ($scope, Templates, UserInfo, $location) {

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

    $scope.goToHome = function () {
//        $scope.currentBodyView = '';
        $location.path($scope.currentBodyView.route);
    }

}
]);