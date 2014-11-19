
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
            },
            addNewWeekPage: {
                addNewWeek: 'Add new week',
                week: 'Week',
                newWeekDescription: 'Write how many total matches you want to add and how many of them should be ' +
                'required for users to be played. ' +
                'Recommended numbers are 3-5 for total and 3 for required. ' +
                'Imediately after you publish the events, other users will see the matches and ' +
                'will be able to place their bets. ' +
                'After saving a new week, you can press refresh to see that it really saved successfully.',
                totalMatches: 'Total matches',
                required: 'Required',
                hidden: 'Hidden',
                homeTeam: 'Home team',
                awayTeam: 'Away team',
                startDate: 'Start date',
                competition: 'Competition',
                publish: 'Publish',
                yes: 'Yes',
                no: 'No',
                refresh: 'Refresh'
            },
            weekEdit: {
                week: 'Week',
                warning1: 'Use the editing functionality with care. ' +
                    'Note that if player already placed the bets, their bets can be corrupted if week changes.',
                warning2: 'Therefore this functionality should be used only in clear situations when it is needed, ' +
                    'like solving a typo or a match starting time.',
                warning3: 'Do NOT add/remove an event or change the deadline drastically if a long time ' +
                'has passed since the week has been published.',
                requiredMatches: 'Required matches',
                required: 'Required',
                event: 'Event',
                date: 'Date',
                time: 'Time',
                competition: 'Competition',
                homeTeam: 'Home team',
                awayTeam: 'Away team',
                closeButton: 'Close',
                addNewEvent: 'Add new event',
                resetScores: 'Reset scores',
                hidden: 'Hidden',
                cancel: 'Cancel'
            }
        },
        rankingPage: {
            name: 'Ranking',
            downloadAsPdf: 'Download as pdf',
            searchUser: 'Search user',
            place: 'Place',
            username: 'Username',
            points: 'Points',
            average: 'Average',
            wins: 'Wins',
            registerDate: 'Register date',
            loadMore: 'Load more',
            userRanking: {
                username: 'Username',
                place: 'Place',
                points: 'Points',
                average: 'Average',
                wonWeeks: 'Won weeks',
                awards: 'Awards',
                userRank: 'User rank',
                gainedForWinningAWeek: 'Gained for winning a week',
                registerDate: 'Register date',
                viewHistory: 'View history',
                closeButton: 'Close'
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
            },
            addNewWeekPage: {
                addNewWeek: 'Adaugă o etapă nouă',
                week: 'Etapa',
                newWeekDescription: 'Scrie câte meciuri vrei să adaugi și câte meciuri vor fi obligatorii ' +
                'să fie jucate. ' +
                'Este recomandat ca numărul total de meciuri să fie 3-5, dintre care 3 obligatorii. ' +
                'Imediat după ce evenimentele sunt publicate, ceilalți utilizatori le vor putea vedea și ' +
                'vor putea să plaseze pariuri pe ele. ' +
                'După ce o etapă este salvată, poți apăsa reîncarcă pentru a vedea noua etapă salvată.',
                totalMatches: 'Meciuri totale',
                required: 'Obligatorii',
                hidden: 'Ascuns',
                homeTeam: 'Echipa gazdă',
                awayTeam: 'Echipa oaspete',
                startDate: 'Data de start',
                competition: 'Competiția',
                publish: 'Publică',
                yes: 'Da',
                no: 'Nu',
                refresh: 'Reîncarcă'
            },
            weekEdit: {
                week: 'Etapa',
                warning1: 'Folosiți funcționalitatea de editare cu precauție. ' +
                    'Aveți în vedere că dacă un jucător și-a plasat pariurile deja, acestea se pot corupe dacă ' +
                    'etapa se schimbă.',
                warning2: 'Așadar această funcționalitate trebuie folosită doar în situații clare, doar atunci ' +
                    'când este necesar, ca în rezolvarea unei greșeli în numele meciului sau în data de începere.',
                warning3: 'Nu adăugați/ștergeți un eveniment și nu schimbați drastic termenul limită dacă etapa ' +
                    'a fost publicată de mult timp.',
                requiredMatches: 'Meciuri obligatorii',
                required: 'Obligatorii',
                event: 'Eveniment',
                date: 'Data',
                time: 'Ora',
                competition: 'Competiția',
                homeTeam: 'Echipa gazdă',
                awayTeam: 'Echipa oaspete',
                closeButton: 'Închide',
                addNewEvent: 'Adaugă un eveniment nou',
                resetScores: 'Resetează scorurile',
                hidden: 'Ascuns',
                cancel: 'Anulează'
            }
        },
        rankingPage: {
            name: 'Clasament',
            downloadAsPdf: 'Descarcă pdf',
            searchUser: 'Caută un utilizator',
            place: 'Loc',
            username: 'Nume de utilizator',
            points: 'Puncte',
            average: 'Medie',
            wins: 'Victorii',
            registerDate: 'Data înregistrării',
            loadMore: 'Mai multe',
            userRanking: {
                username: 'Nume de utilizator',
                place: 'Loc',
                points: 'Puncte',
                average: 'Media',
                wonWeeks: 'Etape câștigate',
                awards: 'Premii',
                userRank: 'Rangul de utilizator',
                gainedForWinningAWeek: 'Obținut în urma câștigării unei etape',
                registerDate: 'Data înregistrării',
                viewHistory: 'Vezi istoricul',
                closeButton: 'Închide'
            }
        }
    });
    $translateProvider.preferredLanguage('ro');
}]);
