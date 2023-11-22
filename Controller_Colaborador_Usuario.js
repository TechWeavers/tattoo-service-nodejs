const Colaborador = require("./models/Colaborador");
const Usuario = require("./models/Usuario");

// classe de controle que utiliza a própria entidade no banco de dados, possui funções estáticas  que devem ser implementadas nas rotas do arquivo app.js, a fim de se responsabilizar pela logica de execução das entidades de colaborador e usuário

class Controller_Colaborador_Usuario {
    static cadastrarColaborador(nome, cpf, telefone, email, redeSocial, tipo) {
        Colaborador.create({
            nome: nome,
            cpf: cpf,
            telefone: telefone,
            email: email,
            redeSocial: redeSocial,
            tipo: tipo
        })
    }

    static visualizarColaboradores() {
        const view = Colaborador.findAll();
        return view;
    }

    static excluirColaborador(id_colaborador) {
        const deleta = Colaborador.destroy({ where: { 'id_colaborador': id_colaborador } })
        return deleta;
    }

    static procurarColaborador(id_colaborador) {
        const procura = Colaborador.findAll({ where: { 'id_colaborador': id_colaborador } })
        return procura;
    }

    static atualizarColaborador(idColaborador, nome, cpf, telefone, email, redeSocial, tipo) {
        const atualiza = Colaborador.update({
            nome: nome,
            cpf: cpf,
            telefone: telefone,
            email: email,
            redeSocial: redeSocial,
            tipo: tipo
        }, {
            where: {
                id_colaborador: idColaborador
            }
        })
        return atualiza;
    }

    static buscarCPF(cpf) {
        const busca = Colaborador.findAll({ where: { cpf: cpf } });
        return busca;
    }


    static cadastrarUsuario(usuario, senha, fk_colaborador) {
        Usuario.create({
            usuario: usuario,
            senha: senha,
            fk_colaborador: fk_colaborador
        })
    }

    static visualizarUsuarios() {
        const viewUsuarios = Usuario.findAll();
        return viewUsuarios;
    }

    static excluirUsuario(id_usuario) {
        const deleta = Usuario.destroy({ where: { 'id_usuario': id_usuario } });
        return deleta;
    }

    static procurarUsuario(id_usuario) {
        const procura = Usuario.findAll({ where: { 'id_usuario': id_usuario } })
        return procura;
    }

    static atualizarUsuario(id_usuario, usuario, senha) {
        const atualiza = Usuario.update({
            usuario: usuario,
            senha: senha,
        }, {
            where: {
                id_usuario: id_usuario
            }
        })
        return atualiza;
    }
}




module.exports = { Controller_Colaborador_Usuario }