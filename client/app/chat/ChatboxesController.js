
chatModule
.controller('ChatboxesController', [
'$scope', 'ChatMessage', 'ChattingService', 'UserInformation', 'SoundPlayer',
function ($scope, ChatMessage, ChattingService, UserInformation, SoundPlayer) {

    $scope.getMarginRight = function (index) {
        return index * 255 + "px";
    }

    $scope.userInfo = UserInformation;
    $scope.ChattingService = ChattingService;

    ChatMessage.onPrivateMessage(function (data) {
        $scope.$apply(function () {
            ChattingService.addReceivedMessage(data);
            SoundPlayer.onNewMessage();
        });
    });

    ChatMessage.onInboxUpdate(function (data) {
        $scope.$apply(function () {
            ChattingService.updatePassiveBoxes(data);
        });
    });

    $scope.$watch('userInfo.isLogged', function () {
        if (!$scope.userInfo.isLogged) {
            ChattingService.reset();
        }
    });

}
]);
