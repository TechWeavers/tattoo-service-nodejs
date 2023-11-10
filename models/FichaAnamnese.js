const db = require("./db");
const Cliente = require("./Cliente");

// a ficha de anamnese terá um relacionamento 1,1 com cliente, cada ficha de anamnese criada será obrigatório o id do cliente.

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

FichaAnamnese.hasOne(Cliente, { foreignKey: 'fk_anamnese' });

//FichaAnamnese.sync({ force: true });
//FichaAnamnese.belongsTo(Cliente);


module.exports = FichaAnamnese;