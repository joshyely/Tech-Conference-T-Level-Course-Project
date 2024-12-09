const FORM = document.forms['register'];
const INVALID_FORM_FEEDBACK = document.querySelector('#invalid-form-feedback');
// Fields
const F_NAME = FORM['f-name'];
const L_NAME = FORM['l-name'];
const EMAIL = FORM['email'];
const PASSWORD = FORM['password'];
const CONFIRM_PASSWORD = FORM['confirm-password'];


function showFormErrorMessage(msg)
{
    FORM.classList.add('was-validated');
}
function validateAll()
{
    if (
        validateName(F_NAME) && 
        validateName(L_NAME) && 
        validateEmail(EMAIL) && 
        validatePassword(PASSWORD) && 
        validateConfirmPassword(PASSWORD)
    )
    {
        return true;
    }
    return false;
}



// Field event listeners
F_NAME.addEventListener('focusout', ()=>{
    validateName(F_NAME);
});
L_NAME.addEventListener('focusout', ()=>{
    validateName(L_NAME);
});
EMAIL.addEventListener('focusout', ()=>{
    validateEmail(EMAIL);
});
PASSWORD.addEventListener('focusout', ()=>{
    validatePassword(PASSWORD);
});
CONFIRM_PASSWORD.addEventListener('focusout', ()=>{
    validateConfirmPassword(CONFIRM_PASSWORD);
});


// Form submittion functions
function backendValidationError(responseDetails)
{   
    INVALID_FORM_FEEDBACK.innerHTML = 'Some fields are invalid.';
    responseDetails.forEach(detail => {
        let fields = Array.from(FORM.querySelectorAll('.form-control'))
        fields.forEach((field, index) => {
            if (field.value == detail.input)
            {
                let container = field.parentElement;
                field.setCustomValidity('Field Invalid');
                container.querySelector('.invalid-feedback').innerHTML = 'Field Invalid';
                fields = fields[index, -1];
            }
        });
    });
}
function userExistsError()
{
    EMAIL.setCustomValidity('User Exists!');
    INVALID_FORM_FEEDBACK.innerHTML = 'User with that email already exists!';
    EMAIL.parentElement.classList.add('was-validated');
}
function databaseError(responseJson)
{
    INVALID_FORM_FEEDBACK.innerHTML = 'Database error.';
}
function displayConfirmation(responseJson) {
    console.log('registration success!');
    
    // URL-encode the responseJson object
    let responseURI = encodeURIComponent(JSON.stringify(responseJson));
    console.log("Encoded URL: ", responseURI);
    
    // Redirect to the confirmation page
    location.href = `/confirmation/${responseURI}`;
}
function displayGenericError(responseJson)
{
    INVALID_FORM_FEEDBACK.innerHTML = 'Something went wrong.';
}

FORM.addEventListener('submit', async event => {
    event.preventDefault();
    if (validateAll())
    {
        fetch('/rest/registration/register', {
            method: "POST",
            body: JSON.stringify({
            fName: F_NAME.value,
            lName: L_NAME.value,
            email: EMAIL.value,
            password: PASSWORD.value
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(async response => {
                let json = await response.json()
                console.log(`status: ${response.status}`)
                switch(response.status)
                {
                    case 422: // Validation Error
                        backendValidationError(json.detail);
                        break;
                    case 226: // User Exists
                        userExistsError()
                        break;
                    case 500: // Internal Server Error (Database)
                        databaseError(json);
                        break;
                    case 201: //row creation success
                        displayConfirmation(json);
                        break;
                    default:
                        displayGenericError(json);
                }
            });
    }
    else
    {
        return false;
    }
});