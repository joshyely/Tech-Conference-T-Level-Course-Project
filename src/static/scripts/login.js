const FORM = document.forms['login'];
const EMAIL = FORM['email'];
const PASSWORD = FORM['password'];
const ERROR = FORM.querySelector(FORM_ELEMENT_NAMES.ERROR_FEEDBACK);



// Validates if token is working as it should
async function sendTokenAcknowledgement(token)
{
    let response = await fetch('/rest/login/acknowledge-token', {
        method: 'POST',
        body: JSON.stringify({
            access_token: token,
            token_type: 'bearer'
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8s',
        }
    });
    console.log(`status: ${response.status}\t type: ${typeof(response.status)}`)
    return response.status;      
}

// TOKEN/COOKIES
function createTokenCookie(json)
{
    document.cookie = `access_token=${json.access_token};expires=${json.expires}`;
}
function saveFirstname(json)
{
    document.cookie = `first_name=${json.first_name};expires=${json.expires}`;
}






async function ifCorrectCredentials(response)
{
    let json = await response.json();
    let tokenStatus = await sendTokenAcknowledgement(json.access_token);
    if(tokenStatus == 200)
    {
        createTokenCookie(json);
        saveFirstname(json);
        location.href = '/';
    }
    else
    {
        loginResponseMessages.displayTokenError();
    }
}
function validateAll()
{
    if (validateEmail(EMAIL) && validatePassword(PASSWORD))
    {
        return true;
    }
    return false;
}

let loginResponseMessages = new ResponseMessages(formErrorElem=ERROR)
loginResponseMessages.displaySuccess = ifCorrectCredentials


// EVENT LISTENERS
EMAIL.addEventListener('focusout', ()=>{
    validateEmail(EMAIL);
});
PASSWORD.addEventListener('focusout', ()=>{
    validatePassword(PASSWORD);
});
FORM.addEventListener('submit', async event=>{
    event.preventDefault();
    if (validateAll())
    {
        fetch('/rest/login/token', {
            method: 'POST',
            body: JSON.stringify({
                email: `${EMAIL.value}`,
                password: `${PASSWORD.value}`
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8s'
            }
        })
        .then(async response => {
            loginResponseMessages.authenticateAction(response);
        });
    }
});






