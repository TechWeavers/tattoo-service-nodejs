const Procedimento = require("./Procedimento");
const db = require("./db");
const MaterialConsumido = require("./MaterialConsumido");

const Tatuador = db.sequelize.define("Tatuador", {
    id_tatuador: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
});

Tatuador.hasOne(Procedimento, { foreignKey: 'fk_tatuador' });
Tatuador.hasOne(MaterialConsumido, { foreignKey: 'fk_tatuador' });

//Tatuador.sync({ force: true })
  
module.exports = Tatuador