const PASSWORD_FORM = document.forms['change-password'];
const OLD_PASSWORD = PASSWORD_FORM['old-password'];
const NEW_PASSWORD = PASSWORD_FORM['new-password'];
const CONFIRM_NEW_PASSWORD = PASSWORD_FORM['confirm-new-password'];
const PASSWORD_ERROR = PASSWORD_FORM.querySelector(FORM_ELEMENT_NAMES.ERROR_FEEDBACK);
const PASSWORD_SUCCESS = PASSWORD_FORM.querySelector(FORM_ELEMENT_NAMES.SUCCESS_FEEDBACK);

// FRONTEND MESSAGES
const displayInvalidCredentials = () => INVALID_FORM_FEEDBACK.innerHTML = 'Password is incorrect.'
const displayServerError = () => INVALID_FORM_FEEDBACK.innerHTML = 'Server Error. Please try again later.'
const displaySuccess = () => {
    
}


function PASSWORD_validateAll()
{
    if (
        
        validateOldPassword(OLD_PASSWORD, NEW_PASSWORD) &&
        validateNewPassword(NEW_PASSWORD, OLD_PASSWORD, CONFIRM_NEW_PASSWORD) &&
        validateConfirmPassword(CONFIRM_NEW_PASSWORD, NEW_PASSWORD)
    )
    {
        return true;
    }
    return false;
}
function successfulPasswordChange(response)
{
    PASSWORD_ERROR.innerHTML = '';
    PASSWORD_SUCCESS.innerHTML = 'Password successfully changed';
}


let changePasswordResponseMessages = new ResponseMessages(formErrorElem=PASSWORD_ERROR);
changePasswordResponseMessages.displaySuccess = successfulPasswordChange;
changePasswordResponseMessages.errorMsgs.invalidCredentials = 'Old Password is incorrect.'


OLD_PASSWORD.addEventListener('focusout', ()=>{
    validateOldPassword(OLD_PASSWORD, NEW_PASSWORD);
});

NEW_PASSWORD.addEventListener('focusout', () => {
    validateNewPassword(NEW_PASSWORD, OLD_PASSWORD, CONFIRM_NEW_PASSWORD);
});
NEW_PASSWORD.addEventListener('input', () => {
    toggleInputCheckmarks(
        NEW_PASSWORD,
        patternsDict=PATTERNS.PASSWORD,
        idList=CHECKMARK_IDS.PASSWORD
    );
});

CONFIRM_NEW_PASSWORD.addEventListener('focusout', () => {
    validateConfirmPassword(CONFIRM_NEW_PASSWORD, NEW_PASSWORD);
});

PASSWORD_FORM.addEventListener('submit', event => {
    event.preventDefault()
    PASSWORD_SUCCESS.innerHTML = '';
    if (PASSWORD_validateAll())
    {
        
        fetch('rest/auth/user/change-password', {
            method: 'POST',
            body: JSON.stringify({
                token: {
                    access_token: getCookie('access_token'),
                    token_type: 'bearer',
                },
                password: OLD_PASSWORD.value,
                newPassword: NEW_PASSWORD.value
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8s'
            }
        })
        .then(response => {
            changePasswordResponseMessages.updateAction(response);
        })
        
    }
});