
configModule.config([
'$translateProvider', 'LanguagesProvider', 'CurrentLanguageFactoryProvider',
function ($translateProvider, LanguagesProvider, CurrentLanguageFactoryProvider) {

    var Languages = LanguagesProvider.$get();
    var CurrentLanguageFactory = CurrentLanguageFactoryProvider.$get();

    $translateProvider.translations(Languages.list.english.code, {
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
                logout: 'Logout',
                messages: 'Messages'
            },
            notLogged: {
                home: 'Home',
                register: 'Register',
                login: 'Come on in',
                dontHaveAnAccountRegister: 'Don\'t have an account? Register now!',
                haveAnAccountSignIn: 'Have an account? Sign in.'
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
            loginButton: 'Come on in',
            loggedInSuccessfully: 'Logged in successfully!'
        },
        registerPage: {
            name: 'Create a new account',
            username: 'Username',
            password: 'Password',
            confirmPassword: 'Confirm password',
            email: 'E-mail',
            birthDate: 'Birth date',
            registerButton: 'Register',
            successfullyCreated: 'Your account was successfully created.' +
                'An activation code will be e-mailed to you shortly.',
            failureCreating: 'Account wasn\'t created. Highlighted fields are required.',
            birthDate_too_young: 'You are too young to register.',
            email_not_valid: "E-mail is not valid.",
            email_too_long: 'E-mail is too long.',
            username_too_long: 'Username is too long.',
            maxSize: 'Maximum allowed length is'
        },
        forgotPasswordPage: {
            name: 'Forgot password',
            insertIndications: 'Insert your username or e-mail to recover your forgotten password.',
            usernameOrEmail: 'Username or e-mail',
            recover: 'Recover',
            yes: 'Yes',
            no: 'No',
            errorResponseMessage: 'An error occurred and a reset code couldn\'t be sent to you.'
        },
        resetPasswordPage: {
            name: 'Reset password',
            insertIndications: 'Please insert your new password and confirm it.',
            receivedResetCode: 'Reset code received on e-mail',
            newPassword: 'New password',
            confirmPassword: 'Confirm password',
            changePassword: 'Change password',
            yes: 'Yes',
            no: 'No',
            resetSuccessful: 'Your password was reset successfully. Now you can use it to log into your account.',
            couldntReset: 'We couldn\'t reset your password. Please try again.'
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
            mailNotificationsNotSent: 'Notification e-mails couldn\'t be sent. Please try again.' +
                'If problem persists, talk to a developer.',
            anErrorTryingToFetchWeekNo: 'An error occurred while trying to fetch week #',
            anErrorTryingToFetchAWeek: 'An error occurred while trying to fetch week.',
            anErrorTryingToFetchBets: 'An error occurred while trying to fetch your bets.',
            betPlacementSuccess: 'Your bet was successfully placed.',
            betPlacementError: 'Your bet wasn\'t placed. Please try again.',
            betChangeSuccess: 'Your bet was successfully changed.',
            anErrorOccurred: 'An error occurred.',
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
                saveResults: 'Save results',
                afterUpdateSuccess: 'The results were saved successfully.',
                afterUpdateError: 'The results saved with errors. Please try to save them again urgently. ' +
                'If the problem persists, contact the developers as soon as you can.'
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
                refresh: 'Refresh',
                weekSavedSuccessfully: 'Week saved successfully.',
                weekDidntSave: 'Week didn\'t save. Please try again.',
                addNewTeam: 'Add new team'
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
            },
            weekHistory: {
                week: 'Week',
                history: 'History',
                nextText: 'Next',
                prevText: 'Previous',
                firstText: 'First',
                lastText: 'Last',
                won: 'won',
                thisWeek: 'this week',
                point: 'point',
                points: 'points',
                whosBets_prefix: '',
                whosBets_suffix: '\'s bets',
                notEnded: 'Not ended',
                error: 'Error',
                noBets: 'No bets',
                seemsThatArentBets: 'It seems that there aren\'t any bets to show.',
                closeButton: 'Close',
                couldntBeFetched: 'History couldn\'t be fetched.'
            },
            addNewTeamPage: {
                newTeam: "New team",
                name: "Name",
                nicknames: "Nicknames (comma separated)",
                details: "Details about team",
                city: "City",
                yearFounded: "Year founded",
                country: "Country",
                ground: "Ground",
                stadiumCapacity: "Stadium capacity",
                website: "Website",
                isClub: "If club, select Yes, if national team, select No"
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
                preferredLanguage: 'Preferred language',
                awards: 'Awards',
                userRank: 'User rank',
                gainedForWinningAWeek: 'Gained for winning a week',
                registerDate: 'Register date',
                viewHistory: 'View history',
                closeButton: 'Close',
                sendMessage: 'Send message'
            }
        },
        historyPage: {
            name_prefix: '',
            name_suffix: '\'s history',
            noHistoryItems: 'No history items available at them moment.',
            week: 'Week',
            endedOn: 'ended on',
            inProgress: 'in progress',
            noBetPlacedThisWeek: 'No bets were placed this week.',
            startTime: 'Start time',
            event: 'Event',
            competition: 'Competition',
            bet: 'Bet',
            result: 'Result',
            points: 'Points',
            totalPoints: 'Total points'
        },
        profilePage: {
            name: 'Account details',
            username: 'Username',
            email: 'E-mail',
            birthDate: 'Birth date',
            registerDate: 'Register date',
            place: 'Place',
            points: 'Points',
            average: 'Average',
            awards: 'Awards',
            userRank: 'User rank',
            notifyViaEmail: 'Notify me via e-mail about site news.',
            gainedForWinningAWeek: 'Gained for winning a week',
            preferredLanguage: 'Preferred language',
            saveChanges: 'Save changes',
            yes: 'Yes',
            no: 'No',
            yourPreferencesSaved: 'Your preferences were saved.',
            yourPreferencesDidntSaved: 'We couldn\'t save your preferences. Sorry \'bout that.',
            errorFetching: 'An error occurred while fetching profile information.'
        },
        activationPage: {
            name: 'Activation',
            explanations_prefix: 'If you don\'t have an activation code, you can',
            explanations_resendLink: 'resend',
            explanations_suffix: 'one to your e-mail.',
            ifYouDontReceiveMail: 'If you don\'t receive your activation code via e-mail, ' +
                'please contact us to contact@canihazbets.me.',
            activationCode: 'Activation code',
            activateButton: 'Activate',
            couldntActivate: 'Account couldn\'t be activated'
        },
        changePasswordPage: {
            name: 'Change password',
            explanations1: 'After you change password, you will receive a confirmation code on your e-mail.',
            oldPassword: 'Old password',
            newPassword: 'New password',
            confirmPassword: 'Confirm password',
            changeBtn: 'Change',
            yes: 'Yes',
            no: 'No',
            successChangeMessage: 'Your password was changed successfully. Please check your e-mail.',
            errorChangeMessage: 'We couldn\'t change your password. Please try again.'
        },
        adminPanelPage: {
            name: 'Admin panel',
            users: 'Users',
            ranking: 'Ranking',
            rankingPage: {
                descriptionRecalculation: 'Use the above button to recalculate points and places for all users. ' +
                    'DO NOT abuse this button!',
                recalculateButton: 'Recalculate',
                pointsCalculatedSuccessfully: 'Points and places were recalculated successfully.',
                pointsWerentCalculated: 'The recalculation wasn\'t completed successfully. ' +
                'Please try again and, if problem persists, contact a developer.'

            },
            usersPage: {
                searchUser: 'Search user',
                username: 'Username',
                lastLogin: 'Last login',
                email: 'E-mail',
                pts: 'Pts',
                rank: 'Rank',
                registrationIP: 'Registration IP',
                preferredLanguage: 'Preferred language',
                place: 'Place',
                points: 'Points',
                average: 'Average',
                userRank: 'User rank',
                birthDate: 'Birth date',
                registerDate: 'Register date',
                active: 'Active',
                yes: 'Yes',
                no: 'No',
                disabled: 'Disabled',
                anErrorHasOcurred: 'An error has occurred. Your options weren\'t saved.',
                cancelButton: 'Cancel',
                locationsNoItemsMessage: 'No location details about this user.',
                loginLocations: 'Login locations',
                date: 'Date',
                organization: 'Organization',
                city: 'City',
                region: 'Region',
                country: 'Country',
                timezone: 'Timezone',
                coordinates: 'Coordinates',
                errorLocations: 'Error loading location details.'
            }
        },
        rulesPage: {
            howToPlay: {
                name: 'How to play',
                div1: 'Each week, an admin chooses a bunch of football matches which are scheduled to be played that week. ' +
                    'After the matches are chosen, the betting starts.',
                div2: 'In order to win as many points as possible, ' +
                    'you have to guess what the score will be for a number of events. ' +
                    'This number is predefined and shown on each week. ' +
                    'If you play less or more matches, you will get an error.',
                div3: 'Here\'s how the points are gained. ' +
                    'If you guess the exact score for an event, you get 3 points. ' +
                    'If you don\'t guess the exact score, but you guess the difference ' +
                    'between teams, as well as the winner team, ' +
                    'you get 2 points. ' +
                    'For example, let\'s say A plays against B. So we have A vs. B event. ' +
                    'If your score is 3-1 and the result is 2-0, ' +
                    'you get the 2 points. If you say 0-2, you don\'t get any points. ' +
                    'The same rule applies for draws. ' +
                    'If you say 1-1 and the result is 2-2, 3-3 or any other draw (except 1-1), ' +
                    'you get 2 points for guessing the score difference.',
                div4: 'If you don\'t guess the exact score and you don\'t guess the difference either, ' +
                    ' your chance is that the team you bet on wins the match by any score. ' +
                    'In this case, you get 1 point. For the same event, A vs. B, ' +
                    'a guess of 3-1 gets you 1 point if the result is 1-0, 2-1, 3-2, 4-1, 3-0 etc. You get the point.',
                div5: 'If you really have bad luck and bet on a losing team, you win no points.',
                div6: 'Every week will have a deadline. ' +
                    'After that moment, betting is closed and you cannot play anymore. ' +
                    'This deadline is one hour before the first match of the week starts.',
                div7: 'Ranking is calculated for all users after an admin inserts the results ' +
                    'for the matches of the current week. ' +
                    'If you notice any miscalculation, please contact an administrator. ' +
                    'You can use contact@canihazbets.me any time you need.'
            },
            userRanks: {
                name: 'User ranks',
                listOfRanks: 'List of user ranks and their description:',
                q1: 'Q: I\'ve seen here and there the word root associated to a user rank. What does this rank mean?',
                a1: 'A: Root is the rank of the superuser. ' +
                    'It is inspired from the Linux community where root is the username ' +
                    'of the user with the greatest privileges.',
                q2: 'Q: Can I become root?',
                a2: 'A: Short answer, no! You cannot become root. The highest rank you can achieve is admin.'
            },
            money: {
                name: 'Money and winnings',
                q1: 'Q: Can I play with real money on CanIHazBets?',
                a1: 'A: No, you cannot. CanIHazBets is designed to be fun. There aren\'t any money involved.'
            },
            awards: {
                name: 'Awards',
                theAwardsYouCanWin: 'The awards you can win on',
                are: 'are',
                gainedForWinningAWeek: 'Gained for winning a week',
                forWinningAWeek: 'for winning a week'
            }
        },
        messages: {
            noMessages: "No messages.",
            from: "",
            to: "to",
            socketsTimeout: "It seems that your firewall or your internet provider is blocking the communication with the " +
            "server. Therefore, the chatting functionality is disabled."
        }
    });


    $translateProvider.translations(Languages.list.romanian.code, {
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
                logout: 'Delogare',
                messages: 'Mesaje'
            },
            notLogged: {
                home: 'Acasă',
                register: 'Înregistrare',
                login: 'Loghează-te',
                dontHaveAnAccountRegister: 'Nu ai un cont? Înregistrează-te!',
                haveAnAccountSignIn: 'Ai cont? Loghează-te.'
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
            loginButton: 'Loghează-mă',
            loggedInSuccessfully: 'Logat cu succes!'
        },
        registerPage: {
            name: 'Creează-ți un cont nou',
            username: 'Nume de utilizator',
            password: 'Parolă',
            confirmPassword: 'Confirmă parola',
            email: 'E-mail',
            birthDate: 'Dată de naștere',
            registerButton: 'Înregistrare',
            successfullyCreated: 'Contul a fost creat cu succes. ' +
                'Un cod de activare va fi trimis imediat la adresa ta de e-mail.',
            failureCreating: 'Contul nu a fost creat. Câmpurile marcate sunt necesare.',
            birthDate_too_young: 'Nu ai vârsta potrivită pentru a te înregistra.',
            email_not_valid: "E-mail-ul nu este valid.",
            email_too_long: 'Adresa de e-mail este prea lungă.',
            username_too_long: 'Numele de utilizator este prea lung.',
            maxSize: 'Lungimea maximă acceptată este'
        },
        forgotPasswordPage: {
            name: 'Parolă uitată',
            insertIndications: 'Introduceți numele de utilizator sau e-mail-ul pentru a vă recupera parola uitată.',
            usernameOrEmail: 'Nume de utilizator sau e-mail',
            recover: 'Recuperează',
            yes: 'Da',
            no: 'Nu',
            errorResponseMessage: 'A apărut o eroare și nu a putut fi trimis un cod de resetare către tine.'
        },
        resetPasswordPage: {
            name: 'Resetare parolă',
            insertIndications: 'Vă rugăm introduceți noua parolă și confirmați-o.',
            receivedResetCode: 'Codul de resetare primit prin e-mail',
            newPassword: 'Parola nouă',
            confirmPassword: 'Confirmă parola',
            changePassword: 'Schimbă parola',
            yes: 'Da',
            no: 'Nu',
            resetSuccessful: 'Noua parolă a fost resetată cu succes. Din acest moment, o poți folosi pentru a te loga în cont.',
            couldntReset: 'Nu am putut reseta parola. Te rugăm să încerci din nou.'
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
            mailNotificationsNotSent: 'Notificările prin e-mail nu au putut fi trimise. Te rugăm să reîncerci.' +
                'Dacă problema persistă, contactează un developer.',
            anErrorTryingToFetchWeekNo: 'A apărut o eroare la încărcarea etapei #',
            anErrorTryingToFetchAWeek: 'A apărut o eroare la încărcarea etapei.',
            anErrorTryingToFetchBets: 'Pariurile nu au putut fi încărcate din cauza unei erori.',
            betPlacementSuccess: 'Pariul a fost plasat cu succes.',
            betPlacementError: 'Pariul nu a fost plasat. Te rugăm să încerci din nou.',
            betChangeSuccess: 'Pariul a fost schimbat cu succes.',
            anErrorOccurred: 'A apărut o eroare.',
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
                saveResults: 'Salvează rezultatele',
                afterUpdateSuccess: 'Rezultatele au fost salvate cu succes.',
                afterUpdateError: 'În salvarea rezultatelor a intervenit o eroare. Te rugăm să încerci din nou să le salvezi. ' +
                    'Dacă problema persistă, contactează un developer cât mai repede posibil.'
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
                refresh: 'Reîncarcă',
                weekSavedSuccessfully: 'Etapa s-a salvat cu succes.',
                weekDidntSave: 'Etapa nu s-a salvat. Te rugăm încearcă din nou.',
                addNewTeam: 'Adaugă echipă nouă'
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
            },
            weekHistory: {
                week: 'Etapa',
                history: 'Istoric',
                nextText: 'Următorul',
                prevText: 'Precedentul',
                firstText: 'Primul',
                lastText: 'Ultimul',
                won: 'a câștigat',
                thisWeek: 'în această etapă',
                point: 'punct',
                points: 'puncte',
                whosBets_prefix: 'Pariurile lui ',
                whosBets_suffix: '',
                notEnded: 'Neîncheiat',
                error: 'Eroare',
                noBets: 'Niciun pariu',
                seemsThatArentBets: 'Se pare că nu există niciun pariu la acest moment.',
                closeButton: 'Închide',
                couldntBeFetched: 'Istoricul nu a putut fi descărcat.'
            },
            addNewTeamPage: {
                newTeam: "Echipă nouă",
                name: "Nume",
                nicknames: "Porecle (separate prin virgulă)",
                details: "Detalii despre echipă",
                city: "Oraș",
                yearFounded: "Anul înființării",
                country: "Țara",
                ground: "Stadion",
                stadiumCapacity: "Capacitatea stadionului",
                website: "Site web",
                isClub: "Echipă de club. Dacă este echipă națională, selectează Nu."
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
                preferredLanguage: 'Limba preferată',
                wonWeeks: 'Etape câștigate',
                awards: 'Premii',
                userRank: 'Rangul de utilizator',
                gainedForWinningAWeek: 'Obținut în urma câștigării unei etape',
                registerDate: 'Data înregistrării',
                viewHistory: 'Vezi istoricul',
                closeButton: 'Închide',
                sendMessage: 'Trimite-i un mesaj'
            }
        },
        historyPage: {
            name_prefix: 'Istoricul lui ',
            name_suffix: '',
            noHistoryItems: 'Nu există nicio etapă în istoric.',
            week: 'Etapa',
            endedOn: 's-a terminat la',
            inProgress: 'în curs',
            noBetPlacedThisWeek: 'Nu ai plasat pariul tău etapa aceasta.',
            startTime: 'Data de start',
            event: 'Evenimentul',
            competition: 'Competiția',
            bet: 'Pariu',
            result: 'Rezultat',
            points: 'Puncte',
            totalPoints: 'Total puncte'
        },
        profilePage: {
            name: 'Detaliile profilului',
            username: 'Nume de utilizator',
            email: 'E-mail',
            birthDate: 'Data de naștere',
            registerDate: 'Data înregistrării',
            place: 'Loc',
            points: 'Puncte',
            average: 'Media',
            awards: 'Premii',
            userRank: 'Rangul de utilizator',
            preferredLanguage: 'Limba preferată',
            notifyViaEmail: 'Trimite-mi știri despre site prin e-mail.',
            saveChanges: 'Salvează schimbările',
            gainedForWinningAWeek: 'Obținut în urma câștigării unei etape',
            yes: 'Da',
            no: 'Nu',
            yourPreferencesSaved: 'Opțiunile alese de tine au fost salvate.',
            yourPreferencesDidntSaved: 'Nu am putut salva opțiunile alese. Ne pare rău.',
            errorFetching: 'A apărut o eroare și nu au putut fi descărcate informațiile despre profil.'
        },
        activationPage: {
            name: 'Activare',
            explanations_prefix: 'Dacă nu ai un cod de activare, poți',
            explanations_resendLink: 'retrimite',
            explanations_suffix: 'unul prin e-mail la adresa ta.',
            ifYouDontReceiveMail: 'Dacă nu primești codul de activare prin e-mail, ' +
                'te rugăm să ne contactezi la contact@canihazbets.me.',
            activationCode: 'Cod de activare',
            activateButton: 'Activează',
            couldntActivate: 'Contul nu a putut fi activat.'
        },
        changePasswordPage: {
            name: 'Schimbare parolă',
            explanations1: 'După ce vei schimba parola, un cod de confirmare îți va fi trimis prin e-mail.',
            oldPassword: 'Parola veche',
            newPassword: 'Parola nouă',
            confirmPassword: 'Confirmă parola',
            changeBtn: 'Schimbă',
            yes: 'Da',
            no: 'Nu',
            successChangeMessage: 'Parola a fost schimbată cu succes. Te rugăm să îți verifici e-mail-ul.',
            errorChangeMessage: 'Nu ți-am putut schimba parola. Te rugăm să încerci din nou.'
        },
        adminPanelPage: {
            name: 'Panou administrator',
            users: 'Utilizatori',
            ranking: 'Clasament',
            rankingPage: {
                descriptionRecalculation: 'Folosește butonul de mai jos pentru a recalcula punctele și locurile ' +
                'tuturor jucătorilor. NU abuzați de acest buton!',
                recalculateButton: 'Recalculează',
                pointsCalculatedSuccessfully: 'Punctele au fost recalculate cu succes.',
                pointsWerentCalculated: 'Recalcularea nu s-a efectuat cu succes. ' +
                    'Te rugăm să reîncerci și, dacă problema persistă, contactează un dezvoltator al aplicației.'
            },
            usersPage: {
                searchUser: 'Caută utilizator',
                username: 'Nume utilizator',
                lastLogin: 'Ultima logare',
                email: 'E-mail',
                pts: 'Pct',
                rank: 'Rang',
                registrationIP: 'IP-ul la înregistrare',
                place: 'Loc',
                preferredLanguage: 'Limba preferată',
                points: 'Puncte',
                average: 'Medie',
                userRank: 'Rang de utilizator',
                birthDate: 'Data de naștere',
                registerDate: 'Data înregistrării',
                active: 'Activ',
                yes: 'Da',
                no: 'Nu',
                disabled: 'Dezactivat',
                anErrorHasOcurred: 'A apărut o eroare. Opțiunile alese nu au putut fi salvate.',
                cancelButton: 'Anulează',
                locationsNoItemsMessage: 'Nu există detalii în legătură cu locațiile acestui utilizator.',
                loginLocations: 'Locații la logare',
                date: 'Data',
                organization: 'Organizație',
                city: 'Oraș',
                region: 'Regiune',
                country: 'Țară',
                timezone: 'Fus orar',
                coordinates: 'Coordonate',
                errorLocations: 'Eroare la încărcarea locațiilor.'
            }
        },
        rulesPage: {
            howToPlay: {
                name: 'Cum se joacă',
                div1: 'În fiecare etapă, un admin alege niște meciuri de fotbal care vor fi jucate în acea etapă. ' +
                    'După ce meciurile sunt alese, începe parierea în acea etapă. ',
                div2: 'Pentru a câștiga cât mai multe puncte, ' +
                    'va trebui ca tu să ghicești scorul corect pentru un număr de evenimente dintre cele alese. ' +
                    'Acest număr este predefinit și este afișat pentru fiecare etapă ' +
                    'Dacă vei încerca să joci mai multe meciuri sau mai puține, vei primi o eroare.',
                div3: 'Să vedem cum sunt acordate punctele. ' +
                    'Dacă ghicești scorul exact al unui eveniment, vei primi 3 puncte. ' +
                    'Dacă nu ghicești scorul exact, dar ghicești diferența de scor dintre echipe, ' +
                    'ca și echipa câștigătoare, vei primi 2 puncte. ' +
                    'De exemplu, să presupunem că A joacă împotriva lui b. Vom spune că avem evenimentul A vs. B. ' +
                    'Dacă scorul ghicit de tine este 3-1 și rezultatul este 2-0, ' +
                    'primești 2 puncte. Dacă pariezi 0-2, nu câștigi niciun punct. ' +
                    'Aceeași regulă se aplică pentru meciurile terminate la egalitate. ' +
                    'Dacă tu pariezi 1-1 și rezultatul este 2-2, 3-3 sau alt rezultat egal (exceptând 1-1), ' +
                    'câștigi 2 puncte pentru ghicirea diferenței de scor.',
                div4: 'Dacă nu ghicești nici scorul exact, nici diferența de scor, ' +
                    'ultima ta șansă este ca echipa pe care ai pariat să câștige meciul cu orice scor. ' +
                    'În acest caz, câștigi un punct. Folosind același exemplu, A vs. B, ' +
                    'un pariu de 3-1 ia un punct dacă rezultatul este 1-0, 2-1, 3-2, 4-1, 3-0 etc. Te-ai prins.',
                div5: 'Dacă ai ghinion cu adevărat și pariezi pe o echipă care pierde, nu câștigi niciun punct.',
                div6: 'Fiecare etapă are un termen limită. ' +
                    'După acest termen, parierea se închide și nu mai poți juca. ',
                div7: 'Clasamentul este calculat după ce un admin introduce rezultatele ' +
                    'pentru meciurile etapei curente. ' +
                    'Dacă observi o greșeală de calcul, te rugăm să contactezi un administrator. ' +
                    'Poți folosi contact@canihazbets.me oricând ai nevoie.'
            },
            userRanks: {
                name: 'Ranguri de utilizator',
                listOfRanks: 'Lista rangurilor de utilizator și descrierea lor:',
                q1: 'Î: Am văzut cuvântul root asociat cu un rang de utilizator. Ce înseamnă asta?',
                a1: 'R: Root este rangul de superutilizator. ' +
                    'Este inspirat din comunitatea Linux, ' +
                    'unde root este numele utilizatorului cu cele mai elevate privilegii.',
                q2: 'Î: Pot deveni root?',
                a2: 'R: Pe scurt, nu! Nu poți deveni root. Cel mai înalt rang pe care îl poți atinge este admin.'
            },
            money: {
                name: 'Bani și câștiguri',
                q1: 'Î: Pot paria bani reali pe CanIHazBets?',
                a1: 'R: Nu, nu se poate. CanIHazBets este creat pentru distracție. Nu sunt bani implicați.'
            },
            awards: {
                name: 'Premii',
                theAwardsYouCanWin: 'Premiile pe care le poți câștiga pe',
                are: 'sunt',
                gainedForWinningAWeek: 'Obținut în urma câștigării unei etape',
                forWinningAWeek: 'pentru câștigarea unei etape'
            }
        },
        messages: {
            noMessages: "Nu există mesaje.",
            from: "De la",
            to: "către",
            socketsTimeout: "Nu s-a putut stabili conexiunea cu serverul. Cel mai probabil firewall-ul sau furnizorul " +
            "dumneavoastră de internet vă blochează accesul. Din acest motiv, chat-ul este dezactivat."
        }
    });

    $translateProvider.preferredLanguage(CurrentLanguageFactory.language.code);

}]);
