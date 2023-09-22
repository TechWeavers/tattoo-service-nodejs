const Colaborador = require("./Colaborador");
const db = require("./db")

const Administrador = db.sequelize.define("Administrador", {
    id_administrador: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
});

Administrador.hasOne(Colaborador, { foreignKey: 'fk_administrador' });

Administrador.sync({ force: true })
  
module.exports = Administrador