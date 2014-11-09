
/**
 * Sorts an array by date.
 * @field should be a field of all obects of @inputDateArray.
 * @ascendingOrDescending specifies whether to sort ascending or descending (> 0 ascending, < 0 descending, 0 for no sort)
 */
utilsModule
.filter('dateSort',[
function () {
    return function (inputDateArray, field, ascendingOrDescending) {

        if (!field) {
            return inputDateArray;
        }

        if (ascendingOrDescending == 0) {
            return inputDateArray;
        }

        if (!ascendingOrDescending) {
            ascendingOrDescending = 1;
        }

        if (!inputDateArray) {
            return inputDateArray;
        }

        var copiedArray = inputDateArray.slice(0);

        return copiedArray.sort(function (object1, object2) {
            return ascendingOrDescending * (new Date(object1[field]) - new Date(object2[field]));
        });

    }
}
]);
