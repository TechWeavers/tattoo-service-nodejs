const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine 
const bodyParser = require("body-parser")
const cliente = require("./models/Cliente")
const usuarioteste = require("./models/UsuarioTeste")


app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")
app.use(express.static('public'));


app.use(bodyParser.urlencoded({extended: "main"}))
app.use(bodyParser.json())

app.get("/", function(req,res){
    res.render("primeira_pagina")
})

app.get("/login", function(req,res){
    res.render("login")
})

app.post("/novo-usuario", function(req, res) {
    usuarioteste.create({
        nome: req.body.nome,            
        email: req.body.email,
        senha: req.body.senha
    }).then(function(){
        res.send("Dados cadastrados com sucesso!")
    }).catch(function(erro){
        res.send("Erro ao cadastrar " + erro)
    })
})

app.post("/cadastrar", function(req, res) {
    cliente.create({
        nome: req.body.nome,
        cpf: req.body.cpf,
        telefone: req.body.telefone,
        email: req.body.email,
        redeSocial: req.body.redeSocial,
        fichaAnamnese: req.body.fichaAnamnese
    }).then(function(){
        res.send("Dados cadastrados com sucesso!")
    }).catch(function(erro){
        res.send("Erro ao cadastrar " + erro)
    })
})

const port = process.env.PORT || 3000


app.listen(port, function(){
    console.log(`SERVIDOR ATIVO ${port}`)
})
