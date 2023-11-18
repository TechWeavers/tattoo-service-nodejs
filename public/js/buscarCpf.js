document.getElementById('btnBuscar').addEventListener('click', function() {
    var cpfValue = document.getElementById('cpf').value;

    // Constrói o URL com base no valor do CPF
    var url = '/buscar-cliente/' + cpfValue;

    // Redireciona para o URL desejado
    window.location.href = '/buscar-cliente/' + cpfValue;
});