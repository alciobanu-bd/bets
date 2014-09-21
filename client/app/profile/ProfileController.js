
profileModule

.controller('ProfileController', [
'$scope', 'UserInformation', 'ProfileFactory', 'RolesFactory',
function ($scope, UserInformation, ProfileFactory, RolesFactory) {

    $scope.userInfo = UserInformation;
    $scope.ProfileFactory = ProfileFactory;
    $scope.RolesFactory = RolesFactory;

    ProfileFactory.loadProfile($scope.userInfo.user._id);

}
]);
