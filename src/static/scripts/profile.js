async function getUserInfo()
{
    fetch('rest/auth/user/info', {
        method: 'POST',
        body: JSON.stringify({
            access_token: getCookie('access_token'),
            token_type: 'bearer'
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8s',
        }
    })
    .then(response => {return response.json()})
    .then(json => {
        let user = json.current_user;
        document.querySelector('#full-name').innerHTML = `${user.fName} ${user.lName}`;
        document.querySelector('#email').innerHTML = user.email;
        document.querySelector('#date-registered').innerHTML = user.dateRegistered;
    })
}

getUserInfo()


