console.log("teste script")

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

function searchSkuFront() {
    const termoPesquisa = document.getElementById('produto').value;
    const tipoPesquisa = document.getElementById('tipo-pesquisa').value;

    if (tipoPesquisa === 'skuFront') {
        const url = `https://panvelprd.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/{termoPesquisa}`;

        // Fazendo a requisição à API com headers
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-VTEX-API-AppToken': 'UOFVLDXSQIKCFYVTKNGANQCHIWJLHGWBOPXWGORMXUPEYLSHJPNTPXSIHZNDCTTYOLNFWTALWYJEKBMDYEYXZEUSCHZWEAYQUILSCTOOCWIONMKBRUVESGZOFMQRYZUD',
                'X-VTEX-API-AppKey': 'vtexappkey-panvelprd-OLDAFN'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na consulta API');
            }
            return response.json();
        })
        .then(data => {
            // Atualizando os dados no card com base na resposta da API
            
            // Imagem do Produto
            document.querySelector('.produto-imagem').src = data.Images.length > 0 ? data.Images[0].ImageUrl : 'https://via.placeholder.com/150';
            
            // Nome do Produto
            document.querySelector('.produto-nome').textContent = data.NameComplete || 'Nome não disponível';
            
            // EAN (verificação sem encadeamento opcional)
            if (data.AlternateIds && data.AlternateIds.Ean) {
                document.querySelector('.produto-codes.ean').textContent = `EAN: ${data.AlternateIds.Ean}`;
            } else {
                document.querySelector('.produto-codes.ean').textContent = 'EAN: Não disponível';
            }

            // SKU Front
            document.querySelector('.produto-codes.sku-front').textContent = `SKU Front: ${data.Id || 'SKU Front não disponível'}`;

            // Lógica para o Seller
            const sellers = data.SkuSellers || [];
            let sellerEncontrado = sellers.find(seller => seller.SellerId !== "1");
            
            if (sellerEncontrado) {
                document.querySelector('.produto-seller').textContent = `Seller: ${sellerEncontrado.SellerId}`;
                document.querySelector('.produto-codes.sku-seller').textContent = `SKU Seller: ${sellerEncontrado.SellerStockKeepingUnitId}`;
            } else {
                document.querySelector('.produto-seller').textContent = "Seller: Não disponível";
                document.querySelector('.produto-codes.sku-seller').textContent = "SKU Seller: Não disponível";
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