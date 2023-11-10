const Procedimento = require("./Procedimento");
const FichaAnamnese = require("./FichaAnamnese");
const db = require("./db")

const Cliente = db.sequelize.define('Cliente', {
    id_cliente: {
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
    }

});

//Cliente.hasOne(Procedimento, { foreignKey: 'fk_cliente' });
//Cliente.hasOne(FichaAnamnese, { foreignKey: 'fk_cliente' });

//Cliente.sync({ force: true });

module.exports = Cliente