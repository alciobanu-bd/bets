
socketsModule
.factory('Socket',
[
'UserInformation', '$q', 'LoginTokenFactory',
function (UserInformation, $q, LoginTokenFactory) {

    var ioParams = {transports: ['websocket', 'polling']};

    var tokStorage = LoginTokenFactory.getToken();
    if (tokStorage) {
        ioParams.query = "token=" + tokStorage.token;
    }

    var Socket = io(ioParams);

    return {
        getSocket: function () {

            var defered = $q.defer();

            UserInformation.ready(function () {
                defered.resolve(Socket);
            });

            return defered.promise;

        },

        registerMe: function () {
            Socket.emit('register-me', LoginTokenFactory.getToken().token);
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