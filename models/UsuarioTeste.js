const db = require("./db")

const UsuarioTeste = db.sequelize.define("UsuarioTeste", {
    id_usuarioteste: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    nome: {
        type: db.Sequelize.STRING,
    },
    email: {
        type: db.Sequelize.STRING,
    },
    senha: {
        type: db.Sequelize.STRING,
    }
});

//UsuarioTeste.sync({ force: true })
  
module.exports = UsuarioTeste