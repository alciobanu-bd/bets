
chatModule
.controller('ChatboxesController', [
'$scope', 'ChatMessage', 'ChattingService',
function ($scope, ChatMessage, ChattingService) {

    $scope.getMarginRight = function (index) {
        return index * 205 + "px";
    }

    $scope.ChattingService = ChattingService;

    ChatMessage.onPrivateMessage(function (data) {
        $scope.$apply(function () {
            ChattingService.addReceivedMessage(data.from, data.message);
        });
    });

}
]);
