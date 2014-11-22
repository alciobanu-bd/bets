
profileModule

.controller('ProfileController', [
'$scope', 'UserInformation', 'ProfileFactory', 'RolesFactory', 'InitUrls', 'CallUrlService', '$translate',
function ($scope, UserInformation, ProfileFactory, RolesFactory, InitUrls, CallUrlService, $translate) {

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
                $scope.status.message = $translate.instant('profilePage.yourPreferencesSaved');
                $scope.status.inProgress = false;

                UserInformation.setUserDetails(data);

            },
            function () {
                $scope.status.success = false;
                $scope.status.error = true;
                $scope.status.message = $translate.instant('profilePage.yourPreferencesDidntSaved');
                $scope.status.inProgress = false;
            });
        });

    }

}
]);
