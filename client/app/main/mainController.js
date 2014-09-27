betsModule
.controller('MainController',[
'$scope', 'Templates', 'UserInformation', 'RoutesFactory', 'UserInformationCalls',
function ($scope, Templates, UserInfo, RoutesFactory, UserInformationCalls) {
    /**
     * UserInformationCalls is injected because it sets the user information.
     */


    $scope.Templates = Templates;
    $scope.userInfo = UserInfo;
    $scope.RoutesFactory = RoutesFactory;

    RoutesFactory.goHome();

}
]);