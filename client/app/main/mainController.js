betsModule
.controller('MainController',[
'$scope', 'Templates', 'UserInformation', 'RoutesFactory',
function ($scope, Templates, UserInfo, RoutesFactory) {

    $scope.Templates = Templates;
    $scope.userInfo = UserInfo;
    $scope.RoutesFactory = RoutesFactory;

    RoutesFactory.goHome();
    $scope.currentBodyView = RoutesFactory.currentBodyView;

}
]);