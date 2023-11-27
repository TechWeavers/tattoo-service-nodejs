// token.js
let token = null;

function setToken(newToken) {
    token = newToken;
}

function getToken() {
    return token;
}

function removeToken() {
    token = null;
}

module.exports = { setToken, getToken, removeToken };
