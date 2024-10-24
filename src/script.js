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

// Função para consultar preço e estoque
async function consultarPrecoEstoque(id, seller) {
    const url = 'https://busca-sku-panvel-2629ad9fde10.herokuapp.com/api/preco-estoque';
    const body = {
        id: id,
        seller: seller
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error('Erro na consulta de preço/estoque');
    }

    return response.json();
}

function formatarSkuParaLink(sku) {
    // Transforma o SKU em um número de 8 dígitos iniciando com 1
    let skuFormatado = String(sku).padStart(7, '0');  // Adiciona zeros à esquerda até o SKU ter 7 dígitos
    skuFormatado = `1${skuFormatado}`;  // Adiciona o "1" no início
    
    // Gera o link do produto
    let linkProduto = `https://www.panvel.com/panvel/a/p-${skuFormatado}`;
    
    // Atualiza o link no HTML
    const linkElement = document.getElementById('produto-link');
    linkElement.href = linkProduto;
    linkElement.textContent = 'Ver Produto';
    linkElement.style.display = 'block';  // Exibe o link
}

// Função para processar e exibir os resultados da pesquisa por SKU Front
async function processarResultadoSkuFront(data) {
    document.querySelector('.produto-nome').textContent = data.NameComplete || 'Nome não disponível';
    document.querySelector('.produto-codes.sku-front').textContent = "Sku Front: " + data.Id || 'Sku Front não disponível';
    document.querySelector('.produto-imagem').src = data.Images.length > 0 ? data.Images[0].ImageUrl : 'https://via.placeholder.com/150';

    if (data.AlternateIds && data.AlternateIds.Ean) {
        document.querySelector('.produto-codes.ean').textContent = `EAN: ${data.AlternateIds.Ean}`;
    } else {
        document.querySelector('.produto-codes.ean').textContent = 'EAN: Não disponível';
    }

    // Processar o link do produto usando o SKU Front
    formatarSkuParaLink(data.Id);

    // Processar os sellers
    const sellers = data.SkuSellers || [];
    let sellerInfoHtml = '';

    for (const seller of sellers) {
        if (seller.SellerId !== "1") {
            try {
                const precoEstoque = await consultarPrecoEstoque(data.Id, seller.SellerId);
                
                sellerInfoHtml += `
                    <div class="seller-info">
                        <h3 class="produto-seller"><strong>Seller ID:</strong> ${seller.SellerId}</h3>
                        <p class="sku-seller"><strong>Sku Seller: </strong> ${seller.SellerStockKeepingUnitId}</p>
                        <p class="produto-estoque"><strong>Estoque: </strong> ${precoEstoque.logisticsInfo[0].stockBalance || 'Indisponível'}</p> 
                        <p class="produto-preco"><strong>Preço De: </strong> <span class="produto-precoDe">R$ ${(precoEstoque.items[0].listPrice / 100).toFixed(2)}</span></p> 
                        <p class="produto-preco"><strong>Preço Por: </strong><span class="produto-precoPor">R$ ${(precoEstoque.items[0].price / 100).toFixed(2)}</span></p> 
                    </div>
                    <hr>
                `;
            } catch (error) {
                console.error('Erro ao consultar preço/estoque:', error);
            }
        }
    }

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
