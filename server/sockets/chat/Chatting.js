
var TokenDecrypter = require('./../TokenDecrypter.js');
var SocketDatabase = require('./../SocketDatabase.js');

var handleChatters = function (socket) {

    socket.on('pm', function (data) {
        TokenDecrypter.decrypt(data.token, function (err, user) {
            if (!Array.isArray(data.to)) {
                data.to = [data.to];
            }
            console.log(data);
            for (var i = 0; i < data.to.length; i++) {
                var recipient = data.to[i];
                if (SocketDatabase.isUserOnline(recipient)) {
                    var socket = SocketDatabase.getUserSocket(recipient);
                    socket.emit('pm', {
                        from: {_id: user._id, username: user.username},
                        to: data.to,
                        message: data.message
                    });
                }
            }
        });
    });

}

module.exports = {
    handleChatters: handleChatters
};
