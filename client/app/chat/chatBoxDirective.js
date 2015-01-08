
chatModule

.directive('chatBox', [
'ChatMessage', 'ChattingService', 'UserInformation',
function(ChatMessage, ChattingService, UserInformation) {
return {
    restrict: 'E',
    replace: true,
    scope: {
        conversation: '='
    },
    templateUrl: "app/chat/views/chatBox.html",
    link: function(scope, element, attrs) {

        scope.currentMessage = "";

        var sendMessage = function () {
            ChatMessage.sendPrivateMessage({
                _id: scope.conversation.with._id,
                username: scope.conversation.with.username
            }, scope.currentMessage);
            ChattingService.addOwnSentMessage(scope.conversation,
            { // from
                _id: UserInformation.user._id,
                username: UserInformation.user.username
            },
            { // to
                _id: scope.conversation.with._id,
                username: scope.conversation.with.username
            },
            scope.currentMessage);

            scope.currentMessage = "";
        }

        scope.sendMessageOnEnterKey = function (event) {
            if (event.keyCode == 13) {
                sendMessage();
            }
        }

        scope.markConversationAsRead = function () {
            ChattingService.markBoxAsRead(scope.conversation);
            var lastMessage = ChattingService.getLastMessageOfConversation(scope.conversation);
            var from = lastMessage.from._id != UserInformation.user._id ? lastMessage.from : scope.conversation.with;
            ChatMessage.iVeReadMyMessagesUntilDate(lastMessage.date, from);
        }

        scope.closeThisBox = function () {
            ChattingService.deleteConversationBox(scope.conversation);
        }

    }
}
}]);
