
adminModule

.controller('AdminRankingPanel', [
'$scope', 'CallUrlService', 'InitUrls',
function ($scope, CallUrlService, InitUrls) {

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
                $scope.status.message = "Points and places were recalculated successfully.";
                $scope.status.error = false;
                $scope.status.success = true;
                $scope.status.inProgress = false;
            },
            function (response) {
                if (response.data.message) {
                    $scope.status.message = response.data.message;
                }
                else {
                    $scope.status.message = "The recalculation wasn't completed successfully. " +
                        "Please try again and, if problem persists, contact a developer.";
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
