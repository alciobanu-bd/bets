
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BetSchema = mongoose.Schema({
    weekNumber: {type: 'number', required: true},
    weekId: {type: ObjectId, required: true},
    scores: {type: Array, required: false},
    points: {type: 'number', required: false},
    ended: {type: Boolean, required: false},
    userId: {type: ObjectId, required: false},
    username: {type: 'string', required: false},
    congratsSent: {type: Boolean, required: false},
    isWinner: {type: Boolean, required: false}
});

module.exports = mongoose.model('bet', BetSchema);
