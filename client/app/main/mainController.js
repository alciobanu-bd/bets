betsModule
.controller('MainController',[
'$scope', 'Templates', 'UserInformation', 'UserInformationCalls', 'UserInformation', '$interval',
'Settings','$routeParams', '$location', 'ServerDate',
function ($scope, Templates, UserInfo, UserInformationCalls, UserInformation, $interval,
Settings, $routeParams, $location, ServerDate) {
    /**
     * UserInformationCalls is injected because it sets the user information.
     */

    $scope.Templates = Templates;
    $scope.userInfo = UserInformation;

    var refreshUserDetails = function () {
        UserInformation.ready(function () {
            if (!UserInformation.isLogged) {
                return;
            }
            UserInformationCalls.fetchUserDetails();
        });
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


    var countWatchers = function () {
        var root = $(document.getElementsByTagName('body'));
        var watchers = [];

        var f = function (element) {
            if (element.data().hasOwnProperty('$scope')) {
                angular.forEach(element.data().$scope.$$watchers, function (watcher) {
                    watchers.push(watcher);
                });
            }

            angular.forEach(element.children(), function (childElement) {
                f($(childElement));
            });
        };

        f(root);

        console.log("Watchers: " + watchers.length);
    }

    window.onload = countWatchers;
    $interval(countWatchers, 10000);

}
]);