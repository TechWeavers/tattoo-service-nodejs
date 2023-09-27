const express = require("express");
const app = express();
const handlebars = require("express-handlebars").engine;
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const tokenModule = require('./modules/token');
const { eAdmin } = require('./middlewares/auth')
const Colaborador = require("./models/Colaborador");
const Usuario = require("./models/Usuario");

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")
app.use(express.static('public'));


app.use(bodyParser.urlencoded({extended: "main"}))
app.use(bodyParser.json())

app.get("/", async (req,res) => {
    res.render("login", {
        style: `<link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/css/form.css">
        <link rel="stylesheet" href="/css/login-container.css">
        <link rel="stylesheet" href="/css/overlay.css">
        <link rel="stylesheet" href="/css/reset.css">
        <script src="/js/login.js" defer></script>
        <script src="https://kit.fontawesome.com/76d409ea62.js" crossorigin="anonymous"></script>`,
        title: "Tela de Login"
    });
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
    
        if (!(await bcrypt.compare(senhaLogin, usuarioEncontrado.senha))) {
            return res.status(401).json({ message: "Senha incorreta" });
        }
    
        let token = jwt.sign({id: usuarioEncontrado.id}, "J98JDASD908ML0G9ZV8ML1PI3I89S7D6F", {
            //expiresIn: 600 //10MIN
            expiresIn: "7d"
        })

        tokenModule.setToken(token);

        res.status(200).json({ message: "Autenticado com sucesso", token: token });

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


app.get("/novo-colaborador", eAdmin, async (req,res) => {
    res.render("novo-colaborador", {        
        title: "Cadastro de Colaborador"
    });
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
