
userModule

.controller
('ChangePasswordController', [
'$scope', 'InitUrls', 'CallUrlService', '$timeout', 'SHA-2', 'UserInformation',
function ($scope, InitUrls, CallUrlService, $timeout, SHA2, UserInformation) {

    $scope.clearUserDetailsInterval();

    $scope.inputs = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    $scope.status = {
        success: false,
        error: false,
        inProgress: false,
        message: ''
    };

    $scope.changePassword = function () {

        $scope.status.inProgress = true;

        InitUrls.then(function (urls) {

            CallUrlService.post({uri: urls.auth.salt},
            {username: UserInformation.user.username},
            function (data) {
                var salt = data.salt;

                var oldPwHash = SHA2.sha256($scope.inputs.oldPassword + salt);
                var newPwHash = SHA2.sha256($scope.inputs.newPassword + salt);
                var confirmPwHash = SHA2.sha256($scope.inputs.confirmPassword + salt);

                CallUrlService.post({uri: urls.user.changePassword},
                    {
                        oldPassword: oldPwHash,
                        newPassword: newPwHash,
                        confirmPassword: confirmPwHash
                    },
                    function (data) {
                        $scope.startUserDetailsInterval();
                        $scope.status.success = true;
                        $scope.status.error = false;
                        $scope.status.message = "Your password was changed successfully. Please check your e-mail.";
                        $scope.status.inProgress = false;
                    },
                    function (response) {
                        $scope.startUserDetailsInterval();
                        $scope.status.success = false;
                        $scope.status.error = true;
                        if (response.data.message) {
                            $scope.status.message = response.data.message;
                        }
                        else {
                            $scope.status.message = "We couldn't change your password. Please try again.";
                        }
                        $scope.status.inProgress = false;
                    }
                );

            },
            function (response) {
                $scope.status.success = false;
                $scope.status.error = true;
                $scope.status.message = "We couldn't change your password. Please try again.";
                $scope.status.inProgress = false;
            });
        });
    }

}
])
