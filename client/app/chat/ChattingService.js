
chatModule.
factory('ChattingService', [
function () {

    var thisFactory = {};

    thisFactory.activeBoxes = [];
    thisFactory.id = 0;

    thisFactory.createConversationBox = function (user) {
        for (var i = 0; i < thisFactory.activeBoxes.length; i++) {
            var currentBox = thisFactory.activeBoxes[i];
            if (currentBox.with._id == user._id) {
                // if box is already opened
                currentBox.checked = true;
                return currentBox;
            }
        }

        var newConversation = {
            with: user,
            checked: true,
            messages: [],
            id: thisFactory.id++
        };

        thisFactory.activeBoxes.push(newConversation);

        return newConversation;

    }

    thisFactory.addReceivedMessage = function (from, message) {
        var box = thisFactory.createConversationBox(from);
        box.messages.push({
            from: from,
            message: message
        });
    }

    thisFactory.deleteConversationBox = function (conversation) {
        for (var i = 0; i < thisFactory.activeBoxes.length; i++) {
            var currentBox = thisFactory.activeBoxes[i];
            if (conversation.id == currentBox.id) {
                thisFactory.activeBoxes.splice(i, 1);
                break;
            }
        }
    }

    return thisFactory;

}
]);
