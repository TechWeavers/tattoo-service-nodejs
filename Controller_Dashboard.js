// este arquivo será de armazenamento dos dados que serão exibidos na dashboar
const MaterialConsumido = require("./models/MaterialConsumido")
const copiaEventos = require("./models/copiaEventos")
const agendamentos = 0;

// variaveis de data do dia
let data = new Date();
let dia = data.getDate();
let mes = data.getMonth()
let ano = data.getFullYear()

//variavel do sequelize 
const { Op } = require('sequelize');

let diaAtual = dia + "/" + (mes + 1) + "/" + ano;



class Dashboard {

    static quantidadeAgendamentos(quant) {
        agendamentos = agendamentos + quant;
        return agendamentos;
    }

    static async quantidadeClientes(clientes) {
        this.clientes = clientes;
        return this.clientes;
    }

    static async visualizarMaterialConsumido(id_consumo) {
        const view = await MaterialConsumido.findAll();
        return view;
    }

    static async próximosProcedimentos() {
        const eventos_realizados = await copiaEventos.findAll({
            where: {
                'data_evento': {
                    [Op.gte]: data,
                }
            }
        });
        return eventos_realizados;
    }
}

module.exports = { Dashboard };