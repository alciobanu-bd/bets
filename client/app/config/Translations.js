
configModule.config([
'$translateProvider',
function ($translateProvider) {
    $translateProvider.translations('en', {
        header: {
            logged: {
                home: 'Home',
                play: 'Play',
                ranking: 'Ranking',
                rules: 'Rules',
                place: 'Place',
                points: 'Points',
                myProfile: 'My Profile',
                changePassword: 'Change Password',
                adminPanel: 'Admin Panel',
                history: 'History',
                logout: 'Logout'
            },
            notLogged: {
                home: 'Home',
                register: 'Register',
                login: 'Come on in'
            }
        },
        homePage: {
            logged: {
                welcome: 'Welcome'
            },
            notLogged: {
                welcome: 'Welcome to CanIHazBets! Join the fun. Register now.'
            }
        },
        loginPage: {
            name: 'Login',
            forgotPassword: 'Forgot password',
            username: 'Username',
            password: 'Password',
            keepMeLoggedInFor: 'Keep me logged in for',
            days: 'days',
            loginButton: 'Come on in'
        },
        registerPage: {
            name: 'Create a new account',
            username: 'Username',
            password: 'Password',
            confirmPassword: 'Confirm password',
            email: 'E-mail',
            birthDate: 'Birth date',
            registerButton: 'Register'
        },
        forgotPasswordPage: {
            name: 'Forgot password',
            insertIndications: 'Insert your username or e-mail to recover your forgotten password.',
            usernameOrEmail: 'Username or e-mail',
            recover: 'Recover',
            yes: 'Yes',
            no: 'No'
        },
        resetPasswordPage: {
            name: 'Reset password',
            insertIndications: 'Please insert your new password and confirm it.',
            receivedResetCode: 'Reset code received on e-mail',
            newPassword: 'New password',
            confirmPassword: 'Confirm password',
            changePassword: 'Change password',
            yes: 'Yes',
            no: 'No'
        },
        weekPage: {
            name: 'Weeks and bets',
            noWeeksMessage: 'Fun hasn\'t start yet. Please come back soon.',
            searchByNumber: 'Search week by number',
            show: 'Show',
            reset: 'Reset',
            sendEmailsAfterNewWeek: 'Send e-mails to all users of the site to notify them there\'s a new week that ' +
                'they can play. They\'ll receive a list of all matches of the latest non-hidden week.',
            sendMailNotificationButton: 'Send mail notifications',
            yes: 'Yes',
            no: 'No',
            weekDirective: {
                hidden: 'HIDDEN',
                winner: 'WINNER',
                week: 'Week',
                inProgress: 'in progress',
                ended: 'ended',
                waitingForResults: 'waiting for results',
                edit: 'Edit',
                viewAllBets: 'View all bets',
                totalMatches: 'total matches',
                youAreRequiredToPlay: 'You are required to play',
                ofThem: 'of them',
                totalMatchesThisWeek: 'total matches this week',
                youWereRequiredToPlay: 'You were required to play',
                deadline: 'Deadline',
                today: 'Today',
                tomorrow: 'Tomorrow',
                youReTheWinnerOfTheWeek: 'You\'re the winner of the week!',
                betPlacementIsntAvailable: 'Bet placement isn\'t available anymore for this week.',
                betButton: 'Bet',
                yes: 'Yes',
                no: 'No',
                warningScoreDifferenceTooHigh: 'Warning! Score difference is quite big for the highlighted bets.',
                areYouSureYouDidntTypeWrongScore: 'Are you sure you didn\'t type the wrong score?',
                youWon: 'You won',
                pointsThisWeek: 'points this week.',
                youWonOnePointThisWeek: 'You won 1 point this week.',
                youWonNoPointsThisWeek: 'You won no points this week.',
                youDidntPlaceYouWonNoPoints: 'You didn\'t place a bet this week. Therefore you won no points.',
                updateResults: 'Update results',
                youAreInUpdateModeEditResults: 'You are in update mode. Enter the correct results for each event ' +
                    'like when you normally play them.',
                theyWillBeSavedAsResults: 'They will be saved as results and not as a bet.',
                toggleBackToNormalMode: 'Toggle back to normal mode',
                saveResults: 'Save results'
            }
        }
    });


    $translateProvider.translations('ro', {
        header: {
            logged: {
                home: 'Acasă',
                play: 'Joacă',
                ranking: 'Clasament',
                rules: 'Reguli',
                place: 'Loc',
                points: 'Puncte',
                myProfile: 'Profilul meu',
                changePassword: 'Schimbă parola',
                adminPanel: 'Panou admin',
                history: 'Istoric',
                logout: 'Delogare'
            },
            notLogged: {
                home: 'Acasă',
                register: 'Înregistrare',
                login: 'Loghează-te'
            }
        },
        homePage: {
            logged: {
                welcome: 'Bun venit'
            },
            notLogged: {
                welcome: 'Bine ai venit pe CanIHazBets! Alătură-te distracției. Înregistrează-te acum.'
            }
        },
        loginPage: {
            name: 'Logare',
            forgotPassword: 'Ai uitat parola?',
            username: 'Nume de utilizator',
            password: 'Parolă',
            keepMeLoggedInFor: 'Păstrează-mă logat pentru',
            days: 'zile',
            loginButton: 'Loghează-mă'
        },
        registerPage: {
            name: 'Creează-ți un cont nou',
            username: 'Nume de utilizator',
            password: 'Parolă',
            confirmPassword: 'Confirmă parola',
            email: 'E-mail',
            birthDate: 'Dată de naștere',
            registerButton: 'Înregistrare'
        },
        forgotPasswordPage: {
            name: 'Parolă uitată',
            insertIndications: 'Introduceți numele de utilizator sau e-mail-ul pentru a vă recupera parola uitată.',
            usernameOrEmail: 'Nume de utilizator sau e-mail',
            recover: 'Recuperează',
            yes: 'Da',
            no: 'Nu'
        },
        resetPasswordPage: {
            name: 'Resetare parolă',
            insertIndications: 'Vă rugăm introduceți noua parolă și confirmați-o.',
            receivedResetCode: 'Codul de resetare primit prin e-mail',
            newPassword: 'Parola nouă',
            confirmPassword: 'Confirmă parola',
            changePassword: 'Schimbă parola',
            yes: 'Da',
            no: 'Nu'
        },
        weekPage: {
            name: 'Etape și pariuri',
            noWeeksMessage: 'Distracția n-a început încă. Te rugăm să revii în curând.',
            searchByNumber: 'Caută după numărul etapei',
            show: 'Arată',
            reset: 'Resetează',
            sendEmailsAfterNewWeek: 'Trimite e-mail-uri către toți userii site-ului pentru a-i notifica despre ' +
                'existența unei noi etape. Aceștia vor primi lista meciurilor ultimei etape publicate (neascunse).',
            sendMailNotificationButton: 'Trimite notificări',
            yes: 'Da',
            no: 'Nu',
            weekDirective: {
                hidden: 'ASCUNS',
                winner: 'CÂȘTIGĂTOR',
                week: 'Etapa',
                inProgress: 'în curs',
                ended: 'terminată',
                waitingForResults: 'se așteaptă rezultatele',
                edit: 'Editează',
                viewAllBets: 'Vezi toate pariurile',
                totalMatches: 'meciuri în total',
                youAreRequiredToPlay: 'Ești obligat să joci',
                ofThem: 'din ele',
                totalMatchesThisWeek: 'meciuri în total în această etapă',
                youWereRequiredToPlay: 'Era obligatoriu să joci',
                deadline: 'Termen limită',
                today: 'Astăzi',
                tomorrow: 'Mâine',
                youReTheWinnerOfTheWeek: 'Ești câștigătorul acestei etape!',
                betPlacementIsntAvailable: 'Parierea nu mai este posibilă pentru această etapă.',
                betButton: 'Pariază',
                yes: 'Da',
                no: 'Nu',
                warningScoreDifferenceTooHigh: 'Atenție! Diferența de scor este destul de mare pentru evenimentele evidențiate.',
                areYouSureYouDidntTypeWrongScore: 'Sigur nu ai greșit când ai scris scorurile?',
                youWon: 'Ai câștigat',
                pointsThisWeek: 'puncte etapa aceasta.',
                youWonOnePointThisWeek: 'Ai câștigat un punct etapa aceasta.',
                youWonNoPointsThisWeek: 'Nu ai câștigat niciun punct etapa aceasta.',
                youDidntPlaceYouWonNoPoints: 'Nu ai plasat pariul tău etapa aceasta. Nu ai câștigat niciun punct.',
                updateResults: 'Actualizează rezultatele',
                youAreInUpdateModeEditResults: 'Ești în modul actualizare rezultate. Introdu rezultatele corecte pentru ' +
                    'meciuri ca și cum ai paria pe ele.',
                theyWillBeSavedAsResults: 'Acestea se vor salva ca rezultate oficiale și nu ca pariu.',
                toggleBackToNormalMode: 'Revino la modul normal',
                saveResults: 'Salvează rezultatele'
            }
        }
    });
    $translateProvider.preferredLanguage('ro');
}]);
