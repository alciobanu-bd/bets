
var randomString = function() {
    var s = Math.random().toString(36).slice(2);
    while (s.length < 16) {
        s += Math.random().toString(36).slice(2);
    }
    if (s.length > 25) {
        s = s.substring(1, 23);
    }
    return s;
}

module.exports = {
    randomString: randomString
};
