
profileModule

.controller('ProfileController', [
'$scope', 'UserInformation', 'ProfileFactory', 'RolesFactory', 'InitUrls', 'CallUrlService', '$translate',
'Languages', 'CurrentLanguageFactory',
function ($scope, UserInformation, ProfileFactory, RolesFactory, InitUrls, CallUrlService, $translate,
Languages, CurrentLanguageFactory) {

    $scope.userInfo = UserInformation;
    $scope.ProfileFactory = ProfileFactory;
    $scope.RolesFactory = RolesFactory;
    $scope.Languages = Languages;

    ProfileFactory.loadProfile($scope.userInfo.user._id);

    $scope.userModel = {
        isMailNotificationOn: UserInformation.user.isMailNotificationOn,
        language: UserInformation.user.language
    };

    $scope.setLanguage = function (lang) {
        $scope.userModel.language = lang;
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

                CurrentLanguageFactory.setLanguage($scope.userModel.language);

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
