function logout()
{
    deleteCookie('access_token');
    deleteCookie('first_name');
    location.reload();
}
document.querySelector('#logout-btn').addEventListener('click', ()=> {
    logout();
});