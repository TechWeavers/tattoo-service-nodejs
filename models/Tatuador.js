const Procedimento = require("./Procedimento");
const Colaborador = require("./Colaborador");
const db = require("./db")

const Tatuador = db.sequelize.define("Tatuador", {
    id_tatuador: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
});

Tatuador.hasOne(Procedimento, { foreignKey: 'fk_tatuador' });
Tatuador.hasOne(Colaborador, { foreignKey: 'fk_tatuador' });

//Tatuador.sync({ force: true })
  
module.exports = Tatuador