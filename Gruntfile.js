
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
                    'client/app/main/carouselDescription.js',
                    'client/app/utils/md5.js',

                    'client/lib/jquery/dist/jquery.js',
                    'client/lib/jquery-ui/jquery-ui.min.js',
                    'client/lib/angular/angular.js',
                    'client/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    'client/lib/angular-ui-date/src/date.js',
                    'client/lib/angular-resource/angular-resource.js',
                    'client/lib/angular-route/angular-route.js',
                    'client/lib/angular-translate/angular-translate.js',
                    'client/lib/angular-cookies/angular-cookies.js',
                    'client/lib/angular-loggly-logger/angular-loggly-logger.js',
                    'client/lib/bootstrap/dist/js/bootstrap.js',
                    'client/lib/underscore/underscore-min.js',
                    'client/lib/jsPDF/index.js',

                    'client/app/main/beforeAngularScripts.js',

                    'client/app/utils/utilsModule.js',
                    'client/app/utils/ServerDateFactory.js',
                    'client/app/utils/includeReplace.js',
                    'client/app/utils/onScrollDirective.js',
                    'client/app/utils/Geolocation.js',
                    'client/app/utils/utilServices.js',
                    'client/app/utils/dateSort.js',
                    'client/app/utils/stringSort.js',
                    'client/app/utils/numberSort.js',
                    'client/app/utils/Gravatar.js',

                    'client/app/settings/settingsModule.js',
                    'client/app/settings/Settings.js',

                    'client/app/templates/templatesModule.js',
                    'client/app/templates/templatesProvider.js',

                    'client/app/resources/resourceModule.js',
                    'client/app/resources/ResourceServices.js',

                    'client/app/config/configModule.js',
                    'client/app/config/LanguageServices.js',
                    'client/app/config/UrlLanguageAdderInterceptor.js',
                    'client/app/config/LogglySetup.js',
                    'client/app/config/booting-config.js',
                    'client/app/config/routeProvider.js',
                    'client/app/config/Translations.js',
                    'client/app/config/TokenInterceptor.js',
                    'client/app/config/401-Interceptor.js',
                    'client/app/config/LogglyInterceptor.js',

                    'client/app/user/userModule.js',
                    'client/app/user/UserServices.js',
                    'client/app/user/UserController.js',
                    'client/app/user/RegisterController.js',
                    'client/app/user/AccountActivationController.js',
                    'client/app/user/ChangePasswordController.js',
                    'client/app/user/ForgotPasswordController.js',
                    'client/app/user/ResetPasswordController.js',

                    'client/app/sockets/socketsModule.js',
                    'client/app/sockets/Socket.js',
                    'client/app/sockets/ChatMessage.js',

                    'client/app/chat/chatModule.js',
                    'client/app/chat/ChattingService.js',
                    'client/app/chat/ChatboxesController.js',
                    'client/app/chat/MessagesController.js',
                    'client/app/chat/chatBoxDirective.js',

                    'client/app/ranking/rankingModule.js',
                    'client/app/ranking/RankingController.js',
                    'client/app/ranking/RankingServices.js',

                    'client/app/week/weekModule.js',
                    'client/app/week/weekServices.js',
                    'client/app/week/WeekController.js',
                    'client/app/week/AddNewWeekController.js',
                    'client/app/week/weekDirective.js',

                    'client/app/profile/profileModule.js',
                    'client/app/profile/ProfileController.js',
                    'client/app/profile/ProfileServices.js',

                    'client/app/history/historyModule.js',
                    'client/app/history/HistoryServices.js',
                    'client/app/history/HistoryController.js',

                    'client/app/admin/adminModule.js',
                    'client/app/admin/AdminPanelController.js',
                    'client/app/admin/AdminRankingPanel.js',
                    'client/app/admin/AdminUsersPanel.js',

                    'client/app/rules/rulesModule.js',
                    'client/app/rules/RulesController.js',

                    'client/app/app.js',

                    'client/app/main/WelcomePageController.js',
                    'client/app/main/mainController.js'
                ],
                dest: 'client/dist/built.js'
            }
        },

        uglify: {
                min: {
                    options: {
                        sourceMap: true,
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
