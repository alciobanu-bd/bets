
teamModule
.filter(
'countriesSortedFilter', [
'CountryCodes',
function (CountryCodes) {

    return function (inputObject) {

        var array = [];

        for (var i in inputObject) {
            array.push(CountryCodes.getCountryByCode(i));
        }

        array = array.sort(function (country1, country2) {
            if (country1.name > country2.name) {
                return 1;
            }
            return -1;
        });

        return array;

    }

}
]);
