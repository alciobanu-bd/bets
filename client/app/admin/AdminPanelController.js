
adminModule

.controller('AdminPanelController', [
'$scope', 'RolesFactory',
function ($scope, RolesFactory) {

    $scope.RolesFactory = RolesFactory;

    $scope.tabs = [
        {
            name: "adminPanelPage.users",
            active: true,
            templateUrl: 'app/admin/views/usersPanel.html'
        },
        {
            name: "adminPanelPage.ranking",
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
