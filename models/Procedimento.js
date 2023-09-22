const Material = require("./Material");
const db = require("./db")

const Procedimento = db.sequelize.define('Procedimento', {
  id_procedimento: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  data_agendamento: {
    type: db.Sequelize.DATE,
  },
  valor_cobrado: {
    type: db.Sequelize.DOUBLE,
  }
});

Procedimento.hasOne(Material, { foreignKey: 'fk_procedimento' });

Procedimento.sync({ force: true })
  
module.exports = Procedimento