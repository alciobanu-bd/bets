
var socketIo = require('socket.io')(LISTENER);
var Chatting = require('./chat/Chatting.js');

var SocketDatabase = require('./SocketDatabase.js');


var registerUser = function (token, socket) {
    SocketDatabase.bindUserToSocket(token, socket);
}

var unregisterUser = function (token) {
    SocketDatabase.unbindUserFromSocket(token);
}


socketIo.on('connection', function (socket) {

    var token = socket.handshake.query.token;
    if (token) {
        registerUser(token, socket);
    }

    SocketDatabase.incrementConnectedUsersNumber();

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

