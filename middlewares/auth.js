const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const tokenModule = require('../modules/token');
const { Controller_Colaborador_Usuario } = require('../Controller_Colaborador_Usuario');


module.exports = {
    eTatuador: async(req, res, next) => {
        //const authHeader = req.headers.authorization;
        //const token = authHeader.split(" ")[1];

        const token = tokenModule.getToken();

        if (!token) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Necessario token"
            })
        }

        try {
            const decode = await promisify(jwt.verify)(token, "J98JDASD908ML0G9ZV8ML1PI3I89S7D6F");
            req.idUsuario = decode.id;
                        
            return next();
        } catch (err) {
            return res.status(400).json({
                erro: true,
                mensagem: "Token Invalido"
            })
        }
    },

    eAdmin: async(req, res, next) => {
        //const authHeader = req.headers.authorization;
        //const token = authHeader.split(" ")[1];

        const token = tokenModule.getToken();
        const tipo = tokenModule.getTipo();

        if (!token) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Necessario token"
            })
        }

        if (tipo === 'Tatuador') {
            return res.redirect("/admin-error")
        }

        try {
            const decode = await promisify(jwt.verify)(token, "J98JDASD908ML0G9ZV8ML1PI3I89S7D6F");
            req.idUsuario = decode.id;
                        
            return next();
        } catch (err) {
            return res.status(400).json({
                erro: true,
                mensagem: "Token Invalido"
            })
        }
    }
}