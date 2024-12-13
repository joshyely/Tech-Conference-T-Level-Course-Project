// Makes it so it dont have to put switch statements for every form, making the code more centralised and maintainable.

// !! WARNING
// THIS CODE MAY CAUSE MINOR TO SEVERE PSYCHOLOGY DAMAGE, YOU HAVE BEEN WARNED!

class ResponseMessages
{
    formErrorElem
    formSuccessElem
    errorMsgs = {
        invalidCredentials: 'Email or Password is incorrect.',
        serverError:'Server Error. Please try again later.',
        tokenError: 'Token Error. Please try again or contact support.',
        genericError: 'Something went wrong.',
        entryExistsError: 'Entry already exists.',
        backendValidationError: 'Invalid fields (server).'
    }
    args = {
        displayNotAuthorised: [],
        displayServerError: [],
        displayTokenError: [],
        displayGenericError: [],
        displayEntryExistsError: [],
        displayBackendValidationError: [],
        displaySuccess: []
    }
    displayNotAuthorised = (response) => this.formErrorElem.innerHTML = this.errorMsgs.invalidCredentials;
    displayServerError = (response) => this.formErrorElem.innerHTML = this.errorMsgs.serverError;
    displayTokenError = (response) => this.formErrorElem.innerHTML = this.errorMsgs.tokenError;
    displayGenericError = (response) => this.formErrorElem.innerHTML = this.errorMsgs.genericError;
    displayEntryExistsError = (response) => this.formErrorElem.innerHTML = this.errorMsgs.entryExistsError;
    displayBackendValidationError = (response) => this.formErrorElem.innerHTML = this.errorMsgs.backendValidationError;
    displaySuccess = (response) => this.formSuccessElem.innerHTML = 'Success!';


    constructor(formErrorElem=Element, formSuccessElem=Element)
    {
        this.formErrorElem = formErrorElem;
        this.formSuccessElem = formSuccessElem;
    }
    

    __errorMsgs__ = async (response) =>
    {
        switch(response.status)
        {
            case 401: // Not Authorised
                this.displayNotAuthorised(response, ...this.args.displayNotAuthorised);
                break;
            case 422: // Validation Error
                this.displayBackendValidationError(response, ...this.args.displayBackendValidationError);
                break;
            case 500: // Server Error
                this.displayServerError(response, ...this.args.displayServerError);
                break;
            default:
                this.displayGenericError(response, ...this.args.displayGenericError);
        }
    }
    
    
    authenticateAction = async (response) =>
    {
        switch(response.status)
        {
            case 302: // Authorised/Logged In
                this.displaySuccess(response, ...this.args.displaySuccess);
                break;
            default:
                this.__errorMsgs__(response);
                return false;
        }
    }
    createAction = async (response) =>
    {
        switch(response.status)
        {
            case 201: //row creation success
                this.displaySuccess(response, ...this.args.displaySuccess);
                break;
            case 226: // Row Exists
                this.displayEntryExistsError(response, ...this.args.displayEntryExistsError);
                break;
            default:
                this.__errorMsgs__(response);
                return false;
        }
    }
    updateAction = async (response) => {
        switch(response.status)
        {
            case 200: //row updated successfully
                this.displaySuccess(response, ...this.args.displaySuccess);
                break;
            case 226: // Row Exists
                this.displayEntryExistsError(response, ...this.args.displayEntryExistsError);
                break;
            default:
                this.__errorMsgs__(response);
                return false;
        }
    }
    deleteAction = async (response) => {
        switch(response.status)
        {
            case 200: //row successfully deleted
                this.displaySuccess(response, ...this.args.displaySuccess);
                break;
            default:
                this.__errorMsgs__(response);
                return false;
        }
    }
}

// UNIT TESTING
async function __response_messages_unitTests__()
{
    let formErrElem = document.querySelector('#dummy-form-feedback');
    let responseMessage = new ResponseMessages(formErrElem);
    class DummyResponse
    {
        status
        constructor(status)
        {
            this.status = status;
        }
    }
    async function unitTest(status, testedFunc, expectedResult, testNum)
    {
        
        let testArg = 'argVal';
        let response = new DummyResponse(status);
        let successFunc = (response, arg) => {
            if (arg==testArg)
            {
                return true;
            }
            console.log('arg problem')
            return false;
        }
        
        responseMessage.displaySuccess = successFunc;
        responseMessage.args.displaySuccess = [testArg];
        let result = await testedFunc(response);

        if (result === expectedResult)
        {
            console.log(`UNIT TEST ${testNum}: PASSED`);
        }
        else{
            console.log(`UNIT TEST ${testNum}: FAILED`);
        }
    }
    
    console.log('--- response_messages.js ---')
    unitTest(201, responseMessage.createAction, true, 1);
    unitTest(401, responseMessage.createAction, false, 2);
    
    unitTest(302, responseMessage.authenticateAction, true, 3);
    unitTest(401, responseMessage.authenticateAction, false, 4);
}


