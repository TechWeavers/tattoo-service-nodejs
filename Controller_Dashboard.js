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

// variaveis para configurar data de ontem
let dataOntem = new Date(data);
dataOntem.setDate(data.getDate() - 1);
let dataOntemTeste = dataOntem.toLocaleDateString();
let dataFormatadaOntem = dataOntemTeste.split("/");
let anoOntem = dataFormatadaOntem[2];
let mesOntem = dataFormatadaOntem[1];
let diaOntem = dataFormatadaOntem[0];
dataFormatadaOntem = anoOntem + "-" + mesOntem + "-" + diaOntem;

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
                    [Op.gte]: data,
                }
            },
            limit: 5,
        });
        return proximos_eventos;
    }

    static async procedimentosRealizados() {
        const eventosRealizados = await copiaEventos.findAll({
            where: {
                data_evento: {
                    [Op.lte]: dataFormatadaOntem,
                },
            },
            limit: 5
        });
        return eventosRealizados;
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