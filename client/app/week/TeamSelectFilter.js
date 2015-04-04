
weekModule
.filter('teamSelect', [
function () {
    return function (inputArray, searchWord) {

        return _.filter(inputArray, function (item) {
            return new RegExp(searchWord, "i").test(item.searchingWord) || item.isSpecialSelection;
        });

    }
}
]);
