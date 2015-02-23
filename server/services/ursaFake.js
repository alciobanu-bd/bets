
var priv = {
    decrypt: function (message) {
        return message;
    }
};
var pub = {
    encrypt: function (message) {
        return message.toString();
    }
};

module.exports = {
    createPrivateKey: function () {
        return priv;
    },
    createPublicKey: function () {
        return pub;
    }
};
