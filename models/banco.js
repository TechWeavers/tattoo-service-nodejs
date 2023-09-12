const Sequelize = require("sequelize")
const sequelize = new Sequelize("TattooServiceBD", "root", "", {
    host: "localhost",
    dialect: "mysql",
    define: {
        timestamps: false, 
        freezeTableName: true, 
      },
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}