
adminModule

.controller('AdminRankingPanel', [
'$scope', 'CallUrlService', 'InitUrls', '$translate',
function ($scope, CallUrlService, InitUrls, $translate) {

    $scope.status = {
        error: false,
        success: false,
        message: '',
        inProgress: false
    };

    $scope.recalculate = function () {
        $scope.status.inProgress = true;
        InitUrls.then(function (urls) {
            CallUrlService.get({uri: urls.admin.rankingRecalculate},
            function (data) {
                $scope.status.message = $translate.instant('adminPanelPage.rankingPage.pointsCalculatedSuccessfully');
                $scope.status.error = false;
                $scope.status.success = true;
                $scope.status.inProgress = false;
            },
            function (response) {
                if (response.data.message) {
                    $scope.status.message = response.data.message;
                }
                else {
                    $scope.status.message = $translate.instant('adminPanelPage.rankingPage.pointsWerentCalculated');
                }
                $scope.status.error = true;
                $scope.status.success = false;
                $scope.status.inProgress = false;
            }
            );
        });
    }

}
]);
