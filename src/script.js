// Função que atualiza o status do produto
function produtoStatus() {
    const status = "Ativo";  // Pode ser "ATIVO" ou "INATIVO" vindo da API
        
    const statusElemento = document.getElementById('status-produto');

    if (status === "Ativo") {
        statusElemento.textContent = "Ativo";
        statusElemento.classList.add('ativo');
    } else {
        statusElemento.textContent = "Inativo";
        statusElemento.classList.add('inativo');
    }
}

// Função que exibe o card de resultado
function pesquisarProduto() {
    const card = document.getElementById('resultado');
    card.style.display = 'block'; // Exibe o card
    produtoStatus();  // Atualiza o status do produto
}