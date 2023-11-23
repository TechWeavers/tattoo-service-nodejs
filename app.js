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
const FichaAnamnese = require("./models/FichaAnamnese");
const hdCompile = require("handlebars")
const fs = require("fs");
const pdf = require("html-pdf-node");
const nodemailer = require("nodemailer");




// configurações handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.use(express.static('public'));

//configurações bodyParser
app.use(bodyParser.urlencoded({ extended: "main" }))
app.use(bodyParser.json())


//importando as classes de controle
const { Controller_Colaborador_Usuario } = require("./Controller_Colaborador_Usuario")
const { Controller_Estoque } = require("./Controller_Estoque");
const { Controller_Cliente } = require("./Controller_Cliente");
const ClienteFicha = require("./models/ClienteFicha");
const { googleCalendar } = require("./googleCalendar/googleCalendar");
const path = require("path");

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
        <script src="https://kit.fontawesome.com/76d409ea62.js" crossorigin="anonymous"></script>
        <style>
            .sidebar {
                display: none;
            }
            .header {
                display: none;
            }
        </style>`,
        title: "Tela de Login"
    });
})

//--------------------------------- rota html pdf-----------------------------------
const template = fs.readFileSync(path.resolve(__dirname, "./views/pdf-html.handlebars"), 'utf8')
const compiledTemplate = hdCompile.compile(template);
const content = compiledTemplate({});
const outputPath = path.resolve(__dirname, './public/saida.html');

app.get("/pdf", async(req, res) => {
    fs.writeFile(outputPath, content, async() => {
        const pdfContent = compiledTemplate({ layout: false });
        const options = { format: 'A4', path: './public/pdf/output.pdf' };
        const file = { content: pdfContent };
        await pdf.generatePdf(file, options);
        console.log("PDF gerado")

    })
    res.render("pdf-html", { layout: false })

});

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
        style: `<link rel="stylesheet" href="/css/estilos3.css">
        <link rel="stylesheet" href="/css/sidebar.css">
        <link rel="stylesheet" href="/css/header.css">
        <link rel="stylesheet" href="../../css/style.css">
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

//--------------------------------------- CRUD de Colaborador -------------------------------

