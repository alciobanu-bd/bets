
chatModule.
factory('ChattingService', [
'UserInformation',
function (UserInformation) {

    var thisFactory = {};

    thisFactory.activeBoxes = [];
    thisFactory.passiveBoxes = [];
    thisFactory.id = 0;

    thisFactory.createConversationBox = function (user) {

        /*
            Search for a passive box. If it exists, make it active and return it.
         */
        for (var i = 0; i < thisFactory.passiveBoxes.length; i++) {
            var currentBox = thisFactory.passiveBoxes[i];
            if (currentBox.with._id == user._id) {
                thisFactory.activeBoxes.push(currentBox);
                thisFactory.passiveBoxes.splice(i, 1);
                return currentBox;
            }
        }

        /*
            Search for an active box. If it exists, return it.
         */
        for (var i = 0; i < thisFactory.activeBoxes.length; i++) {
            var currentBox = thisFactory.activeBoxes[i];
            if (currentBox.with._id == user._id) {
                // if box is already opened
                currentBox.checked = true;
                return currentBox;
            }
        }

        /*
            Else create a new box.
         */
        var newConversation = {
            with: user,
            checked: true,
            messages: [],
            id: thisFactory.id++
        };

        thisFactory.activeBoxes.push(newConversation);

        return newConversation;

    }

    thisFactory.addReceivedMessage = function (data) {
        var box = thisFactory.createConversationBox(from);
        box.messages.push({
            from: data.from,
            message: data.message,
            date: data.date
        });
    }

    thisFactory.addOwnSentMessage = function (conversationBox, from, message) {
        conversationBox.messages.push({
            from: from,
            message: message,
            date: new Date()
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

    thisFactory.updatePassiveBoxes = function (inboxGroupedByUser) {
        for (var i in inboxGroupedByUser) {
            var conversationWithUser = inboxGroupedByUser[i];

            var conversationPartner;
            if (conversationWithUser[0].from._id != UserInformation.user._id) {
                conversationPartner = conversationWithUser[0].from
            }
            else if (conversationWithUser[0].to._id != UserInformation.user._id) {
                conversationPartner = conversationWithUser[0].to;
            }

            var newBox = {
                with: conversationPartner,
                checked: true,
                messages: [],
                id: thisFactory.id++
            };

            thisFactory.passiveBoxes.push(newBox);

            newBox.messages = _.map(conversationWithUser, function (messageItem) {
                return {
                    from: messageItem.from,
                    message: messageItem.message,
                    date: messageItem.date
                };
            });
        }
    }

    return thisFactory;

}
]);
