
module.exports = {

    en: {
        history: {
            cannotFetchFromDb: "Cannot fetch bet history from database.",
            cannotFindWeekInfo: "Couldn't find week information.",
            weekHasntEnded: "Week hasn't ended yet. You cannot see the history.",
            cannotBeFetched: "History couldn't be fetched."
        },
        login: {
            usernameDoesntExist: "Username doesn't exist.",
            moreThanOneUser: "More than one user found with the username ",
            accountDisabled: "Login failed. Your account is disabled.",
            serverErrors: "Login failed. Server encountered some errors.",
            invalidCredentials: "Login failed. Credentials you provided are invalid.",
            errorFetchingResetCode: "Error fetching reset code.",
            resetCodeNoUser: "This reset code doesn't belong to any user."
        },
        bet: {
            betsCouldntBeFetched: "Oops. Bets couldn't be fetched from the database.",
            betCouldntBeFetched: "Oops. Bet couldn't bet fetched from the database.",
            cannotPlaceBetFTM: "An error has occurred. You cannot place a bet for the moment.",
            alreadyPlacedABet: 'It seems that you already placed a bet this week.',
            couldntSaveBet: "Oops. Couldn't save the bet to database.",
            notPermittedToSaveBetForAnotherUser: "You are not permitted to save another user's bet."
        },
        betsPerWeek: {
            noWeekNumber: 'No week number to look for.',
            errorFetchingLastBets: 'An error occurred while fetching your last bets.',
            didntPlaceABet: 'You didn\'t place a bet this week.'
        },
        rankingRoute: {
            anErrorOccurred: "An error has occurred."
        },
        userRoute: {
            errorFetchingUserFromDb: "Error fetching user from database.",
            errorFetchingUsersFromDb: "Error fetching users from database.",
            errorFetchingDetailsFromDb: "Error fetching details from database.",
            cantCreatePasswordsNotMatching: "Account couldn't be created. Passwords are not matching.",
            cantCreateServerErrors: "Account couldn't be created due to server errors.",
            cantCreateFieldsAlreadyTaken: "Account couldn't be created. Some fields are already taken.",
            accountCreatedButNotARegistrationCode: "Account was saved, but a registration code couldn't be provided " +
                "via e-mail. " + "Please login and request a new one.",
            registrationCodeCouldntBeProvided: "A registration code couldn't be provided.",
            emailWithActivationSent: "An e-mail containing an activation code will be sent to you shortly.",
            userNotFound: "User couldn't be found in the database.",
            userCouldntBeSavedToDb: "User couldn't be saved in the database. Please try again.",
            errorFetchingDetails:  "An error occurred while trying to fetch your details.",
            couldntFindAccountATForgotPw: "We couldn't find your account. It seems that you entered wrong details.",
            resetCodeCouldntBeProvided: "A reset code couldn't be provided.",
            emailContainingCodeSent: "An e-mail containing the code needed to reset your password" +
                " will be sent to you shortly.",
            newPwAndconfirmPwNotMatching: "New password and confirm password do not match.",
            couldntChangePw: "We couldn't change your password. Please try again.",
            oldPwIsWrong: "Old password you entered is wrong.",
            newPwSavedErrorSendingMail: "New password was saved, but no confirmation e-mail could be sent. " +
                "Please login and request a new one.",
            errorFetchingResetCode: "An error occurred while trying to fetch the reset code.",
            resetCodeCantBeFound: "The reset code you entered couldn't be found.",
            resetCodeExpired: "The reset code you entered expired. Please request another one.",
            userCouldntBeActivated: "User couldn't be activated due to database errors.",
            codeIsNotValid: "The activation code you entered is not valid.",
            activationCodeExpired: "The activation code you entered expired. Please request a new one."
        },
        weekRoute: {
            errorFetchingWeekFromDb: "Error fetching week from database.",
            errorFetchingWeeksFromDb: "Error fetching weeks from database.",
            errorFetchingCurrentWeek: "Error fetching current week.",
            weekIsNotAvailableAnymore: "Week is not available anymore.",
            errorFetchingUsers: "Error fetching users.",
            emailNotificationAlreadySent: "An e-mail notification was already sent for this week.",
            mailsQueuedAboutToBeSent: "Mails were queued and are about to be sent.",
            weekWasntSavedToDb: "Week wasn't saved to database.",
            weekHasNoEventsAddThem: "Week contains no events. You need to add them to be able to save the week.",
            errorFetchingBeforeCurrentWeek: "Error fetching before current week.",
            errorFetchingWeekWithNumber: "Error fetching week with number ",
            weekInfoNotSavedDbError: "Week information wasn't saved. There was an error with the database."
        }
    },

    ro: {
        history: {
            cannotFetchFromDb: "Istoricul nu a putut fi găsit în baza de date.",
            cannotFindWeekInfo: "Informațiile despre etapă nu au putut fi găsite.",
            weekHasntEnded: "Etapa nu s-a încheiat. Nu poți vedea istoricul.",
            cannotBeFetched: "Istoricul nu a putut fi descărcat."
        },
        login: {
            usernameDoesntExist: "Numele de utilizator nu există.",
            moreThanOneUser: "Au fost găsiți mai mulți utilizatori cu numele ",
            accountDisabled: "Logarea a eșuat. Contul tău este dezactivat.",
            serverErrors: "Logarea a eșuat. Serverul a întâmpinat anumite probleme.",
            invalidCredentials: "Logarea a eșuat. Parola este greșită.",
            errorFetchingResetCode: "Eroare la căutarea codului de resetare.",
            resetCodeNoUser: "Acest cod de resetare nu aparține niciunui utilizator."
        },
        bet: {
            betsCouldntBeFetched: "Oops. Pariurile nu au putut fi descărcate din baza de date.",
            betCouldntBeFetched: "Oops. Pariul nu a putut fi descărcat din baza de date.",
            cannotPlaceBetFTM: "A intervenit o eroare. Nu se pot plasa pariuri în acest moment.",
            alreadyPlacedABet: 'Se pare că ai mai plasat un pariu etapa aceasta.',
            couldntSaveBet: "Oops. Pariul nu a putut fi salvat.",
            notPermittedToSaveBetForAnotherUser: "Nu ai permisiunea de a modifica pariurile unui alt utilizator."
        },
        betsPerWeek: {
            noWeekNumber: 'Nu a fost specificat niciun număr de etapă.',
            errorFetchingLastBets: 'A intervenit o eroare la descărcarea ultimelor pariuri.',
            didntPlaceABet: 'Nu ai plasat un pariu etapa aceasta.'
        },
        rankingRoute: {
            anErrorOccurred: "A intervenit o eroare."
        },
        userRoute: {
            errorFetchingUserFromDb: "Eroare la căutarea utilizatorului în baza de date.",
            errorFetchingUsersFromDb: "Eroare la căutarea utilizatorilor în baza de date.",
            errorFetchingDetailsFromDb: "Eroare la descărcarea detaliilor din baza de date.",
            cantCreatePasswordsNotMatching: "Contul nu a putut fi creat. Parolele nu se potrivesc.",
            cantCreateServerErrors: "Contul nu a putut fi creat din cauza unor erori la server.",
            cantCreateFieldsAlreadyTaken: "Contul nu a putut fi creat. Unele câmpuri au fost deja alese de alți utilizatori.",
            accountCreatedButNotARegistrationCode: "Contul a fost salvat, dar nu a putut fi trimis un cod de înregistrare " +
            "prin e-mail. " + "Te rugăm să te loghezi pentru a cere unul nou.",
            registrationCodeCouldntBeProvided: "Nu a putut fi furnizat un cod de înregistrare.",
            emailWithActivationSent: "Un e-mail conținând un cod de activare va fi trimis imediat către tine.",
            userNotFound: "Utilizatorul nu a putut fi găsit în baza de date.",
            userCouldntBeSavedToDb: "Utilizatorul nu a putut fi salvat în baza de date. Te rugăm să reîncerci.",
            errorFetchingDetails:  "A apărut o eroare la descărcarea detaliilor utilizatorului.",
            couldntFindAccountATForgotPw: "Nu am putut găsi detaliile contului tău. Se pare că ai introdus date greșite.",
            resetCodeCouldntBeProvided: "Un cod de resetare nu a putut fi furnizat.",
            emailContainingCodeSent: "Un e-mail conținând codul necesar resetării parolei va fi trimis imediat " +
                "către tine.",
            newPwAndconfirmPwNotMatching: "Parola nouă și parola de confirmare nu se potrivesc.",
            couldntChangePw: "Nu ți-am putut schimba parola. Te rugăm să reîncerci.",
            oldPwIsWrong: "Parola veche este greșită.",
            newPwSavedErrorSendingMail: "Noua parolă a fost salvată, dar nu a putut fi trimis prin e-mail un cod de activare. " +
                "Te rugăm să te loghezi și să ceri unul nou.",
            errorFetchingResetCode: "A apărut o eroare la încercare de a căuta codul de resetare.",
            resetCodeCantBeFound: "Codul de resetare nu a fost găsit.",
            resetCodeExpired: "Acest cod de resetare a expirat. Te rugăm să ceri unul nou.",
            userCouldntBeActivated: "Contul nu a putut fi activat din cauza unor erori la nivelul bazei de date.",
            codeIsNotValid: "Codul introdus nu este valid.",
            activationCodeExpired: "Codul introdus a expirat. Te rugăm să ceri unul nou."
        },
        weekRoute: {
            errorFetchingWeekFromDb: "Eroare la aducerea etapei din baza de date.",
            errorFetchingWeeksFromDb: "Eroare la aducerea etapelor din baza de date.",
            errorFetchingCurrentWeek: "Eroare la aducerea ultimei etape.",
            weekIsNotAvailableAnymore: "Etapa nu mai este disponibilă.",
            errorFetchingUsers: "Eroare la aducerea userilor.",
            emailNotificationAlreadySent: "O notificare prin e-mail a fost deja trimitsă pentru etapa aceasta.",
            mailsQueuedAboutToBeSent: "Mail-urile au fost puse în așteptare și urmează să fie trimise.",
            weekWasntSavedToDb: "Etapa n-a fost salvată în baza de date/",
            weekHasNoEventsAddThem: "Etapa nu conține evenimente. Pentru a putea fi salvată, o etapă trebuie să conțină evenimente.",
            errorFetchingBeforeCurrentWeek: "Eroare la aducerea penultimei etape.",
            errorFetchingWeekWithNumber: "Eroare la aducerea etapei cu numărul ",
            weekInfoNotSavedDbError: "A intervenit o eroare în baza de date. Informațiile despre această etapă nu au fost salvate."
        }
    }

}
