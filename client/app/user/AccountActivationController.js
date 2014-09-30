
userModule

.controller('AccountActivationController', [
'$scope', 'ActivationFactory', 'RoutesFactory', 'UserInformation', 'ActivationFactory',
function ($scope, ActivationFactory, RoutesFactory, UserInformation, ActivationFactory) {

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
                RoutesFactory.goHome();
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
