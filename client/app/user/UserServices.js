userModule

.factory('UserInformation', [
function () {

    this.isLogged = false;

    this.login = function () {
        this.isLogged = true;
    }

    return this;

}
])
;