// página que renderiza o formulário de cadastro de um novo colaborador
app.get("/novo-colaborador", eAdmin, async(req, res) => {
    res.render("novo-colaborador", {
        title: "Cadastro de Colaborador",
        style: `<link rel="stylesheet" href="/css/style.css">`,
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
            title: "Listar Colaboradores",
            style: `<link rel="stylesheet" href="/css/style.css">`
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
        res.render("editar-colaborador", {
            colaboradores,
            style: `<link rel="stylesheet" href="/css/estilos3.css">
        <link rel="stylesheet" href="/css/sidebar.css">
        <link rel="stylesheet" href="/css/header.css">
        <link rel="stylesheet" href="../../css/style.css">
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
        })
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

//buscar colaborador pelo CPF
app.post("/buscar-colaborador", async(req, res) => {
    const cpf = req.body.cpf;

    if (!cpf) {
        return res.status(400).send('CPF não encontrado na base de dados ');
    }

    try {
        Controller_Colaborador_Usuario.buscarCPF(cpf).then((colaboradores) => {
            res.render("listar-colaboradores", {
                colaboradores,
                style: `<link rel="stylesheet" href="/css/style.css">`,
            })
        })
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        res.status(500).send('Erro interno do servidor');
    }
})



//------------------------------------ CRUD Usuários --------------------------------------

//renderiza a formulário de cadastro de novos usuários
app.get("/novo-usuario", eAdmin, async(req, res) => {
    res.render("novo-usuario", {
        title: "Cadastro de Usuario",
        style: `<link rel="stylesheet" href="/css/style.css">
        <link rel="stylesheet" href="../../css/fileStyle.css">`,
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
            title: "Listar Usuarios",
            style: `<link rel="stylesheet" href="/css/style.css">`
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
        res.render("editar-usuario", {
            usuarios,
            style: `<link rel="stylesheet" href="/css/estilos3.css">
            <link rel="stylesheet" href="/css/sidebar.css">
            <link rel="stylesheet" href="/css/header.css">
            <link rel="stylesheet" href="../../css/style.css">
            
            <link rel="stylesheet" href="../../css/fileStyle.css">
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
        })
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

// ---------------------------- CRUD ESTOQUE -------------------------------------
//rota de listagem dos materiais disponíveis no estoque
app.get("/listar-estoque", eAdmin, function(req, res) {
    Controller_Estoque.visualizarMaterial().then((materiais) => {
        res.render("listar-estoque", {
            materiais,
            title: "Listagem de estoque",
            style: `<link rel="stylesheet" href="/css/style.css">
            <link rel="stylesheet" href="../../css/fileStyle.css">`,
        })
    })
})

// renderiza o formulário de cadastro do material
app.get("/novo-estoque", eAdmin, function(req, res) {
    res.render("novo-estoque", {
        title: "Cadastrar estoque",
        style: `<link rel="stylesheet" href="/css/style.css">
        <link rel="stylesheet" href="../../css/fileStyle.css">`,
    })
})

// rota interna recebe os dados do formulário de cadastro de materiais, e registra no banco
app.post("/cadastrar-estoque", eAdmin, async(req, res) => {
    console.log(req.body.tipo)
    Controller_Estoque.cadastrarMaterial(
        req.body.nome,
        req.body.quantidade,
        req.body.valor_unidade,
        req.body.data_compra
    );
    res.redirect("/listar-estoque");
    console.log("dados cadastrados com sucesso");

})

// procura o material especificado no botão e renderiza o formulário de edição do mesmo
app.get("/editar-estoque/:id", eAdmin, async(req, res) => {
    Controller_Estoque.procurarMaterial(req.params.id).then(function(materiais) {
        res.render("editar-estoque", {
            materiais,
            style: `<link rel="stylesheet" href="/css/estilos3.css">
            <link rel="stylesheet" href="/css/sidebar.css">
            <link rel="stylesheet" href="/css/header.css">
            <link rel="stylesheet" href="../../css/style.css">
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
            <script src="https://unpkg.com/@vx/select2@^latest/dist/js/select2.js"></script>`,
        })
    }).catch(function(erro) {
        console.log("erro ao carregar os dados: " + erro)
    })
})

app.get("/consumir-estoque/:id", eAdmin, async(req, res) => {
    Controller_Estoque.procurarMaterial(req.params.id).then(function(materiais) {
        res.render("consumir-estoque", {
            materiais,
            style: `<link rel="stylesheet" href="/css/estilos3.css">
            <link rel="stylesheet" href="/css/sidebar.css">
            <link rel="stylesheet" href="/css/header.css">
            <link rel="stylesheet" href="../../css/style.css">
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
            <script src="https://unpkg.com/@vx/select2@^latest/dist/js/select2.js"></script>`,
        })
    }).catch(function(erro) {
        console.log("erro ao carregar os dados: " + erro)
    })
})

app.post("/atualizar-estoque", eAdmin, async(req, res) => {
    Controller_Estoque.atualizarMaterial(
        req.body.id_material,
        req.body.nome,
        req.body.quantidade,
        req.body.valor_unidade,
        req.body.data_compra).then(function() {
        res.redirect("/listar-estoque")
    })
})

app.post("/consumir-estoque", eAdmin, async(req, res) => {
    const dataAtual = new Date();
    console.log(dataAtual);
    Controller_Estoque.diminuirQuantidade(
        req.body.id_material,
        req.body.id_colaborador,
        req.body.quantidade,
        dataAtual
    ).then(function() {
        res.redirect("/listar-estoque")
    })
})

/*app.get("/excluir-estoque/:id", eAdmin, async(req, res) => {
    Controller_Estoque.excluirMaterial(req.params.id).then(function() {
        res.redirect("/listar-estoque")
    }).catch(function(erro) {
        res.send("Erro ao deletar os dados: " + erro)
    })
})*/

// ------------------------------------ CRUD Cliente -------------------------------------------

//visualização de clientes cadastrados
app.get("/listar-cliente", function(req, res) {
    Controller_Cliente.visualizarCliente().then((clientes) => {
        res.render("listar-cliente", {
            clientes,
            title: "Listar cliente",
            style: `<link rel="stylesheet" href="/css/style.css">`,
        })
    }).catch((erro) => {
        res.send("Erro ao carregar os dados. Volte a página anterior! <br> Erro: " + erro)
    })
})

// renderiza o formulário de cadastro de clientes
app.get("/novo-cliente", function(req, res) {
    res.render("novo-cliente", {
        title: "Novo cliente",
        style: `<link rel="stylesheet" href="/css/style.css">`,
    })
})

//rota interna de cadastro de clientes
app.post("/cadastrar-cliente", async(req, res) => {
    Controller_Cliente.cadastrarCliente(
        req.body.nome,
        req.body.cpf,
        req.body.telefone,
        req.body.email,
        req.body.redeSocial
    ).then(() => {
        res.redirect("/listar-cliente");
        console.log("dados cadastrados com sucesso")
    })
})

// rota de exclusão do cliente
app.get("/excluir-cliente/:id", async(req, res) => {
    Controller_Cliente.excluirCliente(req.params.id).then(() => {
        res.redirect("/listar-cliente")
        console.log("dados excluídos com sucesso")
    }).catch((erro) => {
        re.send("Erro ao excluir os dados: " + erro)
    })
})

// procura o cliente esepcificado ao apertar o botão de editar, e renderiza o formulário com os dados dele para editá-lo
app.get("/editar-cliente/:id", async(req, res) => {
    Controller_Cliente.procurarCliente(req.params.id).then((cliente) => {
        res.render("editar-cliente", {
            cliente,
            title: "Editar cliente",
            style: `<link rel="stylesheet" href="/css/estilos3.css">
                    <link rel="stylesheet" href="/css/sidebar.css">
                    <link rel="stylesheet" href="/css/header.css">
                    <link rel="stylesheet" href="../../css/style.css">
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
                    <script src="https://unpkg.com/@vx/select2@^latest/dist/js/select2.js"></script>`,
        })
    })
})

// rota de atualização dos dados
app.post("/atualizar-cliente", async(req, res) => {
    Controller_Cliente.atualizarCliente(
        req.body.id_cliente,
        req.body.nome,
        req.body.cpf,
        req.body.telefone,
        req.body.email,
        req.body.redeSocial
    ).then(() => {
        res.redirect("/listar-cliente");
        console.log("Dados atualizados com sucesso")
    }).catch((erro) => {
        res.render("refresh")
    })
})

// funcionalidade de busca por CPF
app.post("/buscar-cliente", async(req, res) => {
    const cpf = req.body.cpf;

    if (!cpf) {
        return res.status(400).send('CPF não encontrado na base de dados ');
    }

    try {
        Controller_Cliente.buscarCPF(cpf).then((clientes) => {
            res.render("listar-cliente", {
                clientes,
                style: `<link rel="stylesheet" href="/css/style.css">`,
            })
        })
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        res.status(500).send('Erro interno do servidor');
    }
})




//--------------------------  CRUD da Ficha de Anamnese que pertence a um único cliente -------

// esta rota é acessada através de um botão editar ficha, na página de listar clientes, ela renderiza os dados de uma ficha pertencente a um cliente
app.get("/listar-ficha/:id", async(req, res) => {
    Controller_Cliente.visualizarFicha(req.params.id).then((cliente) => {
        res.render("listar-ficha", {
            cliente,
            style: `<link rel="stylesheet" href="/css/style.css">`,
        })
    }).catch((erro) => {
        res.send("erro ao carregar os dados. Volte para a página anterior. <br> Erro: " + erro)
    })
})

//esta rota renderiza o formulário de cadastro dos dados da ficha, que também é o mesmo de edição
app.get("/nova-ficha/:id", async(req, res) => {
    Controller_Cliente.visualizarFicha(req.params.id).then((cliente) => {
        res.render("nova-ficha", {
            cliente,
            style: `<link rel="stylesheet" href="/css/style.css">`,
        })
    }).catch(() => {
        res.render("refresh")
    })
})

// rota interna que atualiza o cliente, com os dados da ficha
app.post("/cadastrar-ficha", async(req, res) => {
    Controller_Cliente.cadastrarFicha(
        req.body.id_cliente_ficha,
        req.body.alergia1,
        req.body.alergia2,
        req.body.medicacao1,
        req.body.medicacao2,
        req.body.doenca1,
        req.body.doenca2
    ).then(() => {
        res.redirect("listar-cliente")
    }).catch((erro) => {
        res.send("erro ao carregar os dados. Volte para a página anterior. <br> Erro: " + erro)
    })
})

app.get("/excluir-dados-ficha/:id", async(req, res) => {
    Controller_Cliente.excluirDadosFicha(req.params.id).then(() => {
        res.redirect("/listar-cliente")
    }).catch((erro) => {
        res.send("Houve um erro. Volte a página anterior.<br> Erro: " + erro)
    })
})



//------------------------------------ Google agenda --------------------------------------

// renderiza a agenda com todos os agendamentos até agora
app.get("/agenda", async(req, res) => {
    res.render("agenda", {
        style: `<link rel="stylesheet" href="/css/style.css">`
    })
})

// renderiza formulário de captação dos dados para agendamento
app.get("/novo-agendamento", async(req, res) => {
    res.render("novo-evento", {
        style: `<link rel="stylesheet" href="/css/style.css">`
    })
})

// rota interna que chama a API e insere um procedimento na agenda

app.post("/criarAgendamento", async(req, res) => {
    googleCalendar.createEvent(
        req.body.nome_evento,
        req.body.local_evento,
        req.body.descricao_evento,
        req.body.data_evento,
        req.body.hora_inicio,
        req.body.hora_termino,
        req.body.id_cliente,

    ).then(() => {
        res.redirect("/agenda")
    }).catch((error) => {
        console.log("Dados incorretos ou não encontrados ao cadastrar agendamento <br> Retorne a página anterior!" + error)
        res.send("Dados incorretos ou não encontrados ao cadastrar agendamento <br> Retorne a página anterior!" + error)
    })
})

// teste Enviar email pro cliente
app.get("/email", async(req, res) => {
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "sixdevsfatec@gmail.com",
            pass: "bdsx clop ykqi thaw"
        }
    })

    transport.sendMail({
        from: "sixdevsfatec@gmail.com",
        to: "jplima.dev@outlook.com",
        subject: "Enviando email com Nodemailer",
        html: "<h1> Olá João Pedro!</h1> <p> Este email foi enviado usando o NodeMailer</p>",
        text: "Este email foi enviado usando o NodeMailer"
    }).then(() => {
        console.log("email enviado com sucesso!")
    }).catch((error) => {
        console.log("falha ao enviar email")
    })


})

// deletando agendamentos

app.get("/error", async(req, res) => {
    res.render("refresh.handlebars", {
        style: `<link rel="stylesheet" href="/css/">`
    })
})

app.use(function(req, res, next) {
    res.render("refresh.handlebars")
});




//porta principal
app.listen(8083, () => {
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
//}).catch(function(erro) {
// res.send("Erro ao cadastrar " + erro)
//})es.send("Erro ao cadastrar " + erro)
//})