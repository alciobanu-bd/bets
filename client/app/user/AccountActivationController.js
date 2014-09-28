
userModule

.controller('AccountActivationController', [
'$scope', 'ActivationFactory', 'RoutesFactory', 'UserInformation',
function ($scope, ActivationFactory, RoutesFactory, UserInformation) {

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

}
]);
