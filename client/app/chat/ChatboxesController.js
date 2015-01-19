
chatModule
.controller('ChatboxesController', [
'$scope', 'ChatMessage', 'ChattingService', 'UserInformation',
function ($scope, ChatMessage, ChattingService, UserInformation) {

    $scope.getMarginRight = function (index) {
        return index * 255 + "px";
    }

    $scope.userInfo = UserInformation;
    $scope.ChattingService = ChattingService;

    ChatMessage.onPrivateMessage(function (data) {
        $scope.$apply(function () {
            ChattingService.addReceivedMessage(data);
        });
    });

    ChatMessage.onInboxUpdate(function (data) {
        $scope.$apply(function () {
            ChattingService.updatePassiveBoxes(data.inbox);
        });
    });

    $scope.$watch('userInfo.isLogged', function () {
        if (!$scope.userInfo.isLogged) {
            ChattingService.reset();
        }
    });

}
]);
