const FORM = document.forms['register'];
const ERROR = FORM.querySelector(FORM_ELEMENT_NAMES.ERROR_FEEDBACK);
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


// THIS FILE'S HELPER FUNCTIONS
function validateAll()
{
    if (
        validateName(F_NAME) && 
        validateName(L_NAME) && 
        validateEmail(EMAIL) && 
        validateRegistrationPassword(PASSWORD) && 
        validateConfirmPassword(CONFIRM_PASSWORD, PASSWORD)
    )
    {
        return true;
    }
    return false;
}
function backendValidationError(responseDetails)
{   
    formFeedBackElem.innerHTML = 'Some fields are invalid.';
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
function userExistsError(response)
{
    EMAIL.setCustomValidity('User Exists!');
    ERROR.innerHTML = 'User with that email already exists!';
    EMAIL.parentElement.classList.add('was-validated');
}
async function displayConfirmation(response)
{
    let json = await response.json();
    console.log('registration success!');
    
    // URL-encode the responseJson object
    let responseURI = encodeURIComponent(JSON.stringify(json));
    console.log("Encoded URL: ", responseURI);
    
    // Redirect to the confirmation page
    location.href = `/confirmation/${responseURI}`;
}

// ACCESSING response_messages.js HELPER
let registerResponseMessages = new ResponseMessages(formErrorElem=ERROR)
registerResponseMessages.displaySuccess = displayConfirmation
registerResponseMessages.displayEntryExistsError = userExistsError


// Event listeners
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
    validateRegistrationPassword(PASSWORD);
});
PASSWORD.addEventListener('input', ()=> {
    toggleInputCheckmarks(
        PASSWORD,
        patternsDict=PATTERNS.PASSWORD,
        idList=CHECKMARK_IDS.PASSWORD
    );
})
CONFIRM_PASSWORD.addEventListener('focusout', ()=>{
    validateConfirmPassword(CONFIRM_PASSWORD, PASSWORD);
});
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
            registerResponseMessages.createAction(response);
        });
    }
});

