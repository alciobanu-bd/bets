
chatModule
.controller('ChatboxesController', [
'$scope', 'ChatMessage', 'ChattingService', 'UserInformation', 'SoundPlayer', 'Settings',
function ($scope, ChatMessage, ChattingService, UserInformation, SoundPlayer, Settings) {

    $scope.getMarginRight = function (index) {
        return index * Settings.chat.chatboxWidth + "px";
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

    ChatMessage.onConversationMoreMessages(function (data) {
        $scope.$apply(function () {
            ChattingService.updateChatboxWithMoreMessages(data);
        });
    });

    $scope.$watch('userInfo.isLogged', function () {
        if (!$scope.userInfo.isLogged) {
            ChattingService.reset();
        }
    });

}
]);
