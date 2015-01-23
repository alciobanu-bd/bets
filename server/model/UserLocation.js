
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserLocation = mongoose.Schema({
    "userId": {type: ObjectId, required: true},
    "username": {type: 'string', required: false},
    "as": {type: 'string', required: false},
    "city": {type: 'string', required: false},
    "country": {type: 'string', required: false},
    "countryCode": {type: 'string', required: false},
    "isp": {type: 'string', required: false},
    "lat": {type: 'number', required: false},
    "lon": {type: 'number', required: false},
    "org": {type: 'string', required: false},
    "query": {type: 'string', required: true},
    "region": {type: 'string', required: false},
    "regionName": {type: 'string', required: false},
    "timezone": {type: 'string', required: false},
    "zip": {type: 'string', required: false},
    "date": {type: 'date', required: true}
});

module.exports = mongoose.model('userLocations', UserLocation);
