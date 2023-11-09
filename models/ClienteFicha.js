const db = require("./db");
const ClienteFicha = db.sequelize.define('ClienteFicha', {
    id_cliente_ficha: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: db.Sequelize.STRING,
    },
    cpf: {
        type: db.Sequelize.STRING,
    },
    telefone: {
        type: db.Sequelize.STRING,
    },
    email: {
        type: db.Sequelize.STRING,
    },
    redeSocial: {
        type: db.Sequelize.STRING,
    },
    assinatura: {
        type: db.Sequelize.BOOLEAN
    },
    doenca1: {
        type: db.Sequelize.TEXT
    },
    doenca2: {
        type: db.Sequelize.TEXT
    },
    alergia1: {
        type: db.Sequelize.TEXT
    },
    alergia2: {
        type: db.Sequelize.TEXT
    },
    medicacao1: {
        type: db.Sequelize.TEXT
    },
    medicacao2: {
        type: db.Sequelize.TEXT
    }

});

//ClienteFicha.sync({ force: true });
module.exports = ClienteFicha;