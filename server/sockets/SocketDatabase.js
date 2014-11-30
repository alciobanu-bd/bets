
var TokenDecrypter = require('./TokenDecrypter.js');

var fs = require('fs');
var LOG_TOKEN_DECRYPT_ERRS_FILE_NAME = 'logs/bet_placement.txt';

var connectedSockets = {}; // all connected users will be kept here
var connectedNo = 0;

setInterval(function () {
    console.log(Object.keys(connectedSockets));
}, 2000);

var handleUserToken = function (token, callback) {
    TokenDecrypter.decrypt(token, function (err, user) {
        if (err) {
            fs.appendFile(LOG_TOKEN_DECRYPT_ERRS_FILE_NAME, new Date() + " -- " + err + '\r\n');
        }
        else {
            if (user) {
                callback(user);
            }
        }
    });
}


var bindUserToSocket = function (token, socket) {
    handleUserToken(token, function (user) {
        connectedSockets[user._id] = socket;
    });
}

var unbindUserFromSocket = function (token) {
    handleUserToken(token, function (user) {
        delete connectedSockets[user._id];
    });
}


module.exports = {
    bindUserToSocket: bindUserToSocket,
    unbindUserFromSocket: unbindUserFromSocket,
    isUserOnline: function (userId) {
        return connectedSockets[userId] != null && connectedSockets[userId] != undefined;
    },
    getUserSocket: function (userId) {
        return connectedSockets[userId];
    },
    incrementConnectedUsersNumber: function () {
        connectedNo++;
    },
    decrementConnectedUsersNumber: function () {
        connectedNo--;
    }
};
