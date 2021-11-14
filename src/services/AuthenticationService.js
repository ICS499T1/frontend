import jwt_decode from 'jwt-decode';

function tokenUnavailable(history) {
    const token = localStorage.getItem('accessToken');
    if (token === null) {
        history.push("/login");
    }
}

function successfulAuth(history) {
    console.log("Last location: " + localStorage.getItem('lastLocation'));
    history.push(localStorage.getItem('lastLocation'));
}

function tokenExpired(history) {
    console.log("Inside of the tokenExpired method");
    var token = localStorage.getItem('accessToken');
    if (token !== null) {
        var decodedToken = jwt_decode(token);
        var currentTime = new Date().getTime();
        console.log("Token expired: ", decodedToken.exp < currentTime)
        if (decodedToken.exp < currentTime) {
            history.push("/login");
        }
    } else console.log("tokenExpired -> the token has not been initialized")
}

export default tokenUnavailable;
export { successfulAuth, tokenExpired }
