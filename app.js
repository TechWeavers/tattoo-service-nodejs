const express = require("express");
const app = express();
const handlebars = require("express-handlebars").engine;
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const tokenModule = require('./modules/token');
const { eTatuador, eAdmin } = require('./middlewares/auth')
const Usuario = require("./models/Usuario");
const Evento = require("./models/Evento");
const copiaEventos = require("./models/copiaEventos")
const nodemailer = require("./Nodemailer")
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const Colaborador = require("./models/Colaborador")

//identificar que esta usando o sistema
let colaboradorEncontrado
let usuarioEncontrado

// variaveis que servirao de controle da dashboard
const { Dashboard } = require("./Controller_Dashboard");
let agendamentos = 0;
let clientes = 0;




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
const { googleCalendar } = require("./googleCalendar/googleCalendar");
const { Controller_Agendamento } = require("./Controller_Agendamento")
const path = require("path");
const Cliente = require("./models/Cliente");
const Material = require("./models/Material");
const { col } = require("sequelize");


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

// Rota para gerar o PDF
app.get("/pdf/:id", async(req, res) => {
    let responseSent = false;

    try {
        // Busca informações do cliente e da ficha
        const [cliente, ficha] = await Promise.all([
            Controller_Cliente.procurarCliente(req.params.id),
            Controller_Cliente.procurarFicha(req.params.id)
        ]);

        // Renderiza a view em HTML
        const html = await new Promise((resolve, reject) => {
            res.render("pdf-html", { cliente, ficha, layout: false }, (err, html) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(html);
                }
            });
        });

        // Configurações do Puppeteer
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setContent(html);

        // Gera o PDF
        const pdfBuffer = await page.pdf({ format: "A4" });

        await browser.close();

        // Envia o PDF como resposta, garantindo que seja enviado apenas uma vez
        if (!responseSent) {
            responseSent = true;
            res.contentType("application/pdf");
            res.send(pdfBuffer);
            console.log("PDF GERADO");
        }
    } catch (error) {
        // Verifica se a resposta já foi enviada para evitar headers duplicados
        if (!responseSent) {
            console.error("Erro ao gerar o PDF:", error);
            res.redirect("/erro");
            responseSent = true;
        }
    }
});


//rota interna de validação do login
app.post("/login", async(req, res) => {
    const usuarioLogin = req.body.usuarioLogin;
    const senhaLogin = req.body.senhaLogin;

    try {
        usuarioEncontrado = await Usuario.findOne({
            where: { usuario: usuarioLogin },
        });

        colaboradorEncontrado = await Colaborador.findOne({
            where: {id_colaborador: usuarioEncontrado.dataValues.fk_colaborador}
        });

        if (!usuarioEncontrado) {
            res.redirect("/login-error");
            return
        }

        if (!(await bcrypt.compare(senhaLogin, usuarioEncontrado.senha))) {
            res.redirect("/login-error");
            return
        }

        let token = jwt.sign({ id: usuarioEncontrado.id }, "J98JDASD908ML0G9ZV8ML1PI3I89S7D6F", {
            //expiresIn: 600 //10MIN
            expiresIn: "7d"
        })

        tokenModule.setToken(token);
        tokenModule.setTipo(colaboradorEncontrado.dataValues.tipo)

        res.redirect("/dashboard");

    } catch (error) {
        res.redirect("/login-error");
    }
})

//Logout 
app.get("/logout", (req, res) => {
    // Remova o token
    tokenModule.removeToken();
    tokenModule.removeTipo();
    // Redirecione para a rota raiz da aplicação
    res.redirect("/");
});

