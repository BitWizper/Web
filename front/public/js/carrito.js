// Obtener el carrito del localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Función para mostrar el carrito en el cuadro emergente
function showCartPopup() {
    const cartPopup = document.getElementById("cart-popup");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    // Limpiar el contenido anterior
    cartItemsContainer.innerHTML = "";

    let total = 0;

    // Mostrar los productos en el carrito
    cart.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <p>${item.name}</p>
                <p>$${item.price} x ${item.quantity}</p>
            </div>
            <p>$${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(itemElement);

        // Sumar al total
        total += parseFloat(item.price.replace('$', '')) * item.quantity;
    });

    // Actualizar el total
    cartTotal.textContent = total.toFixed(2);

    // Mostrar el popup
    cartPopup.style.display = "block";
}

// Cerrar el carrito cuando se haga clic en la X
document.getElementById("close-cart").addEventListener("click", function() {
    document.getElementById("cart-popup").style.display = "none";
});

// Abrir el carrito cuando se haga clic en el icono del carrito
document.getElementById("cart-icon").addEventListener("click", showCartPopup);

// Actualizar el contador del carrito
function updateCartIcon() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-icon").setAttribute('data-count', cartCount);
}

// Llamar a updateCartIcon cuando se carga la página
document.addEventListener("DOMContentLoaded", updateCartIcon);

// Función para añadir productos al carrito
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartIcon();
}

// Event listener para los botones "Añadir al carrito"
document.querySelectorAll('.add-to-cart-btn').forEach((button, index) => {
    button.addEventListener('click', () => {
        const product = {
            id: index, 
            name: button.closest('.box').querySelector('h3').textContent,
            price: button.closest('.box').querySelector('.price').textContent,
            image: button.closest('.box').querySelector('img').src
        };
        
        addToCart(product);
    });
});
