function contarCheckboxes() {
    // Obter todos os elementos de input dentro do formulário
    var checkboxes = document.getElementById('meuFormulario').querySelectorAll('input[type="checkbox"]');
    
    // Inicializar a contagem
    var contagem = 0;
  
    // Iterar sobre os checkboxes
    for (var i = 0; i < checkboxes.length; i++) {
      // Verificar se a caixa de seleção está marcada e tem um valor diferente de null
      if (checkboxes[i].checked && checkboxes[i].value !== 'null') {
        contagem++;
      }
    }
  
    // Exibir a contagem no console (você pode ajustar conforme necessário)
    return contagem
  }