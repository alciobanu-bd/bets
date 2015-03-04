
chatModule

.directive('chatBox', [
'ChatMessage', 'ChattingService', 'UserInformation', '$timeout', 'Gravatar', 'InitUrls', 'CallUrlService',
'MessageIdGenerator',
function(ChatMessage, ChattingService, UserInformation, $timeout, Gravatar, InitUrls, CallUrlService,
MessageIdGenerator) {
return {
    restrict: 'E',
    replace: true,
    scope: {
        conversation: '='
    },
    templateUrl: "app/chat/views/chatBox.html",
    link: function(scope, element, attrs) {

        scope.userInfo = UserInformation;
        var partnerUser = null;

        InitUrls.then(function (urls) {
            CallUrlService.get({uri: urls.user.address, id: scope.conversation.with._id},
            function (user) {
                partnerUser = user;
                scope.gravatarUrl = Gravatar.getImageUrl(user.email, 100);
            },
            function () {
                scope.gravatarUrl = Gravatar.getImageUrl("fake.mail@mail.com", 30);
            });
        });

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

        var isContentBoxScrolledToTop = function () {
            var chatboxDiv = document.getElementById("chatbox-content-" + scope.conversation.id);
            if (chatboxDiv.scrollTop <= 0) {
                return true;
            }
            return false;
        }

        var scrollContentAfterNewMessages = function () {
            $timeout(function () {
                var chatboxDiv = document.getElementById("chatbox-content-" + scope.conversation.id);
                chatboxDiv.scrollTop = chatboxDiv.scrollHeight / 4;
            }, 0);
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

            var clientGeneratedId = MessageIdGenerator.generateId(UserInformation.user._id, scope.currentMessage);

            ChatMessage.sendPrivateMessage({
                _id: scope.conversation.with._id,
                username: scope.conversation.with.username
            }, scope.currentMessage, clientGeneratedId);
            ChattingService.addOwnSentMessage(scope.conversation,
            { // from
                _id: UserInformation.user._id,
                username: UserInformation.user.username
            },
            { // to
                _id: scope.conversation.with._id,
                username: scope.conversation.with.username
            },
            scope.currentMessage, clientGeneratedId);

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
            if (!lastMessage) {
                return;
            }
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


        var endOfList = false;
        ChattingService.iWantToBeNotifiedWhenConversationMessagesListIsEmpty(function () {
            endOfList = true;
        });

        ChattingService.iWantToBeNotifiedWhenConversationUpdateFunctionEnds(function () {
            scrollContentAfterNewMessages();
        });

        var loadMore = function () {

            ChatMessage.loadMoreConversationMessages(scope.conversation);

        }

        scope.tryToLoadMore = function () {

            if (!isContentBoxScrolledToTop() || endOfList) {
                return;
            }

            loadMore();
        }

    }
}
}]);
