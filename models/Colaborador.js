const Procedimento = require("./Procedimento");
const db = require("./db")

const Colaborador = db.sequelize.define('Colaborador', {
  id_colaborador: {
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
  tipo: {
      type: db.Sequelize.ENUM('Tatuador', 'Administrador')
  }
});


Colaborador.hasMany(Procedimento, { foreignKey: 'fk_Agendador' });

//Colaborador.sync({ force: true })
  
module.exports = Colaborador