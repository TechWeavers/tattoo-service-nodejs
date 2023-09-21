const Colaborador = require("./Colaborador");
const Material = require("./Material");
const db = require("./db")

const Administrador = db.sequelize.define("Administrador", {
    fk_Administrador: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Colaborador,
            key: 'id_colaborador'
        }
    }
});

Administrador.hasMany(Material, { foreignKey: 'fk_Comprador' });

//Administrador.sync({ force: true })
  
module.exports = Administrador