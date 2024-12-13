const PATTERNS = Object.freeze({
    NAME: new RegExp('^[a-zA-Z]+$'),
    EMAIL: new RegExp('^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
    PASSWORD: {
        HAS_LOWER: new RegExp('[a-z]'),
        HAS_UPPER: new RegExp('[A-Z]'),
        HAS_DIGIT: new RegExp('\\d'),
        HAS_SYMBOL: new RegExp('[$£@!#~]'),
        HAS_LENGTH: (valueLength) => {return valueLength >= 8}
    }
});
// List needs to be in the same order as the the dict inside patterns
const CHECKMARK_IDS = Object.freeze({
    PASSWORD: [
        'lower-check',
        'upper-check', 
        'digit-check', 
        'symbol-check', 
        'length-check'
    ]
})
const ERROR_MSGS = Object.freeze({
    PRESENCE: 'Field cannot be blank.',
    ALPHA: 'Must only contain alphabetical characters and no spaces.',
    FIELDS_NOT_DIFFERENT: 'Fields cannot be the same.',
    MISMATCH: 'Fields do not match.',
    EMAIL: {
        INVALID: 'Email is invalid.',
        MISMATCH: 'Emails don\'t match.',
    },
    PASSWORD: {
        INVALID: 'Password does not meet the criteria.',
        MISMATCH: 'Passwords don\'t match.'
    }
});

function isPresent(inputElem)
{
    let result = inputElem.value.trim().length > 0;
    if (!result)
    {
        inputElem.setCustomValidity('Field Required');
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = ERROR_MSGS.PRESENCE;

    }
    return result;
}
function isEmail(inputElem)
{
    let result = PATTERNS.EMAIL.test(inputElem.value);
    if (!result)
    {
        inputElem.setCustomValidity('Invalid Email');
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = ERROR_MSGS.EMAIL.INVALID;
    }
    return result;
}
function isAlpha(inputElem)
{
    let result = PATTERNS.NAME.test(inputElem.value);
    if (!result)
    {
        inputElem.setCustomValidity('Only Alpha');
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = ERROR_MSGS.ALPHA;
    }
    return result;
}

function fieldsAreDifferentCheck(field1, field2)
{
    if (field1.value != field2.value || field1.value == '')
    {
        return true;
    }
    let fields = [field1, field2];
    fields.forEach(field => {
        let parent = field.parentElement;
        parent.querySelector('.invalid-feedback').innerHTML = ERROR_MSGS.FIELDS_NOT_DIFFERENT;
        field.setCustomValidity(ERROR_MSGS.FIELDS_NOT_DIFFERENT);
    });
    return false;
}
function fieldsAreDifferent(field1, field2)
{
    if (field2==null)
    {
        return true;
    }
    if (!fieldsAreDifferentCheck(field1, field2))
    {
        return false;
    }
    else if (field2.validationMessage == ERROR_MSGS.FIELDS_NOT_DIFFERENT)
    {
        field2.setCustomValidity('');
    }
    return true;
}
function fieldAreSame(field1, field2)
{
    if (field1.value != field2.value && field2.value != '')
    {
        let fields = [field1, field2];
        fields.forEach(field => {
            field.setCustomValidity(ERROR_MSGS.MISMATCH);
        });
        return false;
    }
    else if (field2.validationMessage == ERROR_MSGS.MISMATCH)
    {
        field2.setCustomValidity('')
    }
    return true;
}




function toggleCheckmark(check, patternCheckId)
{
    let active = 'pattern-check-active';
    let patternCheck = document.getElementById(patternCheckId);
    if (check)
    {
        patternCheck.classList.add(active);
    }
    else
    {
        patternCheck.classList.remove(active);
    }
}

function toggleInputCheckmarks(inputElem, patternsDict, idList)
{
    let value = inputElem.value;
    let patterns = Object.values(patternsDict);
    if (patterns.length != idList.length)
    {
        console.log('patterns does not match the lenth of idList');
        console.log(`patterns.length: ${patterns.length} idList.length: ${idList.length}`);
        return false;
    }
    patterns.forEach((pattern, i) => {
        let check;
        if (pattern instanceof Function)
        {
            check = pattern(value.length);
        }
        else
        {
            check = pattern.test(value);
        }
        toggleCheckmark(check, idList[i])
    })
}



function validPassword(inputElem)
{
    let value = inputElem.value;
    let hasLower = PATTERNS.PASSWORD.HAS_LOWER.test(value);
    let hasUpper = PATTERNS.PASSWORD.HAS_UPPER.test(value);
    let hasDigit = PATTERNS.PASSWORD.HAS_DIGIT.test(value);
    let hasSymbol = PATTERNS.PASSWORD.HAS_SYMBOL.test(value);
    let hasLength = PATTERNS.PASSWORD.HAS_LENGTH(value.length);
  
    if (hasLower && hasUpper && hasDigit && hasSymbol && hasLength){
        return true;
    }
    
    inputElem.setCustomValidity('Does not meet criteria.');
    inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = ERROR_MSGS.PASSWORD.INVALID;
    return false;
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
function validateNewEmail(inputElem, confirmElem)
{
    inputElem.parentElement.classList.add('was-validated');
    if (!isPresent(inputElem) || !isEmail(inputElem))
    {
        return false;
    }
    if (!fieldAreSame(inputElem, confirmElem))
    {
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = ERROR_MSGS.EMAIL.MISMATCH;
        return false;
    }
    inputElem.setCustomValidity('');
        return true;
}
function validateConfirmEmail(inputElem, emailElem)
{
    inputElem.parentElement.classList.add('was-validated');
    if (fieldAreSame(inputElem, emailElem))
    {
        inputElem.setCustomValidity('');
        return true;
    }
    else
    {
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = ERROR_MSGS.EMAIL.MISMATCH;
        return false;
    }
    
}




function validateRegistrationPassword(inputElem)
{
    inputElem.parentElement.classList.add('was-validated');
    if (isPresent(inputElem) && validPassword(inputElem))
    {
        inputElem.setCustomValidity('');
        return true;
    }
    return false
}
function validateNewPassword(inputElem, oldPassword, confirmPassword)
{
    inputElem.parentElement.classList.add('was-validated');
    if (!fieldsAreDifferent(inputElem, oldPassword) || !isPresent(inputElem) || !validPassword(inputElem))
    {
        return false;
    }
    else if (!fieldAreSame(inputElem, confirmPassword))
    {
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = ERROR_MSGS.PASSWORD.MISMATCH;
        return false;
    }
    inputElem.setCustomValidity('');
    return true;
    
}
function validateConfirmPassword(inputElem, passwordElem)
{
    inputElem.parentElement.classList.add('was-validated');
    if (fieldAreSame(inputElem, passwordElem))
    {
        inputElem.setCustomValidity('');
        return true;
    }
    else
    {
        inputElem.parentElement.querySelector('.invalid-feedback').innerHTML = ERROR_MSGS.PASSWORD.MISMATCH;
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


function validatePassword(inputElem)
{
    inputElem.parentElement.classList.add('was-validated');
    if (isPresent(inputElem))
    {
        inputElem.setCustomValidity('');
        return true;
    }
    return false;
}
function validateOldPassword(inputElem, newPassword)
{
    inputElem.parentElement.classList.add('was-validated');
    if (isPresent(inputElem) && fieldsAreDifferent(inputElem, newPassword))
    {
        inputElem.setCustomValidity('');
        return true;
    }
    return false;
}