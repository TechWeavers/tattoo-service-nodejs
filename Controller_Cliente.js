const Cliente = require("./models/Cliente");
const FichaAnamnese = require("./models/FichaAnamnese");
const ClienteFicha = require("./models/ClienteFicha");

class Controller_Cliente {
    static visualizarCliente() {
        const view = ClienteFicha.findAll();
        return view;
    }

    static cadastrarCliente(nome, cpf, telefone, email, redeSocial) {
        const create = ClienteFicha.create({
            nome: nome,
            cpf: cpf,
            telefone: telefone,
            email: email,
            redeSocial: redeSocial
        })
        return create;
    }

    static excluirCliente(id_cliente_ficha) {
        const deleta = ClienteFicha.destroy({ where: { 'id_cliente_ficha': id_cliente_ficha } });
        return deleta;
    }

    // procura o cliente especificado para editar os dados
    static procurarCliente(id_cliente_ficha) {
        const procura = ClienteFicha.findAll({ where: { 'id_cliente_ficha': id_cliente_ficha } });
        return procura;
    }

    static atualizarCliente(id_cliente_ficha, nome, cpf, telefone, email, redeSocial) {
        const atualiza = ClienteFicha.update({
            nome: nome,
            cpf: cpf,
            telefone: telefone,
            email: email,
            redeSocial: redeSocial
        }, { where: { 'id_cliente_ficha': id_cliente_ficha } })
        return atualiza;
    }

    static buscarCPF(cpf) {
        const busca = ClienteFicha.findAll({ where: { cpf: cpf } });
        return busca;
    }

    // funções da ficha de anamnese

    static cadastrarFicha(id_cliente_ficha, alergia1, alergia2, medicacao1, medicacao2, doenca1, doenca2) {
        const cadFicha = ClienteFicha.update({
            alergia1: alergia1,
            alergia2: alergia2,
            medicacao1: medicacao1,
            medicacao2: medicacao2,
            doenca1: doenca1,
            doenca2: doenca2
        }, {
            where: { 'id_cliente_ficha': id_cliente_ficha }
        })

        return cadFicha;
    }

    static visualizarFicha(id_cliente_ficha) {
        const view = ClienteFicha.findAll({ where: { 'id_cliente_ficha': id_cliente_ficha } });
        return view;
    }

    static excluirDadosFicha(id_cliente_ficha) {
        const deleta = ClienteFicha.update({
            alergia1: null,
            alergia2: null,
            medicacao1: null,
            medicacao2: null,
            doenca1: null,
            doenca2: null
        }, { where: { 'id_cliente_ficha': id_cliente_ficha } })

        return deleta;
    }
}

module.exports = { Controller_Cliente };