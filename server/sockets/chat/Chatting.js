
var TokenDecrypter = require('./../TokenDecrypter.js');
var SocketDatabase = require('./../SocketDatabase.js');

var PrivateMessage = require('./../../model/PrivateMessage.js');
var AsymmetricEncryption = require('./../../services/AsymmetricEncryption.js');

var Settings = require('./../../config/Settings.js');

var mongoose = require ('mongoose');
var _ = require('underscore');


var savePrivateMessageToDatabase = function (user, recipient, message, clientGeneratedId) {
    var pm = new PrivateMessage();
    pm.from = {
        _id: user._id,
        username: user.username
    };
    pm.to = {
        _id: mongoose.Types.ObjectId(recipient._id),
        username: recipient.username
    };
    pm.date = new Date();
    pm.message = message;
    pm.read = false;
    pm.clientGeneratedId = clientGeneratedId;
    pm.save(function (err) {
        // handle error
    });
}

var markMessagesUntilDateAsRead = function (data, currentUser) {

    var date = new Date(data.date); // a conversion is always ensuring you that the type will be correct :))
    var from = data.from;

    PrivateMessage.update(
        {"to._id": currentUser._id, "from._id": mongoose.Types.ObjectId(from._id), read: false, date: {$lte: date}},
        {$set: {read: true}},
        {multi: true}
    ).exec();

}

/**
 *  Parameters:
 *  user -- user talking through the socket
 *  skip (optional) -- how many conversations to skip
 *  callback -- function having 2 arguments: 1st - error, 2nd - the messages
 */
var getConversationsFromDb = function () {

    var lastArg = arguments[arguments.length - 1];
    var callback = null;
    if (typeof lastArg === 'function') {
        callback = lastArg;
    }
    else {
        callback = function () {};
    }

    if (arguments.length < 2) {
        callback("getConversationsFromDb(user, [skip], callback) - You called this function with wrong parameters. " + arguments);
    }

    var user = arguments[0];
    var skip = arguments[1];

    if (!skip || typeof skip !== 'number' || isNaN(parseInt(skip))) {
        skip = 0;
    }

    PrivateMessage.aggregate([
            {$match: {$or: [{'to._id': user._id}, {'from._id': user._id}]}},
            {$sort: {date: 1}},
            {$group: {
                _id: {$cond: {if: {$eq: ['$to._id', user._id]}, then: '$from._id', else: '$to._id'}},
                data: {$push: {_id: "$_id", read: "$read", message: "$message", date: "$date", to: "$to",
                                from: "$from", clientGeneratedId: "$clientGeneratedId"}},
                lastMessageDate: {$max: '$date'}
            }},
            {$sort: {lastMessageDate: -1}},
            {$skip: skip},
            {$limit: Settings.inbox.numberOfConversationsOnInboxEmit}
        ],
        function (err, pms) {

            if (err) {
                callback(err);
                return;
            }
            else if (!pms) {
                callback("Error finding messages in database.");
                return;
            }

            for (var i = 0; i < pms.length; i++) {
                var msgLen = pms[i].data.length;
                var spliceIndex = msgLen - Settings.inbox.numberOfMessagesToLoadPerCoversation;
                if (spliceIndex < 0) {
                    spliceIndex = 0;
                }
                pms[i].data = pms[i].data.splice(spliceIndex, Settings.inbox.numberOfMessagesToLoadPerCoversation);
            }

            AsymmetricEncryption.decryptGroupedUserMessages(pms, function (err, decryptedMessages) {
                callback(err, decryptedMessages);
            });

        });

}

var getMessagesFromConversation = function (currentUser, partnerUser, skip, callback) {

    PrivateMessage.find(
        {$or: [{'to._id': currentUser._id, 'from._id': mongoose.Types.ObjectId(partnerUser._id)}, {'to._id': mongoose.Types.ObjectId(partnerUser._id), 'from._id': currentUser._id}]},
        {},
        {sort: {date: -1}, limit: Settings.inbox.numberOfMessagesToLoadPerCoversation, skip: skip},
        function (err, pms) {

            if (err) {
                callback(err, null);
                return;
            }

            AsymmetricEncryption.decryptUserMessages(pms, function (err, decryptedMessages) {
                callback(err, decryptedMessages);
            });

        }
    );

}


var handleChatters = function (socket) {

    socket.on('pm', function (data) {
        TokenDecrypter.decrypt(data.token, function (err, user) {

            if (err || !user) {
                return;
            }

            if (!Array.isArray(data.to)) {
                data.to = [data.to];
            }
            for (var i = 0; i < data.to.length; i++) {
                var recipient = data.to[i];

                if (recipient._id == user._id) {
                    continue;
                }

                if (SocketDatabase.isUserOnline(recipient._id)) {
                    var socket = SocketDatabase.getUserSocket(recipient._id);
                    socket.emit('pm', {
                        from: {_id: user._id, username: user.username},
                        to: data.to,
                        message: data.message,
                        date: new Date(),
                        clientGeneratedId: data.clientGeneratedId
                    });
                }

                if (data.to.length == 1) {
                    AsymmetricEncryption.encrypt(data.message, function (err, message) {
                        savePrivateMessageToDatabase(user, recipient, message, data.clientGeneratedId);
                    });
                }
                else {
                    // save to Conversation
                }

            }
        });
    });

    socket.on('i-ve-read-my-messages', function (data) {
        TokenDecrypter.decrypt(data.token, function (err, user) {

            if (err || !user) {
                return;
            }

            markMessagesUntilDateAsRead(data, user);

        });
    });

    socket.on('load-more-conversations', function (data) {
        TokenDecrypter.decrypt(data.token, function (err, user) {

            if (err || !user) {
                return;
            }

            getConversationsFromDb(user, data.howMuchIHave, function (err, pms) {
                socket.emit('pm-inbox-update', pms);
            });

        });
    });

    socket.on('load-more-messages-in-conversation', function (data) {
        TokenDecrypter.decrypt(data.token, function (err, user) {

            if (err || !user) {
                return;
            }

            getMessagesFromConversation(user, data.partnerUser, data.howMuchIHave, function (err, pms) {
                socket.emit('messages-with-user', {user: data.partnerUser, messages: pms});
            });

        });
    });

}

module.exports = {
    handleChatters: handleChatters,
    getConversationsFromDb: getConversationsFromDb
};
