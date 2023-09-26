const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = {
    eAdmin: async (req, res, next) => {
        const authHeader = req.headers.authorizathion;
        console.log(authHeader);
    }
}