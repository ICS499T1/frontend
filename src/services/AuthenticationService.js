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
    var decodedToken = jwt_decode(localStorage.getItem('accessToken'));
    var currentTime = new Date().getTime();
    if (decodedToken.exp < currentTime) {
        history.push("/login");
    }
}

export default tokenUnavailable;
export { successfulAuth, tokenExpired }
