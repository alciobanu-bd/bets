
var cp = require('child_process');
var Settings = require('./../config/Settings.js');

var PROCESSES_NO = Settings.privateMessagesWorkerProcesses;
var MAX_ID = 10; // to be changed when things are stable
// var MAX_ID = Math.pow(2, 50) + Math.pow(2, 49); // maximum safe integer is 2^53
var nextWorkingProcess = 0;
var childProcs = [];

var addMessageToBuffer = function (callback) {

    var processId = nextWorkingProcess;
    var process = childProcs[nextWorkingProcess++];
    nextWorkingProcess = nextWorkingProcess % PROCESSES_NO;
    var id = process.uniqueId++;
    process.uniqueId = process.uniqueId % MAX_ID;

    var messageToChildMetadata = {
        id: id,
        processId: processId,
        callback: callback
    };

    process.awaitingMessagesBuffer.push(messageToChildMetadata);

    return messageToChildMetadata;

}

var getNextWorkingChild = function () {
    return childProcs[nextWorkingProcess].child;
}

var getCallback = function (processId, id) {
    var process = childProcs[processId];

    for (var i = 0; i < process.awaitingMessagesBuffer.length; i++) {
        var currentMessage = process.awaitingMessagesBuffer[i];
        if (currentMessage.id == id) {
            return currentMessage.callback;
        }
    }

    return function () {}; // this should really not happen

}

var encrypt = function (message, callback) {
    var messageMetadata = addMessageToBuffer(callback);
    getNextWorkingChild().send({encrypt: message, id: messageMetadata.id, processId: messageMetadata.processId});
}

var decrypt = function (message, callback) {
    var messageMetadata = addMessageToBuffer(callback);
    getNextWorkingChild().send({decrypt: message, id: messageMetadata.id, processId: messageMetadata.processId});
}

var decryptUserMessages = function (userMessagesArray, callback) {
    var messageMetadata = addMessageToBuffer(callback);
    getNextWorkingChild().send({decryptUserMessages: userMessagesArray, id: messageMetadata.id, processId: messageMetadata.processId});
}

var onMessageFromChild = function (message) {
    var callback = getCallback(message.processId, message.id);
    callback(null, message.message);
}

for (var i = 0; i < PROCESSES_NO; i++) {
    childProcs[i] = {
        child: cp.fork('./server/services/AsymmetricEncryptionProcess.js'),
        awaitingMessagesBuffer: [],
        uniqueId: 0
    };
    childProcs[i].child.on('message', onMessageFromChild);
    childProcs[i].child.send({hello: i});
}


module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
    decryptUserMessages: decryptUserMessages
};
