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

let tipo = null;

function setTipo(newTipo) {
    tipo = newTipo;
}

function getTipo() {
    return tipo;
}

function removeTipo() {
    tipo = null;
}


module.exports = { setToken, getToken, removeToken, setTipo, getTipo, removeTipo };
