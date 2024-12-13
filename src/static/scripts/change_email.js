const EMAIL_FORM = document.forms['change-email'];
const NEW_EMAIL = EMAIL_FORM['new-email'];
const CONFIRM_NEW_EMAIL = EMAIL_FORM['confirm-new-email'];
const EMAIL_PASSWORD = EMAIL_FORM['password'];
const EMAIL_ERROR = EMAIL_FORM.querySelector(FORM_ELEMENT_NAMES.ERROR_FEEDBACK);
const EMAIL_SUCCESS = EMAIL_FORM.querySelector(FORM_ELEMENT_NAMES.SUCCESS_FEEDBACK);


function EMAIL_validateAll()
{
    if (
        validateEmail(NEW_EMAIL) && 
        validateConfirmEmail(CONFIRM_NEW_EMAIL, NEW_EMAIL) && 
        validatePassword(EMAIL_PASSWORD)
    )
    {
        return true;
    }
    return false;
}
function successfulEmailChange(response)
{
    EMAIL_ERROR.innerHTML = '';
    EMAIL_SUCCESS.innerHTML = `Email successfully changed to '${NEW_EMAIL.value}'`;
}

let changeEmailResponseMessages = new ResponseMessages(formErrorElem=EMAIL_ERROR);
changeEmailResponseMessages.displaySuccess = successfulEmailChange;
changeEmailResponseMessages.errorMsgs.entryExistsError = 'Email is already in use.';
changeEmailResponseMessages.errorMsgs.invalidCredentials = 'Password is incorrect.';

NEW_EMAIL.addEventListener('focusout', ()=>{
    validateNewEmail(NEW_EMAIL, CONFIRM_NEW_EMAIL);
    
});
CONFIRM_NEW_EMAIL.addEventListener('focusout', () => {
    validateConfirmEmail(CONFIRM_NEW_EMAIL, NEW_EMAIL);
});
EMAIL_PASSWORD.addEventListener('focusout', () => {
    validatePassword(EMAIL_PASSWORD);
});
EMAIL_FORM.addEventListener('submit', event => {
    event.preventDefault()
    EMAIL_SUCCESS.innerHTML = '';
    if (EMAIL_validateAll())
    {
        fetch('rest/auth/user/change-email', {
            method: 'POST',
            body: JSON.stringify({
                token: {
                    access_token: getCookie('access_token'),
                    token_type: 'bearer'
                },
                password: EMAIL_PASSWORD.value,
                newEmail: NEW_EMAIL.value
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8s'
            }
        })
        .then(response => {
            changeEmailResponseMessages.updateAction(response);
        })
    }
});