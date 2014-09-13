
rankingModule
.controller('RankingController', [
'$scope', 'RankingFactory',
function ($scope, RankingFactory) {

    $scope.RankingFactory = RankingFactory;
    RankingFactory.fetchRanking();

}
]
);
