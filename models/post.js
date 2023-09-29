const Colaborador = require("./Colaborador");
const Usuario = require("./Usuario");

Colaborador.create({
    nome: "Administrador",
    cpf: "123",
    telefone: "123",
    email: "adm@adm.com",
    redeSocial: "@admin",
    tipo: "Administrador"
});

Usuario.create({
    fk_colaborador: 1,
    usuario: "admin",
    senha: "123"
});
  