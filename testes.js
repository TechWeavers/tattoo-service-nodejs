const Cliente = require("./models/Cliente");
const copiaEventos = require("./models/copiaEventos")

function procurarCliente(id_cliente) {
    const procura = Cliente.findAll({ where: { 'id_cliente': id_cliente } });
    return procura;
}

const clientes = [];
clientes.push({ nome: "vizera", idade: 19 });
clientes.push({ nome: "biel", idade: 18 });
clientes.push({ nome: "kauan", idade: 20 });
console.log(clientes)


//diminuirMaterial(clientes)




function diminuirMaterial(clientes) {

    for (let x = 0; x < clientes.length; x++) {
        const procura = Cliente.findAll({ where: { 'id_cliente': clientes[x].idade } });
        if (procura) {

            console.log(clientes[x] + " encontrado");
        } else {
            console.log("nao encntardo")
        }
    }
}

async function quantClientes() {
    const clientes = await Cliente.count();
    console.log("clientes " + clientes)


}

async function quantidadeAgendamentos(quant) {
    const agendamentos = await copiaEventos.findAll();
    let quantEventos = agendamentos.length;
    console.log("quantidade de agendamentos" + quantEventos)
    return quantEventos;
}

quantidadeAgendamentos();

quantClientes();