const db = require("./db");
const MaterialConsumido = require("./MaterialConsumido");

const Material = db.sequelize.define('Material', {
  id_material: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: db.Sequelize.STRING,
  },
  quantidade: {
    type: db.Sequelize.INTEGER,
  },
  valor_unidade: {
    type: db.Sequelize.DOUBLE,
  },
  data_compra: {
    type: db.Sequelize.DATE,
  },
});

Material.hasOne(MaterialConsumido, { foreignKey: 'fk_material' });

//Material.sync({ force: true })
  
module.exports = Material