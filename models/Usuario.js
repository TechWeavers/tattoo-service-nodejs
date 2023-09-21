const db = require("./db")

const Usuario = db.sequelize.define("Usuario", {
    id_usuario: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    usuario: {
        type: db.Sequelize.STRING,
    },
    senha: {
        type: db.Sequelize.STRING,
    }
});

//Usuario.sync({ force: true })
  
module.exports = Usuario