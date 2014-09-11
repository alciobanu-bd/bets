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
        validatePassword: {
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
        error: false
    };

    var resetStatus = function () {
        $scope.status.success = false;
        $scope.status.error = false;
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

                $scope.status.error = true;

                if (response.name == "ValidationError") {
                    // mongoose validation
                    $scope.status.message = 'Account wasn\'t created. Highlighted fields are required.';

                    for (var i in response.errors) {
                        $scope.inputs[response.errors[i]].error = true;
                    }

                }
                else {
                    $scope.status.message = response.message;
                    for (var i in response.errorFields) {
                        $scope.inputs[response.errorFields[i]].error = true;
                    }
                }

            }
            );

        });
    }

}]);