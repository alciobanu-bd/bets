
userModule

.controller('UserController', [
'$scope', 'UserInformation', 'InitUrls',
function ($scope, UserInformation, InitUrls) {

    $scope.userInfo = UserInformation;

    $scope.inputs = {
        username: {
            model: ''
        },
        password: {
            model: ''
        }
    }

    $scope.login = function () {

        InitUrls.get({}, function (data) {
            var credentials = _.object(_.map($scope.inputs, function (item, key) {
                return [key, item.model];
            }));
            UserInformation.login(data, credentials);
        });

    }

}
]
);
