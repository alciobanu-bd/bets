betsModule
.controller('MainController',[
'$scope', 'Templates', 'UserInformation', '$location',
function ($scope, Templates, UserInfo, $location) {

    $scope.Templates = Templates;
    $scope.userInfo = UserInfo;

    $scope.currentBodyView = '';


    $scope.goToLogin = function () {
        $scope.currentBodyView = Templates.user.login;
        $location.path('login');
    }

    $scope.goToRegister = function () {
        $scope.currentBodyView = Templates.user.register;
        $location.path('register');
    }

    $scope.goToHome = function () {
        $scope.currentBodyView = '';
        $location.path('login');
    }

}
]);