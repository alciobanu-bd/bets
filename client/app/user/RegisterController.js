userModule
.controller('RegisterController', [
'$scope', 'InitUrls', 'CallUrlService',
function ($scope, InitUrls, CallUrlService) {

    $scope.inputs = {
        username: {
            model: '',
            error: false
        },
        password: {
            model: '',
            error: false
        },
        confirmPassword: {
            model: '',
            error: false
        },
        email: {
            model: '',
            error: false
        },
        birthDate: {
            model: '',
            error: false
        }
    };

    $scope.status = {
        success: false,
        error: false,
        message: ''
    };

    var resetStatus = function () {
        $scope.status.success = false;
        $scope.status.error = false;
        $scope.status.message = '';
    }

    var resetInputsError = function () {
        $scope.inputs = _.object(_.map($scope.inputs, function (item, key) {
            item.error = false;
            return [key, item];
        }));
    }

    $scope.register = function () {

        resetStatus();
        resetInputsError();

        InitUrls.get(function (data) {
            var urls = data;

            var accountData = _.object(_.map($scope.inputs, function (item, key) {
                return [key, item.model];
            }));

            CallUrlService.post({uri: urls.user.address}, accountData,
            function (data) {
                $scope.status.success = true;
                $scope.status.message = data.message;
            },
            function (response) {

                response = response.data;
                $scope.status.error = true;

                if (response.name == "ValidationError") {
                    // mongoose validation
                    $scope.status.message = 'Account wasn\'t created. Highlighted fields are required.';

                    for (var i in response.errors) {
                        $scope.inputs[i].error = true;
                    }

                    if ($scope.inputs.password.error) {
                        $scope.inputs.confirmPassword.error = true;
                    }

                }
                else {
                    $scope.status.message = response.message;
                    for (var i in response.errorFields) {
                        $scope.inputs[i].error = true;
                    }
                }

            }
            );

        });
    }

}]);