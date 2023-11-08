const { Sequelize } = require("./models/db");
const Material = require("./models/Material");
const MaterialConsumido = require("./models/MaterialConsumido");

// classe de controle que utiliza a própria entidade no banco de dados, possui funções estáticas  que devem ser implementadas nas rotas do arquivo app.js, a fim de se responsabilizar pela logica de execução das entidade de estoque

class Controller_Estoque {

    static cadastrarMaterial(nome, quantidade, valor_unidade, data_compra) {
        const cadastro = Material.create({
            nome: nome,
            quantidade: quantidade,
            valor_unidade: valor_unidade,
            data_compra: data_compra
        })
        return cadastro;
    }

    static diminuirQuantidade(id_material, quantidade) {        
        const update = Material.update({
            quantidade: Sequelize.literal(`quantidade - ${quantidade}`)
        }, {
            where: { id_material: id_material }
        })

        return update;
    }

    static async cadastrarMaterialConsumido(id_material, quantidade, data_consumo) {        
        const material = await Material.findOne({
            where: { id_material: id_material }
        });

        const valor_total = material.valor_unidade * quantidade;

        const consumo = MaterialConsumido.create({
            nome: material.nome,
            quantidade: quantidade,
            valor_total: valor_total,
            data_consumo: data_consumo,
            fk_tatuador: id_material
        })

        return consumo;
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
            data_compra: data_compra
        }, {
            where: { id_material: id_material }
        })
        return procura;
    }


}

module.exports = { Controller_Estoque };