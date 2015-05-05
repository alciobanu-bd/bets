
teamModule
.controller('TeamProfileController', [
'$scope', '$routeParams', 'TeamFactory', 'CountryCodes',
function ($scope, $routeParams, TeamFactory, CountryCodes) {

    $scope.CountryCodes = CountryCodes;

    $scope.status = {
        error: false,
        inProgress: true,
        message: false
    };

    TeamFactory.getTeamById($routeParams.id,
    function (team) {
        $scope.team = team;
    },
    function (response) {

    });

}
]);
