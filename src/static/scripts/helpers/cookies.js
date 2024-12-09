function getCookie(cookieName)
{
    let decodedCookie = decodeURIComponent(document.cookie);
    if (!decodedCookie.includes(cookieName))
    {
        return false;
    }

    let variableStart = decodedCookie.indexOf(cookieName) + cookieName.length + 1;
    let variableEnd = decodedCookie.indexOf(';', variableStart);
    // Since there is no semi colon at the end of a cookie, if the variable end is -1 (false) don't include an end value so the whole variable gets captured.
    if (variableEnd == -1)
    {
        return decodedCookie.slice(variableStart);
    }
    return decodedCookie.slice(variableStart, variableEnd);
}
const deleteCookie = cookieName => document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  
