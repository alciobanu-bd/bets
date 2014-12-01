
var TokenDecrypter = require('./../TokenDecrypter.js');
var SocketDatabase = require('./../SocketDatabase.js');

var PrivateMessage = require('./../../model/PrivateMessage.js');
var AsymmetricEncryption = require('./../../services/AsymmetricEncryption.js');

var mongoose = require ('mongoose');
var _ = require('underscore');

var handleChatters = function (socket) {

    socket.on('pm', function (data) {
        TokenDecrypter.decrypt(data.token, function (err, user) {
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
                        var pm = new PrivateMessage();
                        pm.from = {
                            _id: user._id,
                            username: user.username
                        };
                        pm.to = {
                            _id: mongoose.Types.ObjectId(recipient._id),
                            username: recipient.username
                        };
                        pm.date = new Date(data.date);
                        pm.message = message;
                        pm.save(function (err) {
                            // handle error
                        });
                    });
                }
                else {
                    // save to Conversation
                }

            }
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
