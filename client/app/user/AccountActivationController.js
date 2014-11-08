
userModule

.controller('AccountActivationController', [
'$scope', 'ActivationFactory', 'UserInformation', '$location',
function ($scope, ActivationFactory, UserInformation, $location) {

    $scope.inputs = {
        registrationCode: ''
    };

    $scope.ActivationFactory = ActivationFactory;

    $scope.activate = function () {
        ActivationFactory.activate(
            $scope.inputs.registrationCode,
            function (user) {
                // on success
                UserInformation.setUserDetails(user);
                $location.path('');
            },
            function () {
                // on error
            }
        );
    }

    $scope.resend = function () {

        var setMessage = function (data) {
            $scope.resendMessage = data.message;
        }

        ActivationFactory.resendRegistrationCode(
            setMessage, setMessage
        );
    }

}
]);
