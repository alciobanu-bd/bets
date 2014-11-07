
rulesModule

.controller('RulesController', [
'$scope', 'RolesFactory', 'Settings',
function ($scope, RolesFactory, Settings) {

    $scope.RolesFactory = RolesFactory;
    $scope.Settings = Settings;

    RolesFactory.load().then(function () {
        if (!RolesFactory.loaded) {
            return;
        }
        $scope.rolesSorted = _.filter(RolesFactory.roles, function (item) {
            return item.name && angular.isDefined(item.description) && angular.isDefined(item.value);
        }).sort(function (role1, role2) {
            return role1.value != role2.value ? role1.value - role2.value : 0;
        });
    });
}
]);
