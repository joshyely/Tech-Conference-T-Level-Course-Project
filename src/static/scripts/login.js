const FORM = document.forms['login'];
const EMAIL = FORM['email'];
const PASSWORD = FORM['password'];
const INVALID_FORM_FEEDBACK = document.querySelector('#invalid-form-feedback');


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


// FRONTEND MESSAGES
const displayInvalidCredentials = () => INVALID_FORM_FEEDBACK.innerHTML = 'Email or Password is incorrect.'
const displayServerError = () => INVALID_FORM_FEEDBACK.innerHTML = 'Server Error. Please try again later.'
const displayTokenError = () => INVALID_FORM_FEEDBACK.innerHTML = 'Token Error. Please try again or contact support.'
const displayLoginSuccess = () => {
    location.href = '/'
    alert('Login Successful!')
}
async function displayResponseMsg(response, json)
{
    switch(response.status)
    {
        case 401:
            displayInvalidCredentials();
            break;
        case 500:
            displayServerError();
            break;
        case 302:
            let tokenStatus = await sendTokenAcknowledgement(json.access_token);
            if(tokenStatus == 200)
            {
                createTokenCookie(json);
                saveFirstname(json);
                displayLoginSuccess();
            }
            else
            {
                displayTokenError();
            }
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


// EVENT LISTENERS
EMAIL.addEventListener('focusout', ()=>{
    validateEmail(EMAIL);
});
PASSWORD.addEventListener('focusout', ()=>{
    validateLoginPassword(PASSWORD);
});
FORM.addEventListener('submit', async event=>{
    event.preventDefault();
    if (validateAll())
    {
        console.log(`email: ${EMAIL.value}\t typeof: ${typeof(EMAIL.value)}`)
        console.log(`password: ${PASSWORD.value}\t typeof: ${typeof(PASSWORD.value)}`)
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
            let json = await response.json();
            displayResponseMsg(response, json)
        });
    }
    else
    {
        return false;
    }
});




