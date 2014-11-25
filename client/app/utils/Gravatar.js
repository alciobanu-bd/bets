
utilsModule

.factory('Gravatar', [
function () {

    return {
        getImageUrl: function (email, size) {

            if (typeof email !== 'string') {
                return 'not-found';
            }

            var path = "http://www.gravatar.com/avatar/" + MD5(email.toLowerCase());
            path += "?s=" + (size || 100);
            return path;
        }
    };

}
]);