// Tela principal do site, com todas as funcionalidades do sistema
app.get("/dashboard", eTatuador, async(req, res) => {
    // fazer aqui a funcionalidade de retornar todos os metodos da dashboard
    const promiseProximosProcedimentos = Dashboard.próximosProcedimentos();
    const promiseQuantidadeClientes = Dashboard.quantClientes();
    const promiseMateriaisConsumidos = Dashboard.visualizarMaterialConsumido();
    const promiseMateriaisfaltantes = Dashboard.materiaisFaltantes()
    Promise.all([promiseProximosProcedimentos, promiseMateriaisConsumidos, promiseMateriaisfaltantes]).then(([eventos, materiaisConsumidos, materiaisFaltantes]) => {

        res.render("dashboard", {
            eventos,
            materiaisConsumidos,
            materiaisFaltantes,

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
            <script src="https://unpkg.com/@vx/select2@^latest/dist/js/select2.js"></script>`,
            usuarioLogin: usuarioEncontrado.usuario,
            tipo: colaboradorEncontrado.tipo
        });

    })

})

// atualiza o status dos procedimentos do dia anterior para realizado, envia o email de 24 horas pós agendamento, e convite para retorno no estúdio 15 dias após o agendamento
//esta funcionalidade é executada 1 vez por dia, todos os dias.
cron.schedule('0 11 * * *', () => {
    Controller_Agendamento.posAgendamento24Horas();
    Controller_Agendamento.posAgendamento15Dias();
});

// criar um novo login para usuários do sistema
app.post("/novo-usuario-login", eTatuador, async(req, res) => {
    try {
        
        const senhaCriptLogin = await bcrypt.hash(req.body.senhaCadastro, 8);
        Usuario.create({
            usuario: req.body.usuarioCadastro,
            senha: senhaCriptLogin,
            fk_colaborador: req.body.colaborador
        }).then(function() {
            res.redirect("/")
            console.log("Dados cadastrados com sucesso!")
        }).catch(function(erro) {
            res.redirect("/erro")
            console.log("Erro ao cadastrar " + erro)
        })
        
    } catch (error) {
        res.redirect("/erro");
    }
})

//--------------------------------------- CRUD de Colaborador -------------------------------

// página que renderiza o formulário de cadastro de um novo colaborador
app.get("/novo-colaborador", eAdmin, async(req, res) => {
    res.render("novo-colaborador", {
        title: "Cadastro de Colaborador",
        style: `<link rel="stylesheet" href="/css/style.css">`,
        usuarioLogin: usuarioEncontrado.usuario,
        tipo: colaboradorEncontrado.tipo
    });
})

// rota interna recebe os dados do formulário de cadastro de colaboradores, e registra no banco
app.post("/cadastrar-colaborador", eAdmin, async(req, res) => {
    try {
        
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
        
    } catch (error) {
        res.redirect("/erro");
    }

})

//visualização de todos os colaboradores cadastrados
app.get("/listar-colaboradores", eTatuador, async(req, res) => {
    //const viewDados = Controller_Colaborador_Usuario.visualizarColaboradores;
    Controller_Colaborador_Usuario.visualizarColaboradores().then((colaboradores) => {
        res.render("listar-colaboradores", {
            colaboradores,
            title: "Listar Colaboradores",
            style: `<link rel="stylesheet" href="/css/style.css">`,
            usuarioLogin: usuarioEncontrado.usuario,
            tipo: colaboradorEncontrado.tipo
        })
    }).catch(function(erro) {
        res.redirect("/erro")
        console.log("Erro ao carregar os dados " + erro)
    })
})

// exclusão do colaborador selecionado, através de um botão de delete
app.get("/excluir-colaborador/:id", eAdmin, function(req, res) {
    Controller_Colaborador_Usuario.excluirColaborador(req.params.id).then(function() {
        res.redirect("/listar-colaboradores")
    }).catch(function(erro) {
        res.redirect("/erro")
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
        <script src="https://unpkg.com/@vx/select2@^latest/dist/js/select2.js"></script>`,
        usuarioLogin: usuarioEncontrado.usuario,
        tipo: colaboradorEncontrado.tipo
        })
    }).catch(function(erro) {
        res.redirect("/erro")
        console.log("Erro ao carregar os dados " + erro)
    })
})

//rota interna que atualiza os dados do colaborador, vindo do formulário de atualização dos dados
app.post("/atualizar-colaborador", eAdmin, function(req, res) {
    try {
        
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
        
    } catch (error) {
        res.redirect("/erro");
    }
})

//buscar colaborador pelo CPF
app.post("/buscar-colaborador", eTatuador, async(req, res) => {
    const cpf = req.body.cpf;

    if (!cpf) {
        return res.status(400).send('CPF não encontrado na base de dados ');
    }

    try {
        Controller_Colaborador_Usuario.buscarCPF(cpf).then((colaboradores) => {
            res.render("listar-colaboradores", {
                colaboradores,
                style: `<link rel="stylesheet" href="/css/style.css">`,
                usuarioLogin: usuarioEncontrado.usuario,
                tipo: colaboradorEncontrado.tipo
            })
        })
    } catch (error) {
        res.redirect("/erro")
        console.error('Erro ao consultar o banco de dados:', error);
        res.status(500).send('Erro interno do servidor');
    }
})



