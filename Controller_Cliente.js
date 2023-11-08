const Cliente = require("./models/Cliente");
const FichaAnamnese = require("./models/FichaAnamnese");

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

    static cadastrarFicha(alergia1, fk_cliente) {
        const cad = FichaAnamnese.create({
            alergia1: alergia1,
            fk_cliente: fk_cliente
        })
        return cad;
    }
}

module.exports = { Controller_Cliente };