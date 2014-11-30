
chatModule

.directive('chatBox', [
'ChatMessage', 'ChattingService',
function(ChatMessage, ChattingService) {
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
            ChatMessage.sendPrivateMessage(scope.conversation.with._id, scope.currentMessage);
            scope.currentMessage = "";
        }

        scope.sendMessageOnEnterKey = function (event) {
            if (event.keyCode == 13) {
                sendMessage();
            }
        }

        scope.closeThisBox = function () {
            ChattingService.deleteConversationBox(scope.conversation);
        }

    }
}
}]);
