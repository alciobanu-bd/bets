
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var RegistrationCode = mongoose.Schema({
    userId: {type: ObjectId, required: true},
    registrationCode: {type: 'string', required: true},
    expirationDate: {type: 'date', required: true}
});

module.exports = mongoose.model('registrationcode', RegistrationCode);
