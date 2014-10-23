userModule

.factory('LoginTokenFactory', [
function () {

    this.setToken = function (token) {
        localStorage.setItem('LoginToken', JSON.stringify(token));
    }

    this.getToken = function () {
        var tok = localStorage.getItem('LoginToken');
        if (tok != null && tok != undefined) {
            return angular.fromJson(tok);
        }
        return null;
    }

    this.deleteToken = function () {
        localStorage.removeItem('LoginToken');
    }

    return this;

}
])

.factory('CheckActivationStatus' , [
'UserInformation', 'RoutesFactory',
function (UserInformation, RoutesFactory) {

    return {
        check: function () {
            if (UserInformation.isLogged && !UserInformation.user.active) {
                RoutesFactory.resetPath();
                RoutesFactory.goToActivation();
            }
        }
    };

}
])

.factory('UserInformation', [
function () {

    var thisFactory = {};

    thisFactory.isLogged = false;
    thisFactory.user = {};

    thisFactory.setUserDetails = function (user) {
        thisFactory.user = {
            _id: user._id,
            active: user.active,
            birthDate: user.birthDate,
            email: user.email,
            place: user.place,
            points: user.points,
            registerDate: user.registerDate,
            role: user.role,
            username: user.username,
            isMailNotificationOn: user.isMailNotificationOn
        };

    }

    return thisFactory;

}
])

.factory('UserInformationCalls', [
'CallUrlService', '$q', 'LoginTokenFactory', 'SHA-2', 'UserInformation', 'InitUrls', 'CheckActivationStatus',
function (CallUrlService, $q, LoginTokenFactory, SHA2, UserInformation, InitUrls, CheckActivationStatus) {

    var infoService = {};

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

    infoService.login = function (initUrls, credentials) {

        var saltPromise = infoService.getSalt(initUrls.auth.salt, credentials.username);

        var defered = $q.defer();

        saltPromise.then(function (data) {

            credentials.password = SHA2.sha256(credentials.password + data.salt);

            CallUrlService.post({uri: initUrls.auth.login}, credentials,
            function (data) {
                UserInformation.isLogged = true;
                LoginTokenFactory.setToken({
                    token: data.token,
                    expires: data.expires,
                    user: data.user
                });
                UserInformation.setUserDetails(data.user);
                defered.resolve({message: "Logged in successfully."});
            },
            function (response) {
                UserInformation.isLogged = false;
                defered.reject(response);
            }
            );

        },function (response) {
            defered.reject(response);
        });

        return defered.promise;

    };

    infoService.fetchUserDetails = function () {

        InitUrls.then(function (urls) {
            CallUrlService.get({uri: urls.user.details},
            function (data) {
                UserInformation.setUserDetails(data);
                CheckActivationStatus.check();
            },
            function (response) {

            });
        });

    }

    infoService.logout = function () {
        UserInformation.isLogged = false;
        LoginTokenFactory.deleteToken();
    }

    infoService.extendTokenExpiration = function () {
        InitUrls.then(function (urls) {
            CallUrlService.get({uri: urls.auth.extendToken},
                function (data) {
                    UserInformation.isLogged = true;
                    LoginTokenFactory.setToken({
                        token: data.token,
                        expires: data.expires,
                        user: data.user
                    });
                    UserInformation.setUserDetails(data.user);
                    CheckActivationStatus.check();
                },
                function (response) {
                    console.log("Couldn't extend token.");
                    infoService.logout();
                });
        });
    }

    var checkLoginToken = function () {
        var token = LoginTokenFactory.getToken();
        if (token != null && new Date() < new Date(token.expires)) {

            UserInformation.isLogged = true;
            UserInformation.setUserDetails(token.user);

            infoService.extendTokenExpiration();

        }
        else {
            infoService.logout();
        }
    }

    checkLoginToken();

    return infoService;

}
])

.factory('RolesFactory', [
'InitUrls', 'CallUrlService', '$q',
function (InitUrls, CallUrlService, $q) {

    var thisFactory = {};

    thisFactory.rolesError = false;
    thisFactory.loaded = false;

    thisFactory.load = function () {

        var deferred = $q.defer();

        InitUrls.then(function (data) {

            CallUrlService.get({uri: data.user.roles},
                function (data) {
                    thisFactory.roles = data;
                    thisFactory.loaded = true;
                    thisFactory.rolesError = false;
                    deferred.resolve();
                },
                function (response) {
                    thisFactory.rolesError = true;
                    deffered.reject();
                }
            );
        });

        return deferred.promise;

    }

    thisFactory.load();

    thisFactory.userHasRole = function (userRoleName, role) {
        if (!thisFactory.loaded) {
            return false;
        }
        var userRoleObject = _.find(thisFactory.roles, function (item) {
            return item.name == userRoleName;
        });
        if (userRoleObject == null && userRoleObject == undefined) {
            return false;
        }
        return userRoleObject.value >= role.value;
    }

    thisFactory.findRoleByName = function (roleName) {
        if (!thisFactory.loaded) {
            return null;
        }
        return _.find(thisFactory.roles, function (role) {
            return role.name == roleName;
        });
    }

    thisFactory.roleCompare = function (roleName1, roleName2) {
        if (thisFactory.findRoleByName(roleName1).value == thisFactory.findRoleByName(roleName2).value) {
            return 0;
        }
        return (thisFactory.findRoleByName(roleName1).value > thisFactory.findRoleByName(roleName2).value) ? 1 : -1;
    }

    return thisFactory;

}
])

.factory('ActivationFactory', [
'InitUrls', 'CallUrlService',
function (InitUrls, CallUrlService) {

    var thisFactory = {};

    thisFactory.status = {
        success: false,
        error: false,
        inProgress: false,
        message: ''
    };

    thisFactory.activate = function (regCode, onSuccess, onError) {

        thisFactory.status.inProgress = true;

        InitUrls.then(function (urls) {
            CallUrlService.post({uri: urls.user.activate},
            {registrationCode: regCode},
            function (data) {
                thisFactory.status.inProgress = false;
                thisFactory.status.success = true;
                thisFactory.status.error = false;
                if (typeof onSuccess === 'function') {
                    onSuccess(data);
                }
            },
            function (response) {
                thisFactory.status.inProgress = false;
                thisFactory.status.success = false;
                thisFactory.status.error = true;
                if (response.data.message) {
                    thisFactory.status.message = response.data.message;
                }
                else {
                    thisFactory.status.message = "Account couldn't be activated";
                }
                if (typeof onError === 'function') {
                    onError();
                }
            });
        });
    }

    thisFactory.resendRegistrationCode = function (onSuccess, onError) {
        InitUrls.then(function (urls) {
            CallUrlService.get({uri: urls.user.resendRegistrationCode},
                function (data) {
                    if (typeof onSuccess === 'function') {
                        onSuccess(data);
                    }
                },
                function (response) {
                    if (typeof onError === 'function') {
                        onError(response.data);
                    }
                });
        });
    }

    return thisFactory;

}
])

;