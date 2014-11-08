betsModule
.controller('MainController',[
'$scope', 'Templates', 'UserInformation', 'UserInformationCalls', 'UserInformation', '$interval',
'Settings', '$location',
function ($scope, Templates, UserInfo, UserInformationCalls, UserInformation, $interval,
Settings, $location) {
    /**
     * UserInformationCalls is injected because it sets the user information.
     */

    $scope.Templates = Templates;
    $scope.userInfo = UserInformation;

    var refreshUserDetails = function () {
        if (!UserInformation.isLogged) {
            return;
        }
        UserInformationCalls.fetchUserDetails();
    }

    var extendToken = function () {
        if (!UserInformation.isLogged) {
            return;
        }
        UserInformationCalls.extendTokenExpiration();
    }

    refreshUserDetails();
    var userDetailsInterval = undefined;

    $interval(extendToken, Settings.user.tokenRefreshInterval);

    $scope.startUserDetailsInterval = function () {
        userDetailsInterval = $interval(refreshUserDetails, Settings.user.detailsRefreshInterval, 0, true);
    }

    $scope.clearUserDetailsInterval = function () {
        if (userDetailsInterval) {
            $interval.cancel(userDetailsInterval);
        }
    }

    $scope.startUserDetailsInterval();

}
]);