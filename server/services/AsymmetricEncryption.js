
var cp = require('child_process');

var encrypt = function (message, callback) {
    var n = cp.fork('./server/services/AsymmetricEncryptionProcess.js');

    n.on('message', function(message) {
        callback(null, message.message);
    });

    n.send({encrypt: message});
}

var decrypt = function (message, callback) {
    var n = cp.fork('./server/services/AsymmetricEncryptionProcess.js');

    n.on('message', function(message) {
        callback(null, message.message);
    });

    n.send({decrypt: message});
}

var decryptUserMessages = function (userMessagesArray, callback) {
    var n = cp.fork('./server/services/AsymmetricEncryptionProcess.js');

    n.on('message', function(message) {
        callback(null, message.array);
    });

    n.send({decryptUserMessages: userMessagesArray});
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
    decryptUserMessages: decryptUserMessages
};
