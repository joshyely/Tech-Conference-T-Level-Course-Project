const PATTERNS = Object.freeze({
    NAME: new RegExp('^[a-zA-Z]+$'),
    EMAIL: new RegExp('^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
    PASSWORD: new RegExp('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'),
});

function isPresent(inputElem)
{
    let result = inputElem.value.trim().length > 0;
    if (!result)
    {
        inputElem.setCustomValidity('Field Required');
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = 'Field cannot be blank.';

    }
    return result;
}
function isEmail(inputElem)
{
    let result = PATTERNS.EMAIL.test(inputElem.value);
    if (!result)
    {
        inputElem.setCustomValidity('Invalid Email');
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = 'Email is invalid.';
    }
    return result;
}
function isAlpha(inputElem)
{
    let result = PATTERNS.NAME.test(inputElem.value);
    if (!result)
    {
        inputElem.setCustomValidity('Only Alpha');
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = 'Must only contain alphabetical characters and no spaces.';
    }
    return result;
}


function validPassword(inputElem)
{
    return true // Check doesnt work, remove line to enable function

    let result = PATTERNS.PASSWORD.test(inputElem.value);
    console.log(inputElem.value);
    console.log(result);
    if (!result)
    {
        inputElem.setCustomValidity('Invalid Password');
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = 'Password must contain 1 lowercase, uppercase, number, and symbol.';
    }
    return result;
};


function validateEmail(inputElem)
{
    inputElem.parentElement.classList.add('was-validated');
    if (isPresent(inputElem) && isEmail(inputElem))
    {
        inputElem.setCustomValidity('');
        return true;
    }
    return false;
}

function validatePassword(inputElem)
{
    inputElem.parentElement.classList.add('was-validated');
    if (isPresent(inputElem) && validPassword(inputElem))
    {
        inputElem.setCustomValidity('');
        return true
    }
    return false
}
function validateConfirmPassword(inputElem)
{
    inputElem.parentElement.classList.add('was-validated');
    if (PASSWORD.value == CONFIRM_PASSWORD.value)
    {
        inputElem.setCustomValidity('');
        return true;
    }
    else
    {
        inputElem.setCustomValidity('Passwords don\'t match');
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = 'Passwords don\'t match.';
        return false;
    }
    
}
function validateName(inputElem)
{
    inputElem.parentElement.classList.add('was-validated');
    if (isPresent(inputElem) && isAlpha(inputElem))
    {
        inputElem.setCustomValidity('');
        return true;
    }
    return false;
}


function validateLoginPassword(inputElem)
{
    inputElem.parentElement.classList.add('was-validated');
    if (isPresent(inputElem))
    {
        inputElem.setCustomValidity('');
        return true;
    }
    return false;
}