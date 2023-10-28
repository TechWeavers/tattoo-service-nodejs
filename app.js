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

// configurações handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.use(express.static('public'));

//configurações bodyParser
app.use(bodyParser.urlencoded({ extended: "main" }))
app.use(bodyParser.json())

//importando as classes de controle

//classe de controle do colaborador
const { Controller_Colaborador_Usuario } = require("./Controller_Colaborador_Usuario")

// Página que renderiza a tela de login (handlebars)
app.get("/", async(req, res) => {
    res.render("login", {
        style: `<link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/css/form.css">
        <link rel="stylesheet" href="/css/login-container.css">
        <link rel="stylesheet" href="/css/overlay.css">
        <link rel="stylesheet" href="/css/reset.css">
        <link rel="stylesheet" href="/css/estilo3.css">
        <script src="/js/login.js" defer></script>
        <script src="https://kit.fontawesome.com/76d409ea62.js" crossorigin="anonymous"></script>`,
        title: "Tela de Login"
    });
})

//rota interna de validação do login
app.post("/login", async(req, res) => {
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

        let token = jwt.sign({ id: usuarioEncontrado.id }, "J98JDASD908ML0G9ZV8ML1PI3I89S7D6F", {
            //expiresIn: 600 //10MIN
            expiresIn: "7d"
        })

        tokenModule.setToken(token);

        res.redirect("/dashboard");

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor: " + usuarioLogin + " " + senhaLogin });
    }
})

// Tela principal do site, com todas as funcionalidades do sistema
app.get("/dashboard", eAdmin, async(req, res) => {
    res.render("dashboard", {
        title: "Dashboard",
        style: `<link rel="stylesheet" href="/css/sidebar.css">`
    });
})

// criar um novo login para usuários do sistema
app.post("/novo-usuario-login", eAdmin, async(req, res) => {
    const senhaCriptLogin = await bcrypt.hash(req.body.senhaCadastro, 8);
    Usuario.create({
        usuario: req.body.usuarioCadastro,
        senha: senhaCriptLogin,
        fk_colaborador: req.body.colaborador
    }).then(function() {
        res.redirect("/")
        console.log("Dados cadastrados com sucesso!")
    }).catch(function(erro) {
        res.send("Erro ao cadastrar " + erro)
    })
})

// página que renderiza o formulário de cadastro de um novo colaborador
app.get("/novo-colaborador", eAdmin, async(req, res) => {
    res.render("novo-colaborador", {
        title: "Cadastro de Colaborador",
        style: `<link rel="stylesheet" href="../../css/style.css">
        <link rel="stylesheet" href="https://unpkg.com/mdi@latest/css/materialdesignicons.min.css">
        <link rel="stylesheet" href="https://unpkg.com/feather-icons@latest/dist/feather.css">
        <link rel="stylesheet" href="https://unpkg.com/vendors-base@latest/vendor.bundle.base.css">
        <link rel="stylesheet" href="https://unpkg.com/select2@latest/dist/css/select2.min.css">
        <link rel="stylesheet" href="https://unpkg.com/select2@latest/dist/css/select2-bootstrap.min.css">`,
        script: `<script src="https://unpkg.com/vendors-base@latest/vendor.bundle.base.js"></script>
        <script src="https://unpkg.com/@vx/off-canvas@^latest/dist/off-canvas.js"></script>
        <script src="https://unpkg.com/@vx/hoverable-collapse@^latest/dist/hoverable-collapse.js"></script>
        <script src="https://unpkg.com/@vx/template@^latest/dist/template.js"></script>
        <script src="https://unpkg.com/typeahead.js@latest/dist/typeahead.bundle.min.js"></script>
        <script src="https://unpkg.com/select2@latest/dist/js/select2.min.js"></script>
        <script src="https://unpkg.com/@vx/file-upload@^latest/dist/file-upload.js"></script>
        <script src="https://unpkg.com/@vx/typeahead@^latest/dist/typeahead.js"></script>
        <script src="https://unpkg.com/@vx/select2@^latest/dist/js/select2.js"></script>`
    });
})

// rota interna recebe os dados do formulário de cadastro de colaboradores, e registra no banco
app.post("/cadastrar-colaborador", eAdmin, async(req, res) => {
    console.log(req.body.tipo)
    Controller_Colaborador_Usuario.cadastrarColaborador(
        req.body.nome,
        req.body.cpf,
        req.body.telefone,
        req.body.email,
        req.body.redeSocial,
        req.body.tipo
    );
    res.redirect("/listar-colaboradores");
    console.log("dados cadastrados com sucesso");

})

