
configModule

.config([
'LogglyLoggerProvider', 'SettingsProvider',
function(LogglyLoggerProvider, SettingsProvider) {

    var Settings = SettingsProvider.$get();
    LogglyLoggerProvider.inputToken(Settings.loggly.token);

}]);
