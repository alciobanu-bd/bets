
'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({

        concat: {
            options: {
                separator: '\r\n'
            },
            dist: {
                src: [
                        'app/main/carouselDescription.js',
                        'app/utils/md5.js',
                        'lib/Autolinker.js/dist/Autolinker.js',

                        'lib/jquery/dist/jquery.js',
                        'lib/jquery-ui/jquery-ui.min.js',

                        'app/main/beforeAngularScripts.js',

                        'lib/angular/angular.js',
                        'lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                        'lib/angular-ui-date/src/date.js',
                        'lib/angular-resource/angular-resource.js',
                        'lib/angular-route/angular-route.js',
                        'lib/angular-translate/angular-translate.js',
                        'lib/angular-cookies/angular-cookies.js',
                        'lib/angular-loggly-logger/angular-loggly-logger.js',
                        'lib/bootstrap/dist/js/bootstrap.js',
                        'lib/underscore/underscore-min.js',
                        'lib/jsPDF/index.js',

                        'app/config/includeAngularLocale.js',

                        'app/utils/utilsModule.js',
                        'app/utils/ServerDateFactory.js',
                        'app/utils/includeReplace.js',
                        'app/utils/onScrollDirective.js',
                        'app/utils/Geolocation.js',
                        'app/utils/utilServices.js',
                        'app/utils/dateSort.js',
                        'app/utils/stringSort.js',
                        'app/utils/numberSort.js',
                        'app/utils/Gravatar.js',
                        'app/utils/CountryServices.js',
                        'app/utils/FileModelDirective.js',

                        'app/settings/settingsModule.js',
                        'app/settings/Settings.js',

                        'app/templates/templatesModule.js',
                        'app/templates/templatesProvider.js',

                        'app/resources/resourceModule.js',
                        'app/resources/ResourceServices.js',

                        'app/config/configModule.js',
                        'app/config/LanguageServices.js',
                        'app/config/UrlLanguageAdderInterceptor.js',
                        'app/config/LogglySetup.js',
                        'app/config/booting-config.js',
                        'app/config/routeProvider.js',
                        'app/config/Translations.js',
                        'app/config/TokenInterceptor.js',
                        'app/config/401-Interceptor.js',
                        'app/config/LogglyInterceptor.js',

                        'app/user/userModule.js',
                        'app/user/UserServices.js',
                        'app/user/UserController.js',
                        'app/user/RegisterController.js',
                        'app/user/AccountActivationController.js',
                        'app/user/ChangePasswordController.js',
                        'app/user/ForgotPasswordController.js',
                        'app/user/ResetPasswordController.js',

                        'app/sockets/socketsModule.js',
                        'app/sockets/Socket.js',
                        'app/sockets/ChatMessage.js',

                        'app/chat/chatModule.js',
                        'app/chat/ChattingService.js',
                        'app/chat/ChatboxesController.js',
                        'app/chat/MessagesController.js',
                        'app/chat/chatBoxDirective.js',

                        'app/ranking/rankingModule.js',
                        'app/ranking/RankingController.js',
                        'app/ranking/RankingServices.js',

                        'app/team/teamModule.js',
                        'app/team/countriesSortedFilter.js',
                        'app/team/exlcudeTeamByCountryObject.js',
                        'app/team/TeamServices.js',
                        'app/team/AddNewTeamController.js',
                        'app/team/TeamController.js',
                        'app/team/TeamProfileController.js',

                        'app/week/weekModule.js',
                        'app/week/TeamSelectFilter.js',
                        'app/week/weekServices.js',
                        'app/week/WeekController.js',
                        'app/week/AddNewWeekController.js',
                        'app/week/weekDirective.js',

                        'app/profile/profileModule.js',
                        'app/profile/ProfileController.js',
                        'app/profile/ProfileServices.js',

                        'app/history/historyModule.js',
                        'app/history/HistoryServices.js',
                        'app/history/HistoryController.js',

                        'app/admin/adminModule.js',
                        'app/admin/AdminPanelController.js',
                        'app/admin/AdminRankingPanel.js',
                        'app/admin/AdminUsersPanel.js',

                        'app/rules/rulesModule.js',
                        'app/rules/RulesController.js',

                        'app/app.js',

                        'app/main/WelcomePageController.js',
                        'app/main/mainController.js'
                ],
                dest: 'client/dist/built.js'
            }
        },

        uglify: {
                min: {
                    options: {
                        sourceMap: false,
                        sourceMapName: 'client/dist/built.map'
                    },
                    files: {
                        'client/dist/built.min.js': ['client/dist/built.js']
                    }
                }
            }
        }
    );


    grunt.registerTask('cat-min', function() {
        grunt.task.run(
            [
                'concat',
                'uglify'
            ]
        );
    });

    grunt.registerTask('clean-dist', function() {
        grunt.task.run(
            [
                'clean:clean_dist'
            ]
        );
    });

};
