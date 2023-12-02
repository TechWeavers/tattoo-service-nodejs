const copiaEventos = require("../models/copiaEventos")
const Nodemailer = require("./Nodemailer")


let dataAtual = new Date(); // data atual 
//configurações para obter a data do dia anterior de forma compativel
let dataOntem = new Date(dataAtual);
dataOntem.setDate(dataAtual.getDate() - 1);
let dataOntemTeste = dataOntem.toLocaleDateString();
let dataFormatadaOntem = dataOntemTeste.split("/");
let anoOntem = dataFormatadaOntem[2];
let mesOntem = dataFormatadaOntem[1];
let diaOntem = dataFormatadaOntem[0];
dataFormatadaOntem = anoOntem + "-" + mesOntem + "-" + diaOntem;

//configurações para obter a data de 15 dias atrás de forma compativel
let data15dias = new Date(dataAtual);
data15dias.setDate(dataAtual.getDate() - 15);
let data15DiasTeste = data15dias.toLocaleDateString();
let dataFormatada15Dias = data15DiasTeste.split("/");
let ano15Dias = dataFormatada15Dias[2];
let mes15Dias = dataFormatada15Dias[1];
let dia15Dias = dataFormatada15Dias[0];
dataFormatada15Dias = ano15Dias + "-" + mes15Dias + "-" + dia15Dias;
console.log(dataFormatada15Dias);



class Controller_Agendamento {
    static async posAgendamento24Horas() {
        try {
            const eventosontem = await copiaEventos.findAll({
                where: { data_evento: dataFormatadaOntem }
            })

            eventosontem.map(eventos => {
                eventos.update({
                    status: "Realizado"
                }, {
                    where: {
                        data_evento: dataFormatadaOntem
                    }
                })
            })

            eventosontem.map(eventos => {
                Nodemailer.email.enviarEmail24HorasPosProcedimento(eventos.email_cliente, eventos.nome_cliente)

            })
            console.log("agendamentos atualizados com sucesso")
        } catch {
            console.log("erro ao atualizar status dos agendamentos")
        }
    }

    static async posAgendamento15Dias() {
        try {
            const eventos15Dias = await copiaEventos.findAll({
                where: { data_evento: dataFormatada15Dias }
            })

            eventos15Dias.map(eventos => {
                eventos.update({
                    status: "Realizado"
                }, {
                    where: {
                        data_evento: dataFormatada15Dias
                    }
                })
            })

            eventos15Dias.map(eventos => {
                Nodemailer.email.enviarEmail15DiasPosProcedimento(eventos.email_cliente, eventos.nome_cliente)

            })

            console.log("Convites enviados com sucesso")
        } catch {
            console.log("Erro ao enviar os convites")
        }
    }
}



module.exports = { Controller_Agendamento };