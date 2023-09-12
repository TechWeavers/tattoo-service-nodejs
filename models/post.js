const db = require("./banco")

const Colaborador = db.sequelize.define('Colaborador', {
  id_colaborador: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: db.Sequelize.STRING,
  },
  cpf: {
    type: db.Sequelize.STRING,
  },
  telefone: {
    type: db.Sequelize.STRING,
  },
  email: {
    type: db.Sequelize.STRING,
  },
  redeSocial: {
    type: db.Sequelize.STRING,
  },
  tipo: {
      type: db.Sequelize.ENUM('Tatuador', 'Administrador')
  }
});

const Tatuador = db.sequelize.define("Tatuador", {
    fk_Tatuador: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Colaborador,
            key: 'id_colaborador'
        }
    },
    especialidade: {
        type: db.Sequelize.STRING
    }
});

const Administrador = db.sequelize.define("Administrador", {
    fk_Administrador: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Colaborador,
            key: 'id_colaborador'
        }
    },
    cargo: {
        type: db.Sequelize.STRING
    }
});

const Cliente = db.sequelize.define('Cliente', {
  id_cliente: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: db.Sequelize.STRING,
  },
  cpf: {
    type: db.Sequelize.STRING,
  },
  telefone: {
    type: db.Sequelize.STRING,
  },
  email: {
    type: db.Sequelize.STRING,
  },
  redeSocial: {
    type: db.Sequelize.STRING,
  },
  fichaAnamnese: {
    type: db.Sequelize.STRING,
  }
});

const Procedimento = db.sequelize.define('Procedimento', {
  id_procedimento: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  data_agendamento: {
    type: db.Sequelize.DATE,
  },
  valor_cobrado: {
    type: db.Sequelize.DOUBLE,
  }
});

const Material = db.sequelize.define('Material', {
  id_material: {
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
  valor_unidade: {
    type: db.Sequelize.DOUBLE,
  },
  data_compra: {
    type: db.Sequelize.DATE,
  }
});

Tatuador.hasMany(Procedimento, { foreignKey: 'fk_Tatuador' });

Cliente.hasMany(Procedimento, { foreignKey: 'fk_Cliente' });

Colaborador.hasMany(Procedimento, { foreignKey: 'fk_Agendador' });

Procedimento.hasMany(Material, { foreignKey: 'fk_Procedimento' });

Administrador.hasMany(Material, { foreignKey: 'fk_Comprador' });

//db.sequelize.sync({ force: true })
  
module.exports = {
    Colaborador: Colaborador,
    Tatuador: Tatuador,
    Administrador: Administrador,
    Cliente: Cliente,
    Procedimento: Procedimento,
    Material: Material
}