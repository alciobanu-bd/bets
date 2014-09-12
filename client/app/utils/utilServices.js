
utilsModule

.factory('SaltGenerator', [
function () {
    return {
        generate: function () {
            return Math.random().toString(36).substring(7);
        }
    };
}
]);
