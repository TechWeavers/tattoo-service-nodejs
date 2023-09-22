const db = require("./db")

const Administrador = db.sequelize.define("Administrador", {
    id_administrador: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
});

//Administrador.sync({ force: true })
  
module.exports = Administrador