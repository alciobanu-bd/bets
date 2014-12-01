
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessagingSchema = mongoose.Schema({
    to: {type: Schema.Types.Mixed, required: true},
    from: {type: Schema.Types.Mixed, required: true},
    message: {type: 'string', required: true},
    date: {type: 'date', required: true}
});

module.exports = mongoose.model('privateMessage', MessagingSchema);
