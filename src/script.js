function produtoStatus(){
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

function pesquisar() {
    const card = document.getElementById('resultado');
    card.style.display = 'block';
}