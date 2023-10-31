const Material = require("./models/Material");

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

    static visualizarMaterial() {
        const view = Material.findAll();
        return view;
    }


}

module.exports = { Controller_Estoque };