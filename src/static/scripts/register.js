console.log('running register.js..');

const FORM = document.forms['register'];
const INVALID_FORM_FEEDBACK = document.querySelector('#invalid-form-feedback');
// Fields
const F_NAME = FORM['f-name'];
const L_NAME = FORM['l-name'];
const EMAIL = FORM['email'];

const PATTERNS = Object.freeze({
    NAME: new RegExp('^[a-zA-Z]+$'),
    EMAIL: new RegExp('^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
});


function showFormErrorMessage(msg)
{
    FORM.classList.add('was-validated');
}


function isPresent(inputElem)
{
    if (inputElem.value.trim() == '')
    {
        inputElem.setCustomValidity('Field Required');
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = 'Field cannot be blank.';
        return false;
    }
    else
    {
        return true;
    }
}

function isAlpha(inputElem)
{
    if (!PATTERNS.NAME.test(inputElem.value))
    {
        inputElem.setCustomValidity('Only Alpha');
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = 'Must only contain alphabetical characters and no spaces.';
        return false;
    }
    else
    {
        return true;
    }
}

function isEmail(inputElem)
{
    if (!PATTERNS.EMAIL.test(inputElem.value))
    {
        inputElem.setCustomValidity('Invalid Email');
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = 'Email is invalid.';
        return false;
    }
    else
    {
        return true;
    }
}


function validateName(inputElem)
{
    if (isPresent(inputElem) && isAlpha(inputElem))
    {
        inputElem.setCustomValidity('');
    }
    inputElem.parentElement.classList.add('was-validated');
}
function validateEmail(inputElem)
{
    if (isPresent(inputElem) && isEmail(inputElem))
    {
        inputElem.setCustomValidity('');
    }
    inputElem.parentElement.classList.add('was-validated');
}

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


F_NAME.addEventListener('focusout', ()=>{
    validateName(F_NAME)
});
L_NAME.addEventListener('focusout', ()=>{
    validateName(L_NAME)
});
EMAIL.addEventListener('focusout', ()=>{
    validateEmail(EMAIL)
});

FORM.addEventListener('submit', async event => {
    event.preventDefault();
    fetch('/api/register', {
        method: "POST",
        body: JSON.stringify({
          fName: F_NAME.value,
          lName: L_NAME.value,
          email: EMAIL.value
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      .then(async response => {
            let json = await response.json()
            switch(response.status)
            {
                case 422: // Validation Error
                    backendValidationError(json.detail);
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
        })
});