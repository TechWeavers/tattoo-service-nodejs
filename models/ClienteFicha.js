const db = require("./db");
const ClienteFicha = db.sequelize.define('ClienteFicha', {
    id_cliente_ficha: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nascimento: {
        type: db.Sequelize.DATE,
    },
    endereco: {
        type: db.Sequelize.STRING,
    },
    tratamento: {
        type: db.Sequelize.BOOLEAN,
    },
    tratamentoDesc: {
        type: db.Sequelize.STRING,
    },
    cirurgia: {
        type: db.Sequelize.BOOLEAN,
    },
    cirurgiaDesc: {
        type: db.Sequelize.STRING,
    },
    alergia: {
        type: db.Sequelize.BOOLEAN,
    },
    alergiaDesc: {
        type: db.Sequelize.STRING,
    },
    problemaCardiaco: {
        type: db.Sequelize.BOOLEAN,
    },
    cancer: {
        type: db.Sequelize.BOOLEAN,
    },
    drogas: {
        type: db.Sequelize.BOOLEAN,
    },
    cicatrizacao: {
        type: db.Sequelize.BOOLEAN,
    },
    diabetes: {
        type: db.Sequelize.BOOLEAN,
    },
    diabetesDesc: {
        type: db.Sequelize.STRING,
    },
    convulsao: {
        type: db.Sequelize.BOOLEAN,
    },
    convulsaoDesc: {
        type: db.Sequelize.STRING,
    },
    doencasTransmissiveis: {
        type: db.Sequelize.BOOLEAN,
    },
    doencasTransmissiveisDesc: {
        type: db.Sequelize.STRING,
    },
    pressao: {
        type: db.Sequelize.BOOLEAN,
    },
    anemia: {
        type: db.Sequelize.BOOLEAN,
    },
    hemofilia: {
        type: db.Sequelize.BOOLEAN,
    },
    hepatite: {
        type: db.Sequelize.BOOLEAN,
    },
    outro: {
        type: db.Sequelize.BOOLEAN,
    },
    outroDesc: {
        type: db.Sequelize.STRING,
    },
    dataAtual: {
        type: db.Sequelize.DATE,
    }

});

//ClienteFicha.sync({ force: true });
module.exports = ClienteFicha;