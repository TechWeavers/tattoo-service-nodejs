const Sequelize = require("sequelize")
let sequelize
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.JAWSDB_URL);

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();

if (process.env.NODE_ENV === 'production' && process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL, {
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