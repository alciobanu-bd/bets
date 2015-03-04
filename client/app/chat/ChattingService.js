
chatModule.
factory('ChattingService', [
'UserInformation', 'ServerDate', 'Settings',
function (UserInformation, ServerDate, Settings) {

    var thisFactory = {};


    var uniqueId = 0;
    var MAX_ID = Math.pow(2, 51);

    var getNextId = function () {
        var id = uniqueId++;
        if (uniqueId == MAX_ID) {
            uniqueId = -MAX_ID;
        }
        if (uniqueId == 0) {
            location.reload();
        }
        return id;
    }


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

    var closeOneActiveBoxIfNecessary = function () {

        if (thisFactory.activeBoxes.length <= Settings.chat.maxNumberOfOpenChatboxes) {
            return;
        }

        var oldestBox = thisFactory.activeBoxes[0];
        var oldestBoxIndex = 0;
        for (var i = 1; i < thisFactory.activeBoxes.length; i++) {
            var box = thisFactory.activeBoxes[i];
            if (box.lastAction < oldestBox.lastAction) {
                oldestBox = box;
                oldestBoxIndex = i;
            }
        }
        var box = thisFactory.activeBoxes[oldestBoxIndex];
        thisFactory.passiveBoxes.push(box);
        thisFactory.activeBoxes.splice(oldestBoxIndex, 1);
    }

    thisFactory.createActiveConversationBox = function (user) {

        /*
            Search for a passive box. If it exists, make it active and return it.
         */
        for (var i = 0; i < thisFactory.passiveBoxes.length; i++) {
            var currentBox = thisFactory.passiveBoxes[i];
            if (currentBox.with._id == user._id) {
                thisFactory.activeBoxes.push(currentBox);
                thisFactory.passiveBoxes.splice(i, 1);
                currentBox.lastAction = new Date();
                closeOneActiveBoxIfNecessary();
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
                currentBox.lastAction = new Date();
                closeOneActiveBoxIfNecessary();
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
            iVeReadIt: true,
            lastAction: new Date()
        };

        thisFactory.activeBoxes.push(newConversation);

        closeOneActiveBoxIfNecessary();
        return newConversation;

    }

    var getActiveBoxByUser = function (user) {
        for (var i = 0; i < thisFactory.activeBoxes.length; i++) {
            var box = thisFactory.activeBoxes[i];
            if (box.with._id == user._id) {
                return box;
            }
        }
        return null;
    }

    var insertIntoLastMessages = function (from, to, message, _id) {

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
            read: false,
            _id: getNextId()
        });

    }

    thisFactory.addReceivedMessage = function (data) {

        var box = thisFactory.createActiveConversationBox(data.from);
        box.messages.push({
            from: data.from,
            message: data.message,
            date: data.date,
            _id: getNextId(),
            clientGeneratedId: data.clientGeneratedId
        });
        box.iVeReadIt = false;
        box.lastAction = new Date();

        insertIntoLastMessages(
            data.from,
            {_id: UserInformation.user._id, username: UserInformation.user.username, email: UserInformation.user.email},
            data.message
        );

        if (typeof box.onMessageReceived === 'function') {
            box.onMessageReceived();
        }

        closeOneActiveBoxIfNecessary();

    }

    thisFactory.addOwnSentMessage = function (conversationBox, from, to, message, clientGeneratedId) {

        ServerDate.getDate().then(function (serverDate) {
            conversationBox.messages.push({
                from: from,
                message: message,
                date: serverDate,
                _id: getNextId(),
                clientGeneratedId: clientGeneratedId
            });
        });
        conversationBox.iVeReadIt = true;
        insertIntoLastMessages(from, to, message);
    }

    thisFactory.deleteConversationBox = function (conversation) {
        for (var i = 0; i < thisFactory.activeBoxes.length; i++) {
            var currentBox = thisFactory.activeBoxes[i];
            if (conversation.id == currentBox.id) {
                thisFactory.passiveBoxes.push(currentBox);
                thisFactory.activeBoxes.splice(i, 1);
                break;
            }
        }
    }

    thisFactory.removeAllBoxes = function () {
        thisFactory.activeBoxes = thisFactory.activeBoxes.concat(thisFactory.passiveBoxes);
        thisFactory.passiveBoxes = [];
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

    var existsConversationInInbox = function (userId) {

        for (var i = 0; i < thisFactory.lastMessages.length; i++) {
            var message = thisFactory.lastMessages[i];
            if (message.from._id == userId || message.to._id == userId) {
                return true;
            }
        }

        return false;

    }

    var setUnreadMessages = function (conversation, box) {
        var lastMessageOfConversation = conversation[conversation.length - 1];

        if (lastMessageOfConversation.to._id == UserInformation.user._id && !lastMessageOfConversation.read) {
            // if the last message of conversation was sent to current user and it wasn't read
            box.iVeReadIt = false;
        }

        thisFactory.lastMessages.push(lastMessageOfConversation);

    }

    thisFactory.inboxLength = function () {
        return thisFactory.lastMessages.length;
    }

    var inboxListSubscriberFunctions = [];
    thisFactory.iWantToBeNotifiedWhenInboxReachesEndOfList = function (callback) {
        inboxListSubscriberFunctions.push(callback);
    }

    var inboxUpdateEndSubscriberFunctions = [];
    thisFactory.iWantToBeNotifiedOnInboxUpdateEndOfFunction = function (callback) {
        inboxUpdateEndSubscriberFunctions.push(callback);
    }

    thisFactory.updatePassiveBoxes = function (inboxGroupedByUser) {

        if (inboxGroupedByUser.length == 0) {
            for (var i = 0; i < inboxListSubscriberFunctions.length; i++) {
                var callback = inboxListSubscriberFunctions[i];
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }

        for (var i = 0; i < inboxGroupedByUser.length; i++) {

            var conversationWithUser = inboxGroupedByUser[i];

            var conversationPartner;
            if (conversationWithUser.data[0].from._id != UserInformation.user._id) {
                conversationPartner = conversationWithUser.data[0].from;
            }
            else if (conversationWithUser.data[0].to._id != UserInformation.user._id) {
                conversationPartner = conversationWithUser.data[0].to;
            }

            if (existsConversationInInbox(conversationPartner._id)) {
                // if box already exists, don't add a new box for this user
                continue;
            }

            var newBox = {
                with: conversationPartner,
                checked: true,
                messages: [],
                id: thisFactory.id++,
                iVeReadIt: true
            };

            setUnreadMessages(conversationWithUser.data, newBox);

            thisFactory.passiveBoxes.push(newBox);

            newBox.messages = conversationWithUser.data;
        }

        for (var i = 0; i < inboxUpdateEndSubscriberFunctions.length; i++) {
            var callback = inboxUpdateEndSubscriberFunctions[i];
            if (typeof callback === 'function') {
                callback();
            }
        }

        thisFactory.loadedInbox = true;

    }

    var existsMessageInConversation = function (searchedMessage, messagesInConversation) {

        var delta = 60 * 1000; // 60 seconds

        for (var j = 0; j < messagesInConversation.length; j++) {
            var messageConversation = messagesInConversation[j];
            if (searchedMessage.clientGeneratedId == messageConversation.clientGeneratedId) {
                return true;
            }
            if (new Date(messageConversation.date).getTime() > new Date(searchedMessage.date).getTime() + delta) {
                break;
            }
        }
        return false;
    }

    var conversationEmptyListSubscriberFunctions = [];
    thisFactory.iWantToBeNotifiedWhenConversationMessagesListIsEmpty = function (partnerUser, callback) {
        conversationEmptyListSubscriberFunctions.push({
            user: partnerUser,
            callback: callback
        });
    }

    var conversationEndOfFunctionSubscriberFunctions = [];
    thisFactory.iWantToBeNotifiedWhenConversationUpdateFunctionEnds = function (partnerUser, callback) {
        conversationEndOfFunctionSubscriberFunctions.push({
            user: partnerUser,
            callback: callback
        });
    }

    thisFactory.unsubscribeAllConversationMessagesSubscibersForThisUser = function (partnerUser) {
        for (var i = 0; i < conversationEmptyListSubscriberFunctions.length; i++) {
            if (conversationEmptyListSubscriberFunctions[i].user._id == partnerUser._id) {
                conversationEmptyListSubscriberFunctions.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < conversationEndOfFunctionSubscriberFunctions.length; i++) {
            if (conversationEndOfFunctionSubscriberFunctions[i].user._id == partnerUser._id) {
                conversationEndOfFunctionSubscriberFunctions.splice(i, 1);
                break;
            }
        }
    }

    thisFactory.updateChatboxWithMoreMessages = function (data) {

        if (data.messages.length == 0) {
            for (var i = 0; i < conversationEmptyListSubscriberFunctions.length; i++) {
                var subscribeObject = conversationEmptyListSubscriberFunctions[i];
                if (data.user._id == subscribeObject.user._id && typeof subscribeObject.callback === 'function') {
                    subscribeObject.callback();
                }
            }
            return;
        }

        var keptMessages = [];
        var box = getActiveBoxByUser(data.user);
        for (var i = data.messages.length - 1; i >= 0; i--) {
            var currentMessage = data.messages[i];
            if (!existsMessageInConversation(currentMessage, box.messages)) {
                keptMessages.push(currentMessage);
            }
        }

        box.messages = keptMessages.concat(box.messages);

        for (var i = 0; i < conversationEndOfFunctionSubscriberFunctions.length; i++) {
            var subscribeObject = conversationEndOfFunctionSubscriberFunctions[i];
            if (data.user._id == subscribeObject.user._id && typeof subscribeObject.callback === 'function') {
                subscribeObject.callback();
            }
        }

    }

    return thisFactory;

}
]);
