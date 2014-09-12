betsModule

.controller('WelcomeController', [
'$scope', 'UserInformation', 'InitUrls',
function ($scope, UserInformation, InitUrls) {

    $scope.userInfo = UserInformation;

}
]
);