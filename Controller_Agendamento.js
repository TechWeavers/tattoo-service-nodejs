const copiaEventos = require("./models/copiaEventos")
const nodemailer = require("./Nodemailer")
const { Op } = require('sequelize');

let data = new Date();

copiaEventos.update({
        status: "realizado"
    }, {
        where: {
            'data_evento': {
                [Op.gte]: data,
            }
        }
    }

).then(nodemailer.email.enviarEmail)