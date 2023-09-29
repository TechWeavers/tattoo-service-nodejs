// token.js
let token = null;

function setToken(newToken) {
    token = newToken;
}

function getToken() {
    return token;
}

module.exports = { setToken, getToken };
