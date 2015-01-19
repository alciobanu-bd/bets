
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

    thisFactory.isActiveBoxOpened = function (user) {
        for (var i = 0; i < thisFactory.activeBoxes.length; i++) {
            var currentBox = thisFactory.activeBoxes[i];
            if (currentBox.with._id == user._id) {
                return true;
            }
        }
        return false;
    }

    thisFactory.getLastMessageOfConversation = function (conversationBox) {
        return conversationBox.messages[conversationBox.messages.length - 1];
    }

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
            id: thisFactory.id++,
            iVeReadIt: true
        };

        thisFactory.activeBoxes.push(newConversation);

        return newConversation;

    }

    var insertIntoLastMessages = function (from, to, message) {

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
            message: message,
            read: false
        });

    }

    thisFactory.addReceivedMessage = function (data) {

        var box = thisFactory.createConversationBox(data.from);
        box.messages.push({
            from: data.from,
            message: data.message,
            date: data.date
        });
        box.iVeReadIt = false;

        insertIntoLastMessages(
            data.from,
            {_id: UserInformation.user._id, username: UserInformation.user.username},
            data.message
        );

        if (typeof box.onMessageReceived === 'function') {
            box.onMessageReceived();
        }

    }

    thisFactory.addOwnSentMessage = function (conversationBox, from, to, message) {
        conversationBox.messages.push({
            from: from,
            message: message,
            date: new Date()
        });
        conversationBox.iVeReadIt = true;
        insertIntoLastMessages(from, to, message);
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

    thisFactory.markBoxAsRead = function (conversationBox) {
        conversationBox.iVeReadIt = true;
    }

    thisFactory.getNumberOfUnreadConversations = function () {
        var n = 0;

        for (var i = 0; i < thisFactory.activeBoxes.length; i++) {
            if (!thisFactory.activeBoxes[i].iVeReadIt) {
                n++;
            }
        }

        for (var i = 0; i < thisFactory.passiveBoxes.length; i++) {
            if (!thisFactory.passiveBoxes[i].iVeReadIt) {
                n++;
            }
        }

        return n;
    }

    var setUnreadMessages = function (conversation, box) {
        var lastMessageOfConversation = _.max(conversation, function (messageItem) {
            return new Date(messageItem.date).getTime();
        });

        if (lastMessageOfConversation.to._id == UserInformation.user._id && !lastMessageOfConversation.read) {
            // if the last message of conversation was sent to current user and it wasn't read
            box.iVeReadIt = false
        }

        thisFactory.lastMessages.push(lastMessageOfConversation);

    }

    thisFactory.updatePassiveBoxes = function (inboxGroupedByUser) {

        if (thisFactory.loadedInbox) {
            return;
        }

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
                id: thisFactory.id++,
                iVeReadIt: true
            };

            setUnreadMessages(conversationWithUser, newBox);

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

        thisFactory.loadedInbox = true;

    }

    return thisFactory;

}
]);
