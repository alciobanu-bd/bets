
adminModule

.controller('AdminPanelController', [
'$scope', 'RolesFactory', 'UserInformation', 'RoutesFactory',
function ($scope, RolesFactory, UserInformation, RoutesFactory) {

    $scope.RolesFactory = RolesFactory;

    $scope.tabs = [
        {
            name: "Users",
            active: true,
            templateUrl: 'app/admin/views/usersPanel.html'
        },
        {
            name: "Ranking",
            active: false,
            templateUrl: 'app/admin/views/rankingPanel.html'
        }
    ];

    $scope.activeTab = function () {
        return _.find($scope.tabs, function (tab) {
            return tab.active;
        });
    }

    $scope.activateTab = function (tabParam) {
        for (var i in $scope.tabs) {
            var tab = $scope.tabs[i];
            tab.active = false;
        }
        tabParam.active = true;
    }

}
]);
