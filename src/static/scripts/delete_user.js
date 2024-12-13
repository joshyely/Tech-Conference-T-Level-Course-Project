const DELETE_BTN = document.querySelector('#delete-btn');
const DELETE_CANCEL_BTN = document.querySelector('#cancel-btn');

const DELETE_CONTAINER = document.querySelector('#delete');
const DELETE_CONFIRM_CONTAINER = document.querySelector('#delete-confirm');
DELETE_CONFIRM_CONTAINER.style.display = 'none';

const DELETE_FORM = document.forms['delete-user'];
const DELETE_PASSWORD = DELETE_FORM['password'];
const DELETE_ERROR = DELETE_FORM.querySelector(FORM_ELEMENT_NAMES.ERROR_FEEDBACK);



let deleteResponseMessage = new ResponseMessages(DELETE_ERROR);
deleteResponseMessage.errorMsgs.invalidCredentials = 'Password is incorrect.';
deleteResponseMessage.displaySuccess = (response) => {
    logout();
    location.href = '/';
}



DELETE_BTN.addEventListener('click', () => {
    DELETE_CONTAINER.style.display = 'none';
    DELETE_CONFIRM_CONTAINER.style.display = 'initial';
});
DELETE_CANCEL_BTN.addEventListener('click', () => {
    DELETE_CONFIRM_CONTAINER.style.display = 'none';
    DELETE_CONTAINER.style.display = 'initial';
});


DELETE_PASSWORD.addEventListener('focusout', () => {
    validatePassword(DELETE_PASSWORD);
});
DELETE_FORM.addEventListener('submit', event => {
    event.preventDefault()
    if (validatePassword(DELETE_PASSWORD))
    {
        fetch('rest/auth/user/delete', {
            method: 'POST',
            body: JSON.stringify({
                token: {
                    access_token: getCookie('access_token'),
                    token_type: 'bearer',
                },
                password: DELETE_PASSWORD.value
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8s'
            }
        })
        .then(response => deleteResponseMessage.deleteAction(response));
    }
})