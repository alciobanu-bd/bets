betsModule
.controller('MainController',[
'$scope', 'Templates', 'UserInformation', 'RoutesFactory', 'UserInformationCalls', 'UserInformation', '$interval',
'Settings',
function ($scope, Templates, UserInfo, RoutesFactory, UserInformationCalls, UserInformation, $interval,
Settings) {
    /**
     * UserInformationCalls is injected because it sets the user information.
     */


    $scope.Templates = Templates;
    $scope.userInfo = UserInformation;
    $scope.RoutesFactory = RoutesFactory;

    RoutesFactory.goHome();

    var refreshUserDetails = function () {
        if (!UserInformation.isLogged) {
            return;
        }
        UserInformationCalls.fetchUserDetails();
    }

    refreshUserDetails();
    $interval(refreshUserDetails, Settings.user.detailsRefreshInterval, 0, true);

}
]);