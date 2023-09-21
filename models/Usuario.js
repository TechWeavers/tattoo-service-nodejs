const db = require("./db")

const Usuario = db.sequelize.define("Usuario", {
    id_usuario: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    usuario: {
        type: db.Sequelize.STRING,
        unique: true,
    },
    senha: {
        type: db.Sequelize.STRING,
    },
    fk_colaborador: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        unique: true,
    },
});

Usuario.beforeCreate(async (usuario, options) => {
    const usuarioExistente = await Usuario.findOne({
        where: { usuario: usuario.usuario },
    });
    
    const colaboradorComUsuario = await Usuario.findOne({
        where: { fk_colaborador: usuario.fk_colaborador },
    });

    if (usuarioExistente) {
        throw new Error('Nome de usuário já cadastrado.')
    }

    if (colaboradorComUsuario) {
        throw new Error('Já existe um usuário para este colaborador.')
    }
})

//Usuario.sync({ force: true })
  
module.exports = Usuario