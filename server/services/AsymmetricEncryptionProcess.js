
// openssl genrsa -out certs/server/my-server.key.pem 2048
// openssl rsa -in certs/server/my-server.key.pem -pubout -out certs/client/my-server.pub

var fs = require('fs'),
    ursa = require('ursa');


var priv = ursa.createPrivateKey(fs.readFileSync('./server/config/msg-key.pem'));
var pub = ursa.createPublicKey(fs.readFileSync('./server/config/msg-key.pub'));


var encrypt = function (message) {
    return pub.encrypt(new Buffer(message), 'utf8', 'base64');
}

var decrypt = function (message) {
    return priv.decrypt(message, 'base64', 'utf8');
}

var decryptUserMessages = function (messagesArray) {

    for (var i = 0; i < messagesArray.length; i++) {
        var element = messagesArray[i];
        element.message = decrypt(element.message);
    }

    return messagesArray;
}

process.on('message', function(m) {
    if (m.hasOwnProperty('encrypt')) {
        var encrypted = encrypt(m.encrypt);
        process.send({message: encrypted});
    }
    else if (m.hasOwnProperty('decrypt')) {
        var decrypted = decrypt(m.decrypt);
        process.send({message: decrypted});
    }
    else if (m.hasOwnProperty('decryptUserMessages')) {
        var decryptedUserMessages = decryptUserMessages(m.decryptUserMessages);
        process.send({array: decryptedUserMessages});
    }
});
