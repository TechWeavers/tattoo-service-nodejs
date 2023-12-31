const db = require("./db");

const CopiaEventos = db.sequelize.define("copiaEventos", {
    id_evento: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_evento: {
        type: db.Sequelize.STRING
    },
    nome_cliente: {
        type: db.Sequelize.STRING
    },
    email_cliente: {
        type: db.Sequelize.STRING
    },
    nome_colaborador: {
        type: db.Sequelize.STRING
    },
    data_evento: {
        type: db.Sequelize.STRING
    },
    hora_inicio: {
        type: db.Sequelize.STRING
    },
    hora_termino: {
        type: db.Sequelize.STRING
    },
    status: {
        type: db.Sequelize.STRING
    },
    id_procedimento_API: {
        type: db.Sequelize.STRING
    }

})

//CopiaEventos.sync({ force: true });

module.exports = CopiaEventos;