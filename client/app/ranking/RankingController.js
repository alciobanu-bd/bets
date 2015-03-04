
rankingModule
.controller('RankingController', [
'$scope', 'RankingFactory', '$modal', 'Settings',
function ($scope, RankingFactory, $modal, Settings) {

    $scope.RankingFactory = RankingFactory;
    RankingFactory.fetchRanking();

    $scope.searchedUser = "";
    $scope.limitUsersTo = Settings.ranking.limitUsers;

    $scope.loadMore = function () {
        $scope.limitUsersTo += Settings.ranking.limitUsers;
    }

    var getUserByUsername = function (username) {
        for (var i = 0; i < RankingFactory.ranking.length; i++) {
            if (RankingFactory.ranking[i].username == username) {
                return RankingFactory.ranking[i];
            }
        }
        return null;
    }

    $scope.openUserModalOnEnter= function(ev) {
        if (ev.keyCode != 13) {
            return;
        }

        var user = getUserByUsername($scope.searchedUser);

        if (!user) {
            return;
        }

        $scope.openModal(user);
    }

    $scope.openModal = function (user) {
        var modalInstance = $modal.open({
            templateUrl: 'app/ranking/views/userRanking.html',
            controller: 'ProfileRankingView',
            resolve: {
                user: function () {
                    return user;
                }
            }
        });
    }

    $scope.downloadAsPdf = function () {

        var doc = new jsPDF();

        doc.setFontSize(22);
        doc.setTextColor(100);
        doc.text(20, 20, 'Ranking');

        var startingLine = 40;
        var step = 10;

        doc.setFontSize(16);

        for (var i = 0; i < RankingFactory.ranking.length; i++) {
            var user = RankingFactory.ranking[i];
            var text = user.place + ". " + user.username + "  (" + user.points + " points, " +
                user.avgPoints.toFixed(2) + "% on average)";
            doc.text(20, startingLine, text);
            startingLine += step;
        }

        doc.save('Ranking.pdf');

    }

}
]
);

rankingModule
.controller('ProfileRankingView', [
    '$scope', '$modalInstance', 'user', 'RolesFactory', 'UserInformation', 'Languages', 'Gravatar', 'ChattingService',
    function ($scope, $modalInstance, user, RolesFactory, UserInformation, Languages, Gravatar, ChattingService) {

        $scope.RolesFactory = RolesFactory;
        $scope.userInfo = UserInformation;
        $scope.Languages = Languages;
        $scope.user = user;
        $scope.Gravatar = Gravatar;

        $scope.openChatbox = function () {
            ChattingService.createActiveConversationBox({
                _id: user._id,
                username: user.username
            });
            $scope.cancel();
        }

        $scope.cancel = function () {
            $modalInstance.close("closed");
        }

        $scope.viewUserHistory = function () {
            $scope.cancel();
        }

    }
]);
