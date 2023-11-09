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

    static excluirCliente(id_cliente) {
        const deleta = ClienteFicha.destroy({ where: { 'id_cliente': id_cliente } });
        return deleta;
    }

    // procura o cliente especificado para editar os dados
    static procurarCliente(id_cliente) {
        const procura = ClienteFicha.findAll({ where: { 'id_cliente': id_cliente } });
        return procura;
    }

    static atualizarCliente(id_cliente, nome, cpf, telefone, email, redeSocial) {
        const atualiza = ClienteFicha.update({
            nome: nome,
            cpf: cpf,
            telefone: telefone,
            email: email,
            redeSocial: redeSocial
        }, { where: { 'id_cliente': id_cliente } })
        return atualiza;
    }

    static cadastrarFicha(alergia1, fk_cliente) {
        const cad = FichaAnamnese.create({
            alergia1: alergia1,
            fk_cliente: fk_cliente
        })
        return cad;
    }
}

module.exports = { Controller_Cliente };