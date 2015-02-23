
userModule

.controller('AccountActivationController', [
'$scope', 'ActivationFactory', 'UserInformation', '$location', 'Socket', 'ChattingService',
function ($scope, ActivationFactory, UserInformation, $location, Socket, ChattingService) {

    Socket.getSocket().then(function () {
        Socket.unregisterMe();
        ChattingService.removeAllBoxes();
    });

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
                Socket.registerMe();
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
