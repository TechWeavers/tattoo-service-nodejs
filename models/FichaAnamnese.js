const db = require("./db");
const Cliente = require("./Cliente");

const FichaAnamnese = db.sequelize.define("fichaAnamnese", {
    id_ficha: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    assinatura: {
        type: db.Sequelize.BOOLEAN
    },
    doenca1: {
        type: db.Sequelize.TEXT
    },
    doenca2: {
        type: db.Sequelize.TEXT
    },
    alergia1: {
        type: db.Sequelize.TEXT
    },
    alergia2: {
        type: db.Sequelize.TEXT
    },
    medicacao1: {
        type: db.Sequelize.TEXT
    },
    medicacao2: {
        type: db.Sequelize.TEXT
    }
})

//FichaAnamnese.sync({ force: true });


module.exports = FichaAnamnese;