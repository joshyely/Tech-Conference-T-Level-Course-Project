function logout()
{
    deleteCookie('access_token');
    deleteCookie('first_name');
}

document.querySelector('#logout-btn').addEventListener('click', ()=> {
    logout();
    location.reload();
});