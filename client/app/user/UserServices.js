userModule

.factory('LoginTokenFactory', [
'$cookieStore',
function ($cookieStore) {

    this.setToken = function (token) {
        $cookieStore.put('LoginToken', token);
    }

    this.getToken = function () {
        return $cookieStore.get('LoginToken');
    }

    return this;

}
])

.factory('UserInformation', [
'CallUrlService', '$q', 'LoginTokenFactory', 'SHA-2',
function (CallUrlService, $q, LoginTokenFactory, SHA2) {

    var infoService = {};

    infoService.isLogged = false;
    infoService.user = {};

    infoService.getSalt = function (saltAddress, username) {

        var defered = $q.defer();

        CallUrlService.post({uri: saltAddress}, {username: username},
        function (data) {
            defered.resolve(data);
        },
        function (response) {
            defered.reject(response);
        }
        );

        return defered.promise;

    }

    var setUserDetails = function (user) {
        infoService.user = {
            _id: user._id,
            birthDate: user.birthDate,
            email: user.email,
            place: user.place,
            points: user.points,
            registerDate: user.registerDate,
            role: user.role,
            username: user.username
        };
    }

    infoService.login = function (initUrls, credentials) {

        var saltPromise = infoService.getSalt(initUrls.auth.salt, credentials.username);

        saltPromise.then(function (data) {

            credentials.password = SHA2.sha256(credentials.password + data.salt);

            CallUrlService.post({uri: initUrls.auth.login}, credentials,
            function (data) {
                infoService.isLogged = true;
                LoginTokenFactory.setToken({
                    token: data.token,
                    expires: data.expires
                });
                setUserDetails(data.user);
            },
            function (response) {
                infoService.isLogged = false;
            }
            );

        },function (response) {

        });

    };

    return infoService;

}
])
;