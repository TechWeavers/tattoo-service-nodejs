const Colaborador = require("./models/Colaborador");

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

    static cadastrarUsuario(usuario, senha, fk_colaborador) {
        Usuario.create({
            usuario: usuario,
            senha: senha,
            fk_colaborador: fk_colaborador
        })
    }
}




module.exports = { Controller_Colaborador_Usuario }