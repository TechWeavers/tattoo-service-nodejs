const Cliente = require("./models/Cliente");
const ClienteFicha = require("./models/ClienteFicha");

class Controller_Cliente {
    static visualizarCliente() {
        const view = Cliente.findAll();
        return view;
    }

    static cadastrarCliente(nome, cpf, telefone, email, redeSocial) {
        const create = Cliente.create({
            nome: nome,
            cpf: cpf,
            telefone: telefone,
            email: email,
            redeSocial: redeSocial
        })
        return create;
    }

    static excluirCliente(id_cliente) {
        const deleta = Cliente.destroy({ where: { 'id_cliente': id_cliente } });
        return deleta;
    }

    // procura o cliente especificado para editar os dados
    static procurarCliente(id_cliente) {
        const procura = Cliente.findAll({ where: { 'id_cliente': id_cliente } });
        return procura;
    }

    static atualizarCliente(id_cliente, nome, cpf, telefone, email, redeSocial) {
        const atualiza = Cliente.update({
            nome: nome,
            cpf: cpf,
            telefone: telefone,
            email: email,
            redeSocial: redeSocial
        }, { where: { 'id_cliente': id_cliente } })
        return atualiza;
    }

    static buscarCPF(cpf) {
        const busca = Cliente.findAll({ where: { cpf: cpf } });
        return busca;
    }

    // funções da ficha de anamnese

    static cadastrarFicha(nascimento, endereco, tratamento, tratamentoDesc, cirurgia, cirurgiaDesc, alergia, alergiaDesc, problemaCardiaco, cancer, drogas, cicatrizacao, diabetes, diabetesDesc, convulsao, convulsaoDesc, doencasTransmissiveis, doencasTransmissiveisDesc, pressao, anemia, hemofilia, hepatite, outro, outroDesc, dataAtual, fk_cliente) {
        const cadFicha = ClienteFicha.create({
            nascimento: nascimento,
            endereco: endereco,
            tratamento: tratamento,
            tratamentoDesc: tratamentoDesc,
            cirurgia: cirurgia,
            cirurgiaDesc: cirurgiaDesc,
            alergia: alergia,
            alergiaDesc: alergiaDesc,
            problemaCardiaco: problemaCardiaco,
            cancer: cancer,
            drogas: drogas,
            cicatrizacao: cicatrizacao,
            diabetes: diabetes,
            diabetesDesc: diabetesDesc,
            convulsao: convulsao,
            convulsaoDesc: convulsaoDesc,
            doencasTransmissiveis: doencasTransmissiveis,
            doencasTransmissiveisDesc: doencasTransmissiveisDesc,
            pressao: pressao,
            anemia: anemia,
            hemofilia: hemofilia,
            hepatite: hepatite,
            outro: outro,
            outroDesc: outroDesc,
            dataAtual: dataAtual,
            fk_cliente: fk_cliente
        })

        return cadFicha;
    }

    static procurarFicha(fk_cliente) {
        const ficha = ClienteFicha.findAll({ where: { 'fk_cliente': fk_cliente } });
        return ficha;
    }

    static excluirDadosFicha(fk_cliente) {
        const deleta = ClienteFicha.update({
            nascimento: null,
            endereco: null,
            tratamento: null,
            tratamentoDesc: null,
            cirurgia: null,
            cirurgiaDesc: null,
            alergia: null,
            alergiaDesc: null,
            problemaCardiaco: null,
            cancer: null,
            drogas: null,
            cicatrizacao: null,
            diabetes: null,
            diabetesDesc: null,
            convulsao: null,
            convulsaoDesc: null,
            doencasTransmissiveis: null,
            doencasTransmissiveisDesc: null,
            pressao: null,
            anemia: null,
            hemofilia: null,
            hepatite: null,
            outro: null,
            outroDesc: null,
            dataAtual: null
        }, { where: { 'fk_cliente': fk_cliente } })

        return deleta;
    }
}

module.exports = { Controller_Cliente };