const express = require("express");
const app = express();
const handlebars = require("express-handlebars").engine;
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Colaborador = require("./models/Colaborador");
const Usuario = require("./models/Usuario");


app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")
app.use(express.static('public'));


app.use(bodyParser.urlencoded({extended: "main"}))
app.use(bodyParser.json())

app.get("/", function(req,res){
    res.render("login")
})

app.post("/novo-usuario", async (req, res) => {
    const senha = await bcrypt.hash(req.body.senha, 8);
    console.log(senha);
    Usuario.create({
        usuario: req.body.usuario,            
        senha: senha,
        fk_colaborador: req.body.colaborador
    }).then(function(){
        res.redirect("/")
        console.log("Dados cadastrados com sucesso!")    
    }).catch(function(erro){
        res.send("Erro ao cadastrar " + erro)
    })
})


app.get("/novo-colaborador", function(req,res){
    res.render("novo-colaborador");
})

app.post("/novo-colaborador", function(req, res) {
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

app.listen(8080, function(){
    console.log("Servidor iniciado na porta 8080: http://localhost:8080")
})
