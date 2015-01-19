
chatModule

.directive('chatBox', [
'ChatMessage', 'ChattingService', 'UserInformation', '$timeout', 'Settings',
function(ChatMessage, ChattingService, UserInformation, $timeout, Settings) {
return {
    restrict: 'E',
    replace: true,
    scope: {
        conversation: '='
    },
    templateUrl: "app/chat/views/chatBox.html",
    link: function(scope, element, attrs) {

        scope.userInfo = UserInformation;

        var scrollContentToBottom = function () {
            $timeout(function () {
                var chatboxDiv = document.getElementById("chatbox-content-" + scope.conversation.id);
                chatboxDiv.scrollTop = chatboxDiv.scrollHeight;
            }, 0);
        }

        var focusTopDiv = function () {
            $timeout(function () {
                var chatboxTopDiv = document.getElementById("chatbox-top-div-" + scope.conversation.id);
                chatboxTopDiv.focus();
            }, 0);
        }

        scope.focusInput = function () {
            $timeout(function () {
                var chatboxInput = document.getElementById("chatbox-input-" + scope.conversation.id);
                chatboxInput.focus();
            }, 0);
        }

        scope.focusInput();

        var isContentBoxScrolledToBottom = function () {
            var chatboxDiv = document.getElementById("chatbox-content-" + scope.conversation.id);
            if (chatboxDiv.scrollTop + chatboxDiv.offsetHeight >= chatboxDiv.scrollHeight) {
                return true;
            }
            return false;
        }

        scrollContentToBottom();

        scope.conversation.onMessageReceived = function () {
            if (isContentBoxScrolledToBottom()) {
                scrollContentToBottom();
            }
        }

        scope.currentMessage = "";

        var sendMessage = function () {

            if (scope.currentMessage.trim() == "") {
                return;
            }

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

            scrollContentToBottom();

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

        scope.closeBoxOnEsc = function (event) {
            if (event.keyCode == 27) {
                scope.closeThisBox();
            }
            scope.markConversationAsRead();
        }

    }
}
}]);
