const menu = document.getElementById("menu");
const cartbtn = document.getElementById("cart-btn");
const cartmodal = document.getElementById("cart-modal");
const cartitemscontainer = document.getElementById("cart-items");
const cartotal = document.getElementById("cart-total");
const checkoutbtn = document.getElementById("checkout-btn");
const closemodalbtn = document.getElementById("close-modal-btn");
const cartcounter = document.getElementById("cart-count");
const addressinput = document.getElementById("address");
const addresserror = document.getElementById("address-error");
const aberto = document.getElementById("hr_funcion")
let cart = [];

// Abrindo o modal do carrinho
cartbtn.addEventListener("click", function () {
    cartmodal.style.display = "flex";
});

// Fechar modal quando clicar fora
cartmodal.addEventListener("click", function (event) {
    if (event.target === cartmodal) {
        cartmodal.style.display = "none";
    }
});

closemodalbtn.addEventListener("click", function () {
    cartmodal.style.display = "none";
});

// Adicionando itens ao carrinho
menu.addEventListener("click", function (event) {
    let parentbutton = event.target.closest(".btn_add");
    if (parentbutton) {
        // Certifique-se de que o preço está sendo capturado corretamente e convertido em número
        const name = parentbutton.getAttribute("data-name");
        const price = parseFloat(parentbutton.getAttribute("data-price"));

        if (!isNaN(price)) {
            addcar(name, price);
        } else {
            console.error("Preço inválido detectado");
        }
    }
});

// Função para adicionar itens ao carrinho
function addcar(name, price) {
    const existingitem = cart.find(item => item.name === name);

    if (existingitem) {
        // Se o item já existe no carrinho, incrementa a quantidade
        existingitem.qtd += 1;
    } else {
        // Caso contrário, adiciona o item ao carrinho
        cart.push({
            name,
            price,
            qtd: 1
        });
    }
    atualizacartmodal();
}

// Função para atualizar o modal do carrinho
function atualizacartmodal() {
    const cartItemsList = document.getElementById("cart-items-list"); // O container específico para os itens do carrinho
    cartItemsList.innerHTML = ""; // Limpa os itens do carrinho

    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("itensdentrocar");
        cartItemElement.innerHTML = `
        <div class="listaitem">
            <div>
                <p style="font-weight: 700;">${item.name}</p>
                <p>Qtd: ${item.qtd}</p>
                <p style="font-weight: 700;">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-btn" data-name="${item.name}">Remover</button>
        </div>
        `;
        cartItemsList.appendChild(cartItemElement);

        // Calcula o total diretamente, sem multiplicar, e usa toFixed(2) para formatar o preço corretamente
        total += item.price * item.qtd;
    });
    document.getElementById("cart-total").textContent = `R$ ${total.toFixed(2)}`;
    cartcounter.innerHTML = `( ${cart.length} )`;
}

//funcão para eu remover do carrinho os intens
cartitemscontainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name")
        removeitemcart(name)
    }
})
function removeitemcart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index != -1) {
        const item = cart[index];
        if (item.qtd > 1) {
            item.qtd -= 1;
            atualizacartmodal()
            return;
        }
        cart.splice(index, 1);
        atualizacartmodal()
    }
}
addressinput.addEventListener("input", function (event) {
    let inputvalue = event.target.value;
    if (inputvalue != "") {
        addresserror.style.display = "none";
    }
    //
})

checkoutbtn.addEventListener("click", function () {
    const isopen = checkrestaurantopen();
    if (!isopen) {
        Toastify({
            text: "Ops... O restaurante esta fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
            onClick: function () { } // Callback after click
        }).showToast();
        return;
    }
    if (cart.length === 0) return; // Verifica se o carrinho está vazio

    if (addressinput.value === "") {
        addresserror.style.display = "block"; // Mostra erro se o endereço estiver vazio
        return;
    } else {
        addresserror.style.display = "none"; // Oculta erro se o endereço estiver preenchido
    }


    // Mapeia os itens do carrinho para uma string
    const cartitem = cart.map(item => {
        return `${item.name} Quantidade: (${item.qtd}) Preço: R$ ${item.price} |`;
    }).join("");

    const mensagem = encodeURIComponent(cartitem);
    const phone = "5518997069289"; // Número de telefone formatado para Brasil (código do país + número)

    // Garante que o endereço também está codificado
    const endereco = encodeURIComponent(addressinput.value);

    // Monta a URL final com o espaço adequado
    window.open(`https://wa.me/${phone}?text=${mensagem}%20Endereço:%20${endereco}`, "_blank");
    cart = [];
    atualizacartmodal();
});


function checkrestaurantopen() {
    const now = new Date();
    const funcionamento = now.getHours();
    if (funcionamento >= 18 && funcionamento <= 22) {
        return true;
    }
    return false;
}
const spanitem = document.getElementById("hr_funcion");
const isopen = checkrestaurantopen(); // Supondo que essa função retorna true ou false

if (isopen) {
    spanitem.style.backgroundColor = "#54CC0A"; // Verde quando aberto
} else {
    spanitem.style.backgroundColor = "red"; // Vermelho quando fechado
}
