
userModule
.controller(
'ResetPasswordController', [
'$scope', 'InitUrls', 'CallUrlService', 'SHA-2', '$routeParams', '$translate',
function ($scope, InitUrls, CallUrlService, SHA2, $routeParams, $translate) {

    $scope.inputs = {
        code: '',
        newPassword: '',
        confirmPassword: ''
    };

    $scope.status = {
        inProgress: false,
        success: false,
        error: false,
        message: ''
    };

    if ($routeParams.code) {
        $scope.inputs.code = $routeParams.code;
    }

    $scope.resetPassword = function () {
        $scope.status.inProgress = true;

        InitUrls.then(function (urls) {

            CallUrlService.post({uri: urls.auth.resetSalt},
                {code: $scope.inputs.code},
                function (data) {
                    var salt = data.salt;

                    var newPwHash = SHA2.sha256($scope.inputs.newPassword + salt);
                    var confirmPwHash = SHA2.sha256($scope.inputs.confirmPassword + salt);

                    CallUrlService.post({uri: urls.user.resetPassword},
                        {
                            code: $scope.inputs.code,
                            newPassword: newPwHash,
                            confirmPassword: confirmPwHash
                        },
                        function (data) {
                            $scope.status.success = true;
                            $scope.status.error = false;
                            $scope.status.message = $translate.instant('resetPasswordPage.resetSuccessful');
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
                                $scope.status.message = $translate.instant('resetPasswordPage.couldntReset');
                            }
                            $scope.status.inProgress = false;
                        }
                    );

                },
                function (response) {
                    $scope.status.success = false;
                    $scope.status.error = true;
                    $scope.status.message = $translate.instant('resetPasswordPage.couldntReset');
                    $scope.status.inProgress = false;
                });
        });

    }

}
]);
