
socketsModule.factory('ChatMessage', [
'Socket', 'LoginTokenFactory',
function (Socket, LoginTokenFactory) {

    var thisFactory = {};

    var socketPromise = Socket.getSocket();

    thisFactory.sendPrivateMessage = function (to, message) {
        var accessToken = LoginTokenFactory.getToken().token;
        socketPromise.then(function (socket) {
            socket.emit('pm', {
                token: accessToken,
                to: to,
                message: message,
                date: new Date()
            });
        });
    }

    thisFactory.iVeReadMyMessagesUntilDate = function (date, from) {
        var accessToken = LoginTokenFactory.getToken().token;
        socketPromise.then(function (socket) {
            socket.emit('i-ve-read-my-messages', {
                token: accessToken,
                date: date,
                from: from
            });
        });
    }

    thisFactory.onPrivateMessage = function (callback) {
        socketPromise.then(function (socket) {
            socket.on('pm', function (data) {
                callback(data);
            });
        });
    }

    thisFactory.onInboxUpdate = function (callback) {
        socketPromise.then(function (socket) {
            socket.on('pm-inbox-update', function (data) {
                if (typeof callback === 'function') {
                    callback(data);
                }
            });
        });
    }

    return thisFactory;

}
]);
