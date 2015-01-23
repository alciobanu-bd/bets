
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessagingSchema = mongoose.Schema({
    to: {type: Schema.Types.Mixed, required: true},
    from: {type: Schema.Types.Mixed, required: true},
    message: {type: 'string', required: true},
    date: {type: 'date', required: true},
    read: {type: Boolean, required: true} // says whether the message was read by receiver (the "to" field) or not
});

module.exports = mongoose.model('privateMessage', MessagingSchema);
