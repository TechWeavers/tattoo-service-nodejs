const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine 
const bodyParser = require("body-parser")
const Colaborador = require("./models/Colaborador")
const Usuario = require("./models/Usuario")


app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")
app.use(express.static('public'));


app.use(bodyParser.urlencoded({extended: "main"}))
app.use(bodyParser.json())

app.get("/", function(req,res){
    res.render("login")
})

app.get("/cadastroColaborador", function(req,res){
    res.render("cadastroColaborador")
})

app.post("/novo-usuario", function(req, res) {
    Usuario.create({
        usuario: req.body.usuario,            
        senha: req.body.senha,
        fk_colaborador: req.body.colaborador
    }).then(function(){
        res.redirect("/")
        console.log("Dados cadastrados com sucesso!")    
    }).catch(function(erro){
        res.send("Erro ao cadastrar " + erro)
    })
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
        res.redirect("/cadastroColaborador")
        console.log("Dados cadastrados com sucesso!")
    }).catch(function(erro){
        res.send("Erro ao cadastrar " + erro)
    })
})

const port = process.env.PORT || 3000


app.listen(port, function(){
    console.log(`SERVIDOR ATIVO ${port}`)
})
