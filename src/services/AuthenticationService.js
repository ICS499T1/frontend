
function tokenUnavailable(history) {
    const token = localStorage.getItem('accessToken');
    if (token === null) {
        console.log("inside of the if statement");
        history.push("/login");
    }
}

export function successfulAuth(history) {
    console.log("Last location: " + localStorage.getItem('lastLocation'));
    history.push(localStorage.getItem('lastLocation'));
}

export default tokenUnavailable;
