
var socketIo = require('socket.io')(LISTENER);
var Chatting = require('./chat/Chatting.js');

var SocketDatabase = require('./SocketDatabase.js');


var registerUser = function (token, socket) {
    SocketDatabase.bindUserToSocket(token, socket, function (user) {
        Chatting.emitInboxForUser(socket, user);
    });
}

var unregisterUser = function (token) {
    SocketDatabase.unbindUserFromSocket(token);
}


socketIo.on('connection', function (socket) {

    SocketDatabase.incrementConnectedUsersNumber();

    socket.emit('require-registration');

    socket.on('register-me', function (token) {
        registerUser(token, socket);
    });
    socket.on('unregister-me', function (token) {
        unregisterUser(token);
    });

    socket.on('disconnect', function () {
        SocketDatabase.decrementConnectedUsersNumber();
    });

    Chatting.handleChatters(socket);

});

