
/**
* Sorts an array using string comparison. The compared string is given by @field param.
* @ascendingOrDescending specifies whether to sort ascending or descending (> 0 ascending, < 0 descending, 0 for no sort)
*/
utilsModule
.filter('stringSort',[
    function () {
        return function (inputStringArray, field, ascendingOrDescending) {

            if (!field) {
                return inputStringArray;
            }

            if (ascendingOrDescending == 0) {
                return inputStringArray;
            }

            if (!ascendingOrDescending) {
                ascendingOrDescending = 1;
            }

            if (!inputStringArray) {
                return inputStringArray;
            }

            var copiedArray = inputStringArray.slice(0);

            return copiedArray.sort(function (object1, object2) {
                if (object1[field] > object2[field]) {
                    return ascendingOrDescending;
                }
                return -ascendingOrDescending;
            });

        }
    }
]);

