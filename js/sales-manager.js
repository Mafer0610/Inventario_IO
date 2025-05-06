import { database } from './firebase-config.js';
import { products } from './product-manager.js';

let cart = [];

export function addToCart() {
    const productIdValue = document.getElementById('saleProductId').value.trim();
    const quantity = parseInt(document.getElementById('saleQuantity').value);

    if (!productIdValue || isNaN(quantity)) {
        alert('Por favor complete todos los campos');
        return;
    }

    const product = products.find(p => 
        p.id.toString() === productIdValue || 
        p.name.toLowerCase().includes(productIdValue.toLowerCase())
    );

    if (!product) {
        alert('Producto no encontrado');
        return;
    }

    if (product.stock < quantity) {
        alert('Stock insuficiente');
        return;
    }

    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            product: product,
            quantity: quantity
        });
    }

    updateCart();
    document.getElementById('saleProductId').value = '';
    document.getElementById('saleQuantity').value = '';
}

export function updateCart() {
    const cartTableBody = document.getElementById('cartTableBody');
    cartTableBody.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.product.price * item.quantity;
        total += subtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.product.price.toFixed(2)}</td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>
                <button class="action-btn delete-btn" data-cart-index="${index}">Eliminar</button>
            </td>
        `;
        cartTableBody.appendChild(row);
    });

    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

export function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

export function completeSale() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    cart.forEach(item => {
        const product = products.find(p => p.id === item.product.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });

    const movement = {
        date: new Date().toISOString(),
        type: 'venta',
        items: cart.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.price
        })),
        total: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    };

    database.ref('movements').push(movement);
    
    alert(`Venta completada por $${movement.total.toFixed(2)}`);
    cart = [];
    updateCart();
}

export function setupSalesHandlers() {
    document.getElementById('addToCartBtn').addEventListener('click', addToCart);
    document.getElementById('completeSaleBtn').addEventListener('click', completeSale);
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn') && e.target.hasAttribute('data-cart-index')) {
            removeFromCart(parseInt(e.target.dataset.cartIndex));
        }
    });
}