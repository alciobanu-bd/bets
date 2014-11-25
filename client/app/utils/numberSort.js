

/**
* Sorts an array using number comparison. The compared field is given by @field param.
* @ascendingOrDescending specifies whether to sort ascending or descending (> 0 ascending, < 0 descending, 0 for no sort)
*/
utilsModule
.filter('numberSort',[
    function () {
        return function (inputArray, field, ascendingOrDescending) {

            if (!field) {
                return inputArray;
            }

            if (ascendingOrDescending == 0) {
                return inputArray;
            }

            if (!ascendingOrDescending) {
                ascendingOrDescending = 1;
            }

            if (!inputArray) {
                return inputArray;
            }

            var copiedArray = inputArray.slice(0);

            return copiedArray.sort(function (object1, object2) {
                return ascendingOrDescending * (object1[field] - object2[field]);
            });

        }
    }
]);

