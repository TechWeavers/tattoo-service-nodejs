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

    static cadastrarMaterial(nome, quantidade, valor_unidade) {
        // formatação de dados para a data brasileira
        const dataCadastro = diaAtual.split("-")
        const diaCadastro = dataCadastro[2];
        const mesCadastro = dataCadastro[1];
        const anoCadastro = dataCadastro[0];
        let data_compra = diaCadastro + "/" + mesCadastro + "/" + anoCadastro
        const cadastro = Material.create({
            nome: nome,
            quantidade: quantidade,
            valor_unidade: valor_unidade,
            data_compra: diaAtual
        })
        return cadastro;
    }

    // diminuir a quantidade de varios materiais no agendamento
    // esta função utiliza um array de materiais e suas respectivas quantidades pré-definidos, no resultado da chamada da função de criar um agendamento
    //obs: importante definir numero padrao de materiais utilizados
    static async consumirMateriaisAgendamento(materiais, quantidades, id_colaborador) {
        for (let x = 0; x < materiais.length; x++) {
            // Busque o material para obter o valor da unidade
            const material = await Material.findOne({
                where: { id_material: materiais[x] }
            });

            if (material) {
                // Calcule o valor total
                const valor_total = material.valor_unidade * quantidades[x];

                // Atualize a quantidade no Material
                await Material.update({
                    quantidade: Sequelize.literal(`quantidade - ${quantidades[x]}`)
                }, {
                    where: { id_material: materiais[x] }
                });

            } else {
                throw new Error('Material não encontrado');
            }
            // Crie o objeto MaterialConsumido
            const valor_total = material.valor_unidade * quantidades[x];
            const consumo = await MaterialConsumido.create({
                nome: material.nome,
                quantidade: quantidades[x],
                valor_total: valor_total,
                data_consumo: diaAtual,
                fk_material: materiais[x],
                fk_colaborador: id_colaborador
            });

        }
        //return { material, consumo };
        return;

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

    static excluirHistorico() {
        const deleta = MaterialConsumido.destroy({ 
            where: {},
            truncate: true });
        return deleta;
    }


}

module.exports = { Controller_Estoque };