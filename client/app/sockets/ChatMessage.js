
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
                message: message
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

    return thisFactory;

}
]);