//------------------------------------ CRUD Usuários --------------------------------------

//renderiza a formulário de cadastro de novos usuários
app.get("/novo-usuario", eAdmin, async(req, res) => {
    try {
        res.render("novo-usuario", {
            title: "Cadastro de Usuario",
            style: `<link rel="stylesheet" href="/css/style.css">`,
            usuarioLogin: usuarioEncontrado.usuario,
            tipo: colaboradorEncontrado.tipo
        })
        
    } catch (error) {
        res.redirect("/erro");
    }
})



// rota interna para criar um novo login para usuários do sistema, recebendo os dados do formulário de cadastro de usuários
app.post("/novo-usuario", eTatuador, async(req, res) => {
    try {
        
        const senhaCript = await bcrypt.hash(req.body.senha, 8);
        Controller_Colaborador_Usuario.cadastrarUsuario(
            req.body.usuario,
            senhaCript,
            req.body.fk_colaborador);
    
        res.redirect("/listar-usuarios")
        console.log("Dados cadastrados com sucesso!")
        
    } catch (error) {
        res.redirect("/erro");
    }
})

//página de visualização de todos os usuários cadastrados no sistema
app.get("/listar-usuarios", eTatuador, async(req, res) => {
    Controller_Colaborador_Usuario.visualizarUsuarios().then((usuarios) => {
        res.render("listar-usuarios", {
            usuarios,
            title: "Listar Usuarios",
            style: `<link rel="stylesheet" href="/css/style.css">`,
            usuarioLogin: usuarioEncontrado.usuario,
            tipo: colaboradorEncontrado.tipo
        })
    }).catch(function(erro) {
        res.redirect("/erro")
        console.log("Erro ao carregar os dados " + erro)
    })
})


