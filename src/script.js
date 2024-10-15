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

function pesquisarProduto() {
    const termoPesquisa = document.getElementById('produto').value;
    const tipoPesquisa = document.getElementById('tipo-pesquisa').value;

    // Só fazemos a requisição se o tipo de pesquisa for 'skuFront'
    if (tipoPesquisa === 'skuFront') {
        const url = `https://panvelprd.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/${termoPesquisa}`;

        // Fazendo a requisição à API com headers
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-VTEX-API-AppToken': 'UOFVLDXSQIKCFYVTKNGANQCHIWJLHGWBOPXWGORMXUPEYLSHJPNTPXSIHZNDCTTYOLNFWTALWYJEKBMDYEYXZEUSCHZWEAYQUILSCTOOCWIONMKBRUVESGZOFMQRYZUDa',
                'X-VTEX-API-AppKey': 'vtexappkey-panvelprd-OLDAFN'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na consulta API');
            }
            return response.json();
        })
        ..then(data => {
            // Preencher os dados no card com base na resposta da API

            // Imagem do Produto
            document.querySelector('.produto-imagem').src = data.Images.ImageUrl;  // Atualiza a imagem com o URL da API
            
            // Nome do Produto
            document.querySelector('.produto-nome').textContent = data.NameComplete;
            
            // EAN
            document.querySelector('.produto-codes.ean').textContent = `EAN: ${data.AlternateIds.Ean}`;

            // SKU Front
            document.querySelector('.produto-codes.sku-front').textContent = `SKU Front: ${data.Id}`;

            // Lógica para o Seller
            const sellers = data.SkuSellers;
            let sellerEncontrado = sellers.find(seller => seller.SellerId !== "1");
            
            if (sellerEncontrado) {
                document.querySelector('.produto-seller').textContent = `Seller: ${sellerEncontrado.SellerId}`;
                document.querySelector('.produto-codes.sku-seller').textContent = `SKU Seller: ${sellerEncontrado.SellerStockKeepingUnitId}`;
            } else {
                document.querySelector('.produto-seller').textContent = "Seller: Não disponível";
            }

            // Exibir o card
            document.getElementById('resultado').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao consultar a API:', error);
        });
    } else {
        alert('Escolha uma opção válida para a pesquisa.');
    }
}