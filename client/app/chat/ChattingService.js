
chatModule.
factory('ChattingService', [
'UserInformation',
function (UserInformation) {

    var thisFactory = {};

    thisFactory.reset = function () {
        thisFactory.activeBoxes = [];
        thisFactory.passiveBoxes = [];
        thisFactory.lastMessages = [];
        thisFactory.numberOfUnreadMessages = 0;
        thisFactory.id = 0;
        thisFactory.loadedInbox = false;
    }

    thisFactory.reset();

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
        var box = thisFactory.createConversationBox(data.from);
        box.messages.push({
            from: data.from,
            message: data.message,
            date: data.date
        });
    }

    thisFactory.addOwnSentMessage = function (conversationBox, from, to, message) {

        var insertIntoLastMessages = function (from, message) {

            for (var i = 0; i < thisFactory.lastMessages.length; i++) {
                var currentMsg = thisFactory.lastMessages[i];
                if (currentMsg.from._id == to._id || currentMsg.to._id == to._id) {
                    thisFactory.lastMessages.splice(i, 1);
                    break;
                }
            }

            thisFactory.lastMessages.unshift({
                from: from,
                to: to,
                date: new Date(),
                message: message
            });
        }

        conversationBox.messages.push({
            from: from,
            message: message,
            date: new Date()
        });
        insertIntoLastMessages(from, message);
    }

    thisFactory.deleteConversationBox = function (conversation) {
        for (var i = 0; i < thisFactory.activeBoxes.length; i++) {
            var currentBox = thisFactory.activeBoxes[i];
            thisFactory.passiveBoxes.push(currentBox);
            if (conversation.id == currentBox.id) {
                thisFactory.activeBoxes.splice(i, 1);
                break;
            }
        }
    }

    var setUnreadMessages = function (conversation) {
        var lastMessageOfConversation = _.max(conversation, function (messageItem) {
            return new Date(messageItem.date).getTime();
        });

        if (lastMessageOfConversation.to._id == UserInformation.user._id && !lastMessageOfConversation.read) {
            // if the last message of conversation was sent to current user and it wasn't read
            thisFactory.numberOfUnreadMessages++;
        }

        thisFactory.lastMessages.push(lastMessageOfConversation);

    }

    thisFactory.updatePassiveBoxes = function (inboxGroupedByUser) {

        if (thisFactory.loadedInbox) {
            return;
        }

        for (var i in inboxGroupedByUser) {

            var conversationWithUser = inboxGroupedByUser[i];
            setUnreadMessages(conversationWithUser);

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

        thisFactory.lastMessages.sort(function (msg1, msg2) {
            return new Date(msg2.date).getTime() - new Date(msg1.date).getTime();
        });

        console.log(thisFactory.lastMessages);

        thisFactory.loadedInbox = true;

    }

    return thisFactory;

}
]);
