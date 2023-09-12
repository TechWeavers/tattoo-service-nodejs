const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine 
const bodyParser = require("body-parser")
const post = require("./models/post")

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: "main"}))
app.use(bodyParser.json())

app.get("/", function(req,res){
    res.render("primeira_pagina")
})

app.post("/cadastrar", function(req, res) {
    post.Cliente.create({
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

app.listen(3306, function(){
    console.log("SERVIDOR ATIVO")
})
