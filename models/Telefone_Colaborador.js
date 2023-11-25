const db = require("./db")
const Colaborador = require("./Colaborador");

const Telefone_Colaborador = db.sequelize.define("telefone_colaborador", {
    id_telefone: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    telefone: {
        type: db.Sequelize.INTEGER,

    }
})

//Telefone_Colaborador.sync({ force: true });

module.exports = Telefone_Colaborador;