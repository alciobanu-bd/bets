
historyModule

.controller('HistoryController', [
'$scope', 'HistoryFactory',
function ($scope, HistoryFactory) {

    $scope.HistoryFactory = HistoryFactory;
    HistoryFactory.loadHistory();

}
]);
