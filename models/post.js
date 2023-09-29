const Colaborador = require("./Colaborador");
const Usuario = require("./Usuario");
const bcrypt = require('bcrypt');

Colaborador.create({
    nome: "Administrador",
    cpf: "123",
    telefone: "123",
    email: "adm@adm.com",
    redeSocial: "@admin",
    tipo: "Administrador"
});

async function criptografa(senha){
    const senhaCript = await bcrypt.hash(senha, 8);
    return senhaCript;
}

async function criarUsuario() {
    const senha = await criptografa("123");

    Usuario.create({
        fk_colaborador: 1,
        usuario: "admin",
        senha: senha
    });
}

criarUsuario();
  