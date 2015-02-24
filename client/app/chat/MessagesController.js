
chatModule

.controller('MessagesController', [
'$scope', 'ChattingService', 'UserInformation', 'Socket', 'LoginTokenFactory',
function ($scope, ChattingService, UserInformation, Socket, LoginTokenFactory) {

    $scope.openChatBox = function (msg) {
        ChattingService.createActiveConversationBox(msg.from._id != UserInformation.user._id ? msg.from : msg.to);
    }

    var isBoxScrolledToBottom = function () {
        var element = document.getElementById("messages-preview");
        if (element.scrollTop + element.offsetHeight >= element.scrollHeight) {
            return true;
        }
        return false;
    }

    var endOfList = false;
    ChattingService.iWantToBeNotifiedWhenInboxReachesEndOfList(function () {
        endOfList = true;
    });

    ChattingService.iWantToBeNotifiedOnInboxUpdateEndOfFunction(function () {
        $scope.loadingMore = false;
    });

    $scope.tryToLoadMore = function () {

        if (endOfList || !isBoxScrolledToBottom()) {
            return;
        }

        $scope.loadingMore = true;

        Socket.getSocket().then(function (socket) {
            socket.emit('load-more-conversations', {
                howMuchIHave: ChattingService.inboxLength(),
                token: LoginTokenFactory.getToken().token
            });
        });
    }

}
]);
