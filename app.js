const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine 
const bodyParser = require("body-parser")
const cliente = require("./models/Cliente")
const usuarioteste = require("./models/UsuarioTeste")


app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: "main"}))
app.use(bodyParser.json())

app.get("/", function(req,res){
    res.render("primeira_pagina")
})

app.get("/login", function(req,res){
    res.render("login", {customstyle: `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./public/css/form.css">
    <link rel="stylesheet" href="./public/css/login-container.css">
    <link rel="stylesheet" href="./public/css/overlay.css">
    <link rel="stylesheet" href="./public/css/reset.css">`, 
    customscript: `<script src="https://kit.fontawesome.com/76d409ea62.js" crossorigin="anonymous"></script>
    <script src="./js/login.js" defer></script>`})
})

app.post("/novo-usuario", function(req, res) {
    usuarioteste.UsuarioTeste.create({
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
    cliente.Cliente.create({
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