//visualização de todos os colaboradores cadastrados
app.get("/listar-colaboradores", eAdmin, async(req, res) => {
    //const viewDados = Controller_Colaborador_Usuario.visualizarColaboradores;
    Controller_Colaborador_Usuario.visualizarColaboradores().then((colaboradores) => {
        res.render("listar-colaboradores", {
            colaboradores,
            title: "Listar Colaboradores"
        })
    }).catch(function(erro) {
        console.log("Erro ao carregar os dados " + erro)
    })
})

// exclusão do colaborador selecionado, através de um botão de delete
app.get("/excluir-colaborador/:id", eAdmin, function(req, res) {
    Controller_Colaborador_Usuario.excluirColaborador(req.params.id).then(function() {
        res.redirect("/listar-colaboradores")
    }).catch(function(erro) {
        console.log("Erro ao carregar os dados " + erro)
    })
})

//rota externa que renderiza um formulário de edição do colaborador, que foi selecionado pelo botão de editar, na página de visualização, trazendo os dados do colaborador selecionado
app.get("/editar-colaborador/:id", eAdmin, function(req, res) {
    Controller_Colaborador_Usuario.procurarColaborador(req.params.id).then(function(colaboradores) {
        res.render("editar-colaborador", { colaboradores })
    }).catch(function(erro) {
        console.log("Erro ao carregar os dados " + erro)
    })
})

//rota interna que atualiza os dados do colaborador, vindo do formulário de atualização dos dados
app.post("/atualizar-colaborador", eAdmin, function(req, res) {
    Controller_Colaborador_Usuario.atualizarColaborador(
        req.body.id_colaborador,
        req.body.nome,
        req.body.cpf,
        req.body.telefone,
        req.body.email,
        req.body.redeSocial,
        req.body.tipo).then(function() {
        res.redirect("/listar-colaboradores")
    })
})

//renderiza a formulário de cadastro de novos usuários
app.get("/novo-usuario", eAdmin, async(req, res) => {
    res.render("novo-usuario", {
        title: "Cadastro de Usuario"
    });
})

// rota interna para criar um novo login para usuários do sistema, recebendo os dados do formulário de cadastro de usuários
app.post("/novo-usuario", async(req, res) => {
    const senhaCript = await bcrypt.hash(req.body.senha, 8);
    Controller_Colaborador_Usuario.cadastrarUsuario(
        req.body.usuario,
        senhaCript,
        req.body.fk_colaborador);

    res.redirect("/listar-usuarios")
    console.log("Dados cadastrados com sucesso!")
})

//página de visualização de todos os usuários cadastrados no sistema
app.get("/listar-usuarios", eAdmin, async(req, res) => {
    Controller_Colaborador_Usuario.visualizarUsuarios().then((usuarios) => {
        res.render("listar-usuarios", {
            usuarios,
            title: "Listar Usuarios"
        })
    }).catch(function(erro) {
        console.log("Erro ao carregar os dados " + erro)
    })
})

//exclusão do colaborador selecionado, através de um botão de delete, na página de edição dos usuários
app.get("/excluir-usuario/:id", function(req, res) {
    Controller_Colaborador_Usuario.excluirUsuario(req.params.id).then(function() {
        res.redirect("/listar-usuarios")
    }).catch(function(erro) {
        console.log("Erro ao carregar os dados " + erro)
    })
})

//rota externa que renderiza um formulário de edição do colaborador, que foi selecionado pelo botão de editar, na página de visualização, trazendo os dados do colaborador selecionado
app.get("/editar-usuario/:id", eAdmin, function(req, res) {
    Controller_Colaborador_Usuario.procurarUsuario(req.params.id).then(function(usuarios) {
        res.render("editar-usuario", { usuarios })
    }).catch(function(erro) {
        console.log("Erro ao carregar os dados " + erro)
    })
})

//rota interna que atualiza os dados de cada usuário, recebendo os dados do formulário de edição de usuários
app.post("/atualizar-usuario", eAdmin, function(req, res) {
    Controller_Colaborador_Usuario.atualizarUsuario(
        req.body.id_usuario,
        req.body.usuario,
        req.body.senha).then(function() {
        res.redirect("/listar-usuarios")
    })
})

app.listen(8081, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080")
})

//Colaborador.create({
// nome: req.body.nome,
//cpf: req.body.cpf,
//telefone: req.body.telefone,
//email: req.body.email,
//redeSocial: req.body.redeSocial,
//tipo: req.body.tipo
//}).then(function() {
//res.redirect("/listar-colaboradores")
//console.log("Dados cadastrados com sucesso!")
//}).catch(function(erro) {
// res.send("Erro ao cadastrar " + erro)
//})