//exclusão do colaborador selecionado, através de um botão de delete, na página de edição dos usuários
app.get("/excluir-usuario/:id", eAdmin, function(req, res) {
    Controller_Colaborador_Usuario.excluirUsuario(req.params.id).then(function() {
        res.redirect("/listar-usuarios")
    }).catch(function(erro) {
        res.redirect("/erro")
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
            <link rel="stylesheet" href="/css/style.css">
            
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
            <script src="https://unpkg.com/@vx/select2@^latest/dist/js/select2.js"></script>`,
            usuarioLogin: usuarioEncontrado.usuario,
            tipo: colaboradorEncontrado.tipo
        })
    }).catch(function(erro) {
        res.redirect("/erro")
        console.log("Erro ao carregar os dados " + erro)
    })
})

//rota interna que atualiza os dados de cada usuário, recebendo os dados do formulário de edição de usuários
app.post("/atualizar-usuario", eAdmin, async (req, res) => {
    try {
        const senhaCript = await bcrypt.hash(req.body.senha, 8);
        Controller_Colaborador_Usuario.atualizarUsuario(
            req.body.id_usuario,
            req.body.usuario,
            senhaCript).then(function() {
            res.redirect("/listar-usuarios")
        })
        
    } catch (error) {
        res.redirect("/erro");
    }
    
})

// ---------------------------- CRUD ESTOQUE -------------------------------------
//rota de listagem dos materiais disponíveis no estoque
app.get("/listar-estoque", eTatuador, function(req, res) {
    Controller_Estoque.visualizarMaterial().then((materiais) => {
        res.render("listar-estoque", {
            materiais,
            title: "Listagem de estoque",
            style: `<link rel="stylesheet" href="/css/style.css">
            <link rel="stylesheet" href="../../css/fileStyle.css">`,
            usuarioLogin: usuarioEncontrado.usuario,
            tipo: colaboradorEncontrado.tipo
        })
    })
})

// renderiza o formulário de cadastro do material
app.get("/novo-estoque", eAdmin, function(req, res) {
    res.render("novo-estoque", {
        title: "Cadastrar estoque",
        style: `<link rel="stylesheet" href="/css/style.css">
        <link rel="stylesheet" href="../../css/fileStyle.css">`,
        usuarioLogin: usuarioEncontrado.usuario,
        tipo: colaboradorEncontrado.tipo
    })
})

// rota interna recebe os dados do formulário de cadastro de materiais, e registra no banco
app.post("/cadastrar-estoque", eAdmin, async(req, res) => {

    try {
        Controller_Estoque.cadastrarMaterial(
            req.body.nome,
            req.body.quantidade,
            req.body.valor_unidade,
            req.body.data_compra
        );
        res.redirect("/listar-estoque");
        console.log("dados cadastrados com sucesso");
    } catch (error) {
        res.redirect("/erro");
    }

   

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
            usuarioLogin: usuarioEncontrado.usuario,
            tipo: colaboradorEncontrado.tipo
        })
    }).catch(function(erro) {
        res.redirect("/erro")
        console.log("erro ao carregar os dados: " + erro)
    })
})

app.get("/consumir-estoque/:id", eTatuador, async(req, res) => {
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
            usuarioLogin: usuarioEncontrado.usuario,
            tipo: colaboradorEncontrado.tipo
        })
    }).catch(function(erro) {
        res.redirect("/erro")
        console.log("erro ao carregar os dados: " + erro)
    })
})

app.post("/atualizar-estoque", eAdmin, async(req, res) => {
    try {
        Controller_Estoque.atualizarMaterial(
            req.body.id_material,
            req.body.nome,
            req.body.quantidade,
            req.body.valor_unidade, ).then(function() {
            res.redirect("/listar-estoque")
        })
    } catch (error) {
        res.redirect("/erro");
    }
    
    
})

app.post("/consumir-estoque", eTatuador, async(req, res) => {
    try {
        Controller_Estoque.diminuirQuantidade(
            req.body.id_material,
            req.body.id_colaborador,
            req.body.quantidade,
    
        ).then(function() {
            res.redirect("/listar-estoque")
        })
    } catch (error) {
        res.redirect("/erro");
    }
    
    
})

/*app.get("/excluir-estoque/:id", eTatuador, async(req, res) => {
    Controller_Estoque.excluirMaterial(req.params.id).then(function() {
        res.redirect("/listar-estoque")
    }).catch(function(erro) {
        res.send("Erro ao deletar os dados: " + erro)
    })
})*/

// ------------------------------------ CRUD Cliente -------------------------------------------

//visualização de clientes cadastrados
app.get("/listar-cliente", eTatuador, function(req, res) {
    Controller_Cliente.visualizarCliente().then((clientes) => {
        res.render("listar-cliente", {
            clientes,
            title: "Listar cliente",
            style: `<link rel="stylesheet" href="/css/style.css">`,
            usuarioLogin: usuarioEncontrado.usuario,
            tipo: colaboradorEncontrado.tipo
        })
    }).catch((erro) => {
        res.redirect("/erro")
        console.log("Erro ao carregar os dados. Volte a página anterior! <br> Erro: " + erro)
    })
})

// renderiza o formulário de cadastro de clientes
app.get("/novo-cliente", eTatuador, function(req, res) {
    res.render("novo-cliente", {
        title: "Novo cliente",
        style: `<link rel="stylesheet" href="/css/style.css">`,
        usuarioLogin: usuarioEncontrado.usuario,
        tipo: colaboradorEncontrado.tipo
    })
})

//rota interna de cadastro de clientes
app.post("/cadastrar-cliente", eTatuador, async(req, res) => {
    try {
        Controller_Cliente.cadastrarCliente(
            req.body.nome,
            req.body.cpf,
            req.body.telefone,
            req.body.email,
            req.body.redeSocial
        ).then(() => {
            clientes++;
            Dashboard.quantidadeClientes(clientes);
            res.redirect("/listar-cliente");
            console.log("dados cadastrados com sucesso")
        })
    } catch (erro) {
        res.redirect("/erro")
    }
    
    
})

// rota de exclusão do cliente
app.get("/excluir-cliente/:id", eTatuador, async(req, res) => {
    Controller_Cliente.excluirCliente(req.params.id).then(() => {
        res.redirect("/listar-cliente")
        console.log("dados excluídos com sucesso")
    }).catch((erro) => {
        res.redirect("/erro")
        console.log("Erro ao excluir os dados: " + erro)
    })
})

// procura o cliente esepcificado ao apertar o botão de editar, e renderiza o formulário com os dados dele para editá-lo
app.get("/editar-cliente/:id", eTatuador, async(req, res) => {
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
                    usuarioLogin: usuarioEncontrado.usuario,
                    tipo: colaboradorEncontrado.tipo
        })
    })
})

// rota de atualização dos dados
app.post("/atualizar-cliente", eTatuador, async(req, res) => {
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
        res.redirect("/erro")
    })
})

// funcionalidade de busca por CPF
app.post("/buscar-cliente", eTatuador, async(req, res) => {
    const cpf = req.body.cpf;

    if (!cpf) {
        return res.status(400).send('CPF não encontrado na base de dados ');
    }

    try {
        Controller_Cliente.buscarCPF(cpf).then((clientes) => {
            res.render("listar-cliente", {
                clientes,
                style: `<link rel="stylesheet" href="/css/style.css">`,
                usuarioLogin: usuarioEncontrado.usuario,
                tipo: colaboradorEncontrado.tipo
            })
        })
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        res.status(500).send('Erro interno do servidor');
        res.redirect("/erro")
    }
})




//--------------------------  CRUD da Ficha de Anamnese que pertence a um único cliente -------

// esta rota é acessada através de um botão editar ficha, na página de listar clientes, ela renderiza os dados de uma ficha pertencente a um cliente
app.get("/listar-ficha/:id", eTatuador, async(req, res) => {
    Controller_Cliente.visualizarFicha(req.params.id).then((cliente) => {
        res.render("listar-ficha", {
            cliente,
            style: `<link rel="stylesheet" href="/css/style.css">`,
            usuarioLogin: usuarioEncontrado.usuario,
            tipo: colaboradorEncontrado.tipo
        })
    }).catch((erro) => {
        res.redirect("/erro")
        console.log("erro ao carregar os dados. Volte para a página anterior. <br> Erro: " + erro)
    })
})

//esta rota renderiza o formulário de cadastro dos dados da ficha, que também é o mesmo de edição
app.get("/nova-ficha/:id", eTatuador, async(req, res) => {
    Controller_Cliente.procurarCliente(req.params.id).then((cliente) => {
        res.render("nova-ficha", {
            cliente,
            style: `<link rel="stylesheet" href="/css/style.css">`,
            usuarioLogin: usuarioEncontrado.usuario,
            tipo: colaboradorEncontrado.tipo
        })
    }).catch(() => {
        res.redirect("/erro")
    })
})

// rota interna que atualiza o cliente, com os dados da ficha
app.post("/cadastrar-ficha", async(req, res) => {
    Controller_Cliente.cadastrarFicha(
        req.body.nascimento,
        req.body.endereco,
        req.body.tratamento,
        req.body.tratamentoDesc,
        req.body.cirurgia,
        req.body.cirurgiaDesc,
        req.body.alergia,
        req.body.alergiaDesc,
        req.body.problemaCardiaco,
        req.body.cancer,
        req.body.drogas,
        req.body.cicatrizacao,
        req.body.diabetes,
        req.body.diabetesDesc,
        req.body.convulsao,
        req.body.convulsaoDesc,
        req.body.doencasTransmissiveis,
        req.body.doencasTransmissiveisDesc,
        req.body.pressao,
        req.body.anemia,
        req.body.hemofilia,
        req.body.hepatite,
        req.body.outro,
        req.body.outroDesc,
        req.body.dataAtual,
        req.body.fk_cliente
    ).then(() => {
        res.redirect("listar-cliente")
    }).catch((erro) => {
        res.redirect("/erro")
        console.log("erro ao carregar os dados. Volte para a página anterior. <br> Erro: " + erro)
    })
})

app.get("/excluir-dados-ficha/:id", eTatuador, async(req, res) => {
    Controller_Cliente.excluirDadosFicha(req.params.id).then(() => {
        res.redirect("/listar-cliente")
    }).catch((erro) => {
        res.redirect("/erro")
        console.log("Houve um erro. Volte a página anterior.<br> Erro: " + erro)
    })
})



//------------------------------------ Google agenda --------------------------------------

app.get("/listar-evento", eTatuador, async(req, res) => {
    copiaEventos.findAll().then((eventos) => {
        res.render("listar-evento", { eventos, style: `<link rel="stylesheet" href="/css/style.css">`,
        usuarioLogin: usuarioEncontrado.usuario,
        tipo: colaboradorEncontrado.tipo })
    })
})

// renderiza a agenda com todos os agendamentos até agora
app.get("/agenda", eTatuador, async(req, res) => {
    res.render("agenda", {
        style: `<link rel="stylesheet" href="/css/style.css">`,
        usuarioLogin: usuarioEncontrado.usuario,
        tipo: colaboradorEncontrado.tipo
    })
})

// renderiza formulário de captação dos dados para agendamento
app.get("/novo-agendamento", eTatuador, async(req, res) => {
    Controller_Estoque.visualizarMaterial().then((materiais) => {
        res.render("novo-evento", {
            materiais,
            title: "Listagem de estoque",
            style: `<link rel="stylesheet" href="/css/style.css">
            <link rel="stylesheet" href="../../css/fileStyle.css">`,
            usuarioLogin: usuarioEncontrado.usuario,
            tipo: colaboradorEncontrado.tipo
        })
    })

})

// rota interna que chama a API e insere um procedimento na agenda
// ao inserir um procedimento, ele chama o módulo da biblioteca de enviar o email de confirmação, e envia pro email do cliente.

app.post("/criarAgendamento", eTatuador, async(req, res) => {
    const id_colab = colaboradorEncontrado.id_colaborador;
    const colaborador = await Colaborador.findByPk(id_colab);
    const id_cliente = req.body.id_cliente;
    const cliente = await Cliente.findByPk(id_cliente);
    const { email } = cliente;
    const { nome } = cliente;
    if (colaborador && cliente) {
        const email_cliente = cliente.email;
        const nome_cliente = cliente.nome;
        const email_colaborador = colaborador.email;
        const nome_colaborador = colaborador.nome;
        googleCalendar.createEvent(
            req.body.nome_evento,
            req.body.local_evento,
            req.body.descricao_evento,
            req.body.data_evento,
            req.body.hora_inicio,
            req.body.hora_termino,
            email_cliente,
            nome_cliente,
            email_colaborador,
            nome_colaborador

        ).then(async() => {
            let materiais = [];
            let quantidades = [];
            for (let index = 0; index < req.body.id_material.length; index++) {
                materiais.push(req.body.id_material[index])
                quantidades.push(req.body.quantidade[index])
            }
            Controller_Estoque.consumirMateriaisAgendamento(
                materiais,
                quantidades,
                req.body.id_colaborador
            ).then(() => {
                console.log("Material utilizado com sucesso");
            })
            if (cliente) {
                nodemailer.email.enviarEmail(email_cliente, nome_cliente);
                console.log("email enviado com sucesso")
            } else {
                console.log("falha ao enviar email")
            }
            res.redirect("/agenda")
        }).catch((error) => {
            res.redirect("/erro")
            console.log("Dados incorretos ou não encontrados ao cadastrar agendamento <br> Retorne a página anterior!" + error)
            console.log("Dados incorretos ou não encontrados ao cadastrar agendamento <br> Retorne a página anterior!" + error)
        })
    } else {
        throw new error("Cliente não encontrado!")
    }
})



//excluir agendamento
app.get("/excluir-agendamento/:id_procedimento_API", eTatuador, async(req, res) => {
    googleCalendar.deleta(req.params.id_procedimento_API).then(() => {

        res.redirect("/listar-evento")
    }).catch((erro) => {
        res.redirect("/erro")
        console.log("erro" + erro)
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
        res.redirect("/erro")
        console.log("falha ao enviar email")
    })


})

app.get("/erro", async(req, res) => {
    res.render("refresh", {
        style: `<link rel="stylesheet" href="/css/error.css">`
    })
})

app.get("/login-error", async(req, res) => {
    res.render("login-error", {
        style: `<link rel="stylesheet" href="/css/error.css">`
    })
})

app.get("/admin-error", async(req, res) => {
    res.render("admin-error", {
        style: `<link rel="stylesheet" href="/css/error.css">`
    })
})

//Alterar senha
app.get("/redefinir-senha", async(req, res) => {
    res.render("alterar-senha", {
        style: `<link rel="stylesheet" href="/css/style.css">`,
        usuarioLogin: usuarioEncontrado.usuario,
        tipo: colaboradorEncontrado.tipo
    })
})

app.post("/alterar-senha", eTatuador, async (req, res) => {
    if(req.body.novaSenha == req.body.repetirSenha) {
        try {
            const senhaCript = await bcrypt.hash(req.body.novaSenha, 8);
            await Controller_Colaborador_Usuario.alterarSenha(
                usuarioEncontrado.id_usuario,
                req.body.novaSenha,
                senhaCript).then(function() {
                res.redirect("/redefinir-senha")
            })
            
        } catch (error) {
            res.redirect("/erro");
            console.log(error)
        }
    } else {
        console.log("Senhas não iguais")
    }
    
})

//porta principal
app.listen(8081, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8081")
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