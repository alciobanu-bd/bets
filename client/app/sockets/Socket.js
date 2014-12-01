
socketsModule
.factory('Socket',
[
'UserInformation', '$q', 'LoginTokenFactory',
function (UserInformation, $q, LoginTokenFactory) {

    var Socket = io({transports: ['websocket', 'polling']});

    return {
        getSocket: function () {

            var defered = $q.defer();

            UserInformation.ready(function () {
                defered.resolve(Socket);
            });

            return defered.promise;

        },

        registerMe: function () {
            var tokStorage = LoginTokenFactory.getToken();
            if (tokStorage) {
                Socket.emit('register-me', tokStorage.token);
            }
        },

        unregisterMe: function () {
            var tokStorage = LoginTokenFactory.getToken();
            if (tokStorage) {
                Socket.emit('unregister-me', tokStorage.token);
            }
        }
    };

}
]);