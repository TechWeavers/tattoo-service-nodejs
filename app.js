const express = require("express");
const app = express();
const handlebars = require("express-handlebars").engine;
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { eAdmin } = require('./middlewares/auth')
const Colaborador = require("./models/Colaborador");
const Usuario = require("./models/Usuario");


app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")
app.use(express.static('public'));


app.use(bodyParser.urlencoded({extended: "main"}))
app.use(bodyParser.json())

app.get("/", async (req,res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    const usuarioLogin = req.body.usuarioLogin;
    const senhaLogin = req.body.senhaLogin;
    

    try {
        const usuarioEncontrado = await Usuario.findOne({
            where: { usuario: usuarioLogin },
        });
  
        if (!usuarioEncontrado) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
    
        if (usuarioEncontrado.senha !== senhaLogin) {
            return res.status(401).json({ message: "Senha incorreta" });
        }
    
        res.status(200).json({ message: "Autenticado com sucesso" });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor: " + usuarioLogin + " " + senhaLogin });
    }
  })


app.post("/novo-usuario", async (req, res) => {
    const senha = await bcrypt.hash(req.body.senhaCadastro, 8);
    Usuario.create({
        usuario: req.body.usuarioCadastro,            
        senha: senha,
        fk_colaborador: req.body.colaborador
    }).then(function(){
        res.redirect("/")
        console.log("Dados cadastrados com sucesso!")    
    }).catch(function(erro){
        res.send("Erro ao cadastrar " + erro)
    })
})


app.get("/novo-colaborador", async (req,res) => {
    res.render("novo-colaborador");
})

app.post("/novo-colaborador", async (req, res) => {
    console.log(req.body.tipo)
    Colaborador.create({
        nome: req.body.nome,
        cpf: req.body.cpf,
        telefone: req.body.telefone,
        email: req.body.email,
        redeSocial: req.body.redeSocial
    }).then(function(){
        res.redirect("/novo-colaborador")
        console.log("Dados cadastrados com sucesso!")
    }).catch(function(erro){
        res.send("Erro ao cadastrar " + erro)
    })
})



app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080")
})
