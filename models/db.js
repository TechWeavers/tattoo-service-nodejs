const Sequelize = require("sequelize")
const sequelize = new Sequelize('DBTattooService', 'root', 'devsolitario18', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
        freezeTableName: true,
    },
});

// Sincronize os modelos com o banco de dados
sequelize.sync().then(() => {
    console.log('Tabelas sincronizadas com sucesso.');
}).catch(err => {
    console.error('Erro ao sincronizar tabelas:', err);
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}