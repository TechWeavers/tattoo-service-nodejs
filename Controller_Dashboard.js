// este arquivo será de armazenamento dos dados que serão exibidos na dashboar
const MaterialConsumido = require("./models/MaterialConsumido")
const copiaEventos = require("./models/copiaEventos")
const Cliente = require("./models/Cliente")
const Material = require("./models/Material")

// variaveis de data do dia
let data = new Date();
let dia = data.getDate();
let mes = data.getMonth()
let ano = data.getFullYear()

//variavel do sequelize 
const { Op } = require('sequelize');

let diaAtual = dia + "/" + (mes + 1) + "/" + ano;



class Dashboard {

    // quantidade de clientes
    static async quantClientes() {
        const totClientes = await Cliente.count();
        return totClientes;
    }

    static async quantidadeAgendamentos(quant) {
        const agendamentos = await copiaEventos.findAll();
        let quantEventos = agendamentos.length;
        return quantEventos;
    }



    static async visualizarMaterialConsumido(id_consumo) {
        const view = await MaterialConsumido.findAll();
        return view;
    }

    static async próximosProcedimentos() {
        const proximos_eventos = await copiaEventos.findAll({
            where: {
                'data_evento': {
                    [Op.gte]: diaAtual,
                }
            },
            order: [
                ['data_evento', 'ASC'], // Ordena os resultados pela data do evento em ordem crescente
            ],
            limit: 5,
        });
        return proximos_eventos;
    }

    static async materiaisFaltantes() {
        const faltantes = await Material.findAll({
            where: {
                'quantidade': {
                    [Op.lt]: 5
                }
            }
        })
        return faltantes;
    }
}

module.exports = { Dashboard };