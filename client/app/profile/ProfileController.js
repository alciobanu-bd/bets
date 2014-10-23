
profileModule

.controller('ProfileController', [
'$scope', 'UserInformation', 'ProfileFactory', 'RolesFactory', 'InitUrls', 'CallUrlService',
function ($scope, UserInformation, ProfileFactory, RolesFactory, InitUrls, CallUrlService) {

    $scope.userInfo = UserInformation;
    $scope.ProfileFactory = ProfileFactory;
    $scope.RolesFactory = RolesFactory;

    ProfileFactory.loadProfile($scope.userInfo.user._id);

    $scope.userModel = {
        isMailNotificationOn: UserInformation.user.isMailNotificationOn
    };

    $scope.status = {
        inProgress: false,
        success: false,
        error: false,
        message: ''
    };

    $scope.updateProfile = function () {

        $scope.status.inProgress = true;

        InitUrls.then(function (urls) {
            CallUrlService.put({uri: urls.user.address, id: UserInformation.user._id}, $scope.userModel,
            function (data) {
                $scope.status.success = true;
                $scope.status.error = false;
                $scope.status.message = "Your preferences were saved.";
                $scope.status.inProgress = false;

                UserInformation.setUserDetails(data);

            },
            function () {
                $scope.status.success = false;
                $scope.status.error = true;
                $scope.status.message = "We couldn't save your preferences. Sorry 'bout that.";
                $scope.status.inProgress = false;
            });
        });

    }

}
]);
