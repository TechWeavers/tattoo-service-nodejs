const Procedimento = require("./Procedimento");
const db = require("./db")

const Cliente = db.sequelize.define('Cliente', {
  id_cliente: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: db.Sequelize.STRING,
  },
  cpf: {
    type: db.Sequelize.STRING,
  },
  telefone: {
    type: db.Sequelize.STRING,
  },
  email: {
    type: db.Sequelize.STRING,
  },
  redeSocial: {
    type: db.Sequelize.STRING,
  },
  fichaAnamnese: {
    type: db.Sequelize.STRING,
  }
});

Cliente.hasMany(Procedimento, { foreignKey: 'fk_Cliente' });

//Cliente.sync({ force: true })
  
module.exports = Cliente