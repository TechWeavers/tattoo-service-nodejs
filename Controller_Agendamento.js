const copiaEventos = require("./models/copiaEventos");
const Material = require("./models/Material");
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
