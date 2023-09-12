const Sequelize = require("sequelize")
let sequelize

if (process.env.NODE_ENV === 'production' && process.env.JAWSDB_MARIA_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_MARIA_URL, {
      dialect: 'mysql',
      logging: false, // Desative os logs se preferir
    });
  } else {
    // Use as configurações do banco de dados local se não estiver no Heroku
    sequelize = new Sequelize('TattooServiceBD', 'root', '', {
      host: 'localhost',
      dialect: 'mysql',
      define: {
        timestamps: false,
        freezeTableName: true,
      },
    });
  }

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}