const db = require("./db")

const Evento = db.sequelize.define('Evento', {
  evento_nome: {
    type: db.Sequelize.STRING,
    primaryKey: true,
    autoIncrement: true,
  },
  evento_nome: {
    type: db.Sequelize.STRING,
  },
  descricao: {
    type: db.Sequelize.STRING,
  },
  data: {
    type: db.Sequelize.DATE,
  },
  hora_inicio: {
    type: db.Sequelize.DATE,
  },
  hora_fim: {
    type: db.Sequelize.DATE,
  }
});


  
module.exports = Evento