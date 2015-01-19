
chatModule

.controller('MessagesController', [
'$scope', 'ChattingService', 'UserInformation',
function ($scope, ChattingService, UserInformation) {

    $scope.openChatBox = function (msg) {
        ChattingService.createConversationBox(msg.from._id != UserInformation.user._id ? msg.from : msg.to);
    }

}
]);
