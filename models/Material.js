const db = require("./db")

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
  }
});


Material.sync({ force: true })
  
module.exports = Material