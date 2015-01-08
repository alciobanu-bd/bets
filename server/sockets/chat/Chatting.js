
var TokenDecrypter = require('./../TokenDecrypter.js');
var SocketDatabase = require('./../SocketDatabase.js');

var PrivateMessage = require('./../../model/PrivateMessage.js');
var AsymmetricEncryption = require('./../../services/AsymmetricEncryption.js');

var mongoose = require ('mongoose');
var _ = require('underscore');


var savePrivateMessageToDatabase = function (user, recipient, message) {
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
                        date: new Date()
                    });
                }

                if (data.to.length == 1) {
                    AsymmetricEncryption.encrypt(data.message, function (err, message) {
                        savePrivateMessageToDatabase(user, recipient, message);
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

}

var emitInboxForUser = function (socket, user) {

    PrivateMessage.find({$or: [{'to._id': user._id}, {'from._id': user._id}]},
        {},
        {sort: {date: 1}}, function (err, messages) {
            AsymmetricEncryption.decryptUserMessages(messages, function (err, decryptedMessages) {

                var groupedInbox = _.groupBy(decryptedMessages, function (messageItem) {
                    if (messageItem.to._id.toString() != user._id.toString()) {
                        return messageItem.to._id;
                    }
                    if (messageItem.from._id.toString() != user._id.toString()) {
                        return messageItem.from._id;
                    }
                    return 'this-is-not-good';
                });

                socket.emit('pm-inbox-update', {inbox: groupedInbox});
            });
    });

}

module.exports = {
    handleChatters: handleChatters,
    emitInboxForUser: emitInboxForUser
};
