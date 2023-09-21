const Colaborador = require("./Colaborador");
const Procedimento = require("./Procedimento");
const db = require("./db")

const Tatuador = db.sequelize.define("Tatuador", {
    fk_Tatuador: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Colaborador,
            key: 'id_colaborador'
        }
    }
});

Tatuador.hasMany(Procedimento, { foreignKey: 'fk_Tatuador' });

//Tatuador.sync({ force: true })
  
module.exports = Tatuador