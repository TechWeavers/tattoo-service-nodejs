const { Sequelize } = require("./models/db");
const Material = require("./models/Material");
const MaterialConsumido = require("./models/MaterialConsumido");

// classe de controle que utiliza a própria entidade no banco de dados, possui funções estáticas  que devem ser implementadas nas rotas do arquivo app.js, a fim de se responsabilizar pela logica de execução das entidade de estoque

// variaveis de data do dia
let data = new Date();
let dia = data.getDate();
let mes = data.getMonth()
let ano = data.getFullYear()
let diaAtual = dia + "/" + (mes + 1) + "/" + ano


class Controller_Estoque {

    static cadastrarMaterial(nome, quantidade, valor_unidade, data_compra) {
        // formatação de dados para a data brasileira
        const dataCadastro = data_compra.split("-")
        const diaCadastro = dataCadastro[2];
        const mesCadastro = dataCadastro[1];
        const anoCadastro = dataCadastro[0];
        data_compra = diaCadastro + "/" + mesCadastro + "/" + anoCadastro
        const cadastro = Material.create({
            nome: nome,
            quantidade: quantidade,
            valor_unidade: valor_unidade,
            data_compra: data_compra
        })
        return cadastro;
    }


    static async diminuirQuantidade(id_material, id_colaborador, quantidade) {
        // Busque o material para obter o valor da unidade
        const material = await Material.findOne({
            where: { id_material: id_material }
        });

        if (material) {
            // Calcule o valor total
            const valor_total = material.valor_unidade * quantidade;

            // Atualize a quantidade no Material
            await Material.update({
                quantidade: Sequelize.literal(`quantidade - ${quantidade}`)
            }, {
                where: { id_material: id_material }
            });

            // Crie o objeto MaterialConsumido
            const consumo = await MaterialConsumido.create({
                nome: material.nome,
                quantidade: quantidade,
                valor_total: valor_total,
                data_consumo: diaAtual,
                fk_material: id_material,
                //fk_colaborador: id_colaborador
            });

            return { material, consumo };
        } else {
            throw new Error('Material não encontrado');
        }
    }

    static visualizarMaterial(id_material) {
        const view = Material.findAll();
        return view;
    }

    static excluirMaterial(id_material) {
        const deleta = Material.destroy({ where: { 'id_material': id_material } });
        return deleta;
    }

    // procura o material para editar
    static procurarMaterial(id_material) {
        const procura = Material.findAll({ where: { 'id_material': id_material } });
        return procura;
    }

    static atualizarMaterial(id_material, nome, quantidade, valor_unidade, data_compra) {
        const procura = Material.update({
            nome: nome,
            quantidade: quantidade,
            valor_unidade: valor_unidade,
            data_compra: diaAtual
        }, {
            where: { id_material: id_material }
        })
        return procura;
    }


}

module.exports = { Controller_Estoque };