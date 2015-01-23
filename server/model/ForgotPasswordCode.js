
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ForgotPasswordCode = mongoose.Schema({
    userId: {type: ObjectId, required: true},
    forgotPasswordCode: {type: 'string', required: true},
    expirationDate: {type: 'date', required: true}
});

module.exports = mongoose.model('forgotpasswordcode', ForgotPasswordCode);
