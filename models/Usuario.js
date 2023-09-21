const Colaborador = require("./Colaborador");
const Procedimento = require("./Procedimento");
const db = require("./db")

const Usuario = db.sequelize.define("Usuario", {
    fk_Usuario: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Colaborador,
            key: 'id_colaborador'
        }
    },
    usuario: {
        type: db.Sequelize.STRING,
    },
    senha: {
        type: db.Sequelize.STRING,
    }
});

//Usuario.sync({ force: true })
  
module.exports = Usuario