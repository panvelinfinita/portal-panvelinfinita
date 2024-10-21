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

function searchProduto() {
    const termoPesquisa = document.getElementById('produto').value;
    const tipoPesquisa = document.getElementById('tipo-pesquisa').value;

    let url;

    if (tipoPesquisa === 'skuFront') {
        // URL para pesquisar pelo SKU Front
        url = `https://busca-sku-panvel-2629ad9fde10.herokuapp.com/api/produtos?sku=${termoPesquisa}`;
    } else if (tipoPesquisa === 'skuSeller') {
        // URL para pesquisar pelo SKU Seller
        url = `https://busca-sku-panvel-2629ad9fde10.herokuapp.com/teste`;
    } else if (tipoPesquisa === 'skuName') {
        // URL para pesquisar pelo nome do produto
        url = `https://busca-sku-panvel-2629ad9fde10.herokuapp.com/teste`;
    } else {
        alert('Escolha uma opção válida para a pesquisa.');
        return;
    }

    // Fazendo a requisição para o proxy de acordo com o tipo de pesquisa
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na consulta API');
            }
            return response.json();
        })
        .then(data => {
            // Processar o resultado de acordo com o tipo de pesquisa
            if (tipoPesquisa === 'skuFront') {
                // Estrutura de retorno para SKU Front
                processarResultadoSkuFront(data);
            } else if (tipoPesquisa === 'ean') {
                // Estrutura de retorno para EAN
                processarResultadoEan(data);
            } else if (tipoPesquisa === 'nomeProduto') {
                // Estrutura de retorno para nome do produto
                processarResultadoNome(data);
            }
        })
        .catch(error => {
            console.error('Erro ao consultar a API:', error);
        });
}

// Função para processar e exibir os resultados da pesquisa por SKU Front
function processarResultadoSkuFront(data) {
    document.querySelector('.produto-nome').textContent = data.NameComplete || 'Nome não disponível';
    document.querySelector('.produto-codes.sku-front').textContent = "Sku Front: " + data.Id || 'Sku Front não disponível';
    document.querySelector('.produto-imagem').src = data.Images.length > 0 ? data.Images[0].ImageUrl : 'https://via.placeholder.com/150';

    if (data.AlternateIds && data.AlternateIds.Ean) {
        document.querySelector('.produto-codes.ean').textContent = `EAN: ${data.AlternateIds.Ean}`;
    } else {
        document.querySelector('.produto-codes.ean').textContent = 'EAN: Não disponível';
    }

    // Processar os sellers
    const sellers = data.SkuSellers || [];
    let sellerInfoHtml = '';

    sellers.forEach(seller => {
        if (seller.SellerId !== "1") {  // Excluir SellerId 1
            sellerInfoHtml += `
                <div class="seller-info">
                    <h3 class="produto-seller"><strong>Seller ID:</strong> ${seller.SellerId}</h3>
                    <p class="produto-codes sku-seller"><strong>Sku Seller:</strong> ${seller.SellerStockKeepingUnitId}</p>
                    <p><strong>Estoque:</strong> [A definir]</p> 
                    <p class="produto-preco"><strong>Preço De:</strong> <span class="produto-precoDe">[A definir]</span></p> 
                    <p class="produto-preco"><strong>Preço Por:</strong><span class="produto-precoPor">[A definir]</span></p> 
                </div>
                <hr>
            `;
        }
    });

    // Exibir os sellers ou uma mensagem padrão se não houver
    document.querySelector('.produto-sellers').innerHTML = sellerInfoHtml || 'Sellers não disponíveis';

    // Exibir o card após o carregamento dos dados
    document.getElementById('resultado').style.display = 'flex';  // Muda o display para flex, exibindo o card
}

// Função para processar e exibir os resultados da pesquisa por EAN
function processarResultadoEan(data) {
    console.log(data);
}

// Função para processar e exibir os resultados da pesquisa por Nome do Produto
function processarResultadoNome(data) {
    console.log(data);
}