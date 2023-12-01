const db = require("./db")

const MaterialConsumido = db.sequelize.define('MaterialConsumido', {
    id_consumo: {
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
    valor_total: {
        type: db.Sequelize.DOUBLE,
    },
    data_consumo: {
        type: db.Sequelize.STRING,
    },
});


//MaterialConsumido.sync({ force: true })

module.exports = MaterialConsumido