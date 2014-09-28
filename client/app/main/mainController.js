betsModule
.controller('MainController',[
'$scope', 'Templates', 'UserInformation', 'RoutesFactory', 'UserInformationCalls', 'UserInformation',
function ($scope, Templates, UserInfo, RoutesFactory, UserInformationCalls, UserInformation) {
    /**
     * UserInformationCalls is injected because it sets the user information.
     */


    $scope.Templates = Templates;
    $scope.userInfo = UserInfo;
    $scope.RoutesFactory = RoutesFactory;

    RoutesFactory.goHome();

}
]);