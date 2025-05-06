import { database } from './firebase-config.js';

let products = [];
let nextId = 1;

export function loadProducts() {
    database.ref('products').once('value', (snapshot) => {
        products = [];
        snapshot.forEach((childSnapshot) => {
            const product = childSnapshot.val();
            product.id = childSnapshot.key;
            products.push(product);
        });
        nextId = products.length > 0 ? Math.max(...products.map(p => parseInt(p.id))) + 1 : 1;
        renderProductTable();
    });
}

export function saveProducts() {
    const updates = {};
    products.forEach(product => {
        const productData = {...product};
        delete productData.id;
        updates['/products/' + product.id] = productData;
    });
    database.ref().update(updates);
}

export function renderProductTable(productsToShow = products) {
    const productTableBody = document.getElementById('productTableBody');
    productTableBody.innerHTML = '';

    if (productsToShow.length === 0) {
        productTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay productos para mostrar</td></tr>';
        return;
    }

    productsToShow.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <a href="add-product.html?id=${product.id}" class="action-btn edit-btn">Editar</a>
                <button class="action-btn delete-btn" data-id="${product.id}">Eliminar</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

export function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        products = products.filter(product => product.id.toString() !== id.toString());
        saveProducts();
        renderProductTable();
    }
}

export function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderProductTable();
        return;
    }

    const filtered = products.filter(product => 
        product.id.toString().includes(searchTerm) ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    renderProductTable(filtered);
}

export function sortProducts(direction) {
    const sortBy = document.getElementById('sortBy').value;
    const sortedProducts = [...products];
    
    sortedProducts.sort((a, b) => {
        if (sortBy === 'id') {
            return direction === 'asc' ? a.id - b.id : b.id - a.id;
        } else if (sortBy === 'name') {
            return direction === 'asc' ? 
                a.name.localeCompare(b.name) : 
                b.name.localeCompare(a.name);
        } else if (sortBy === 'stock') {
            return direction === 'asc' ? a.stock - b.stock : b.stock - a.stock;
        } else if (sortBy === 'price') {
            return direction === 'asc' ? a.price - b.price : b.price - a.price;
        }
        return 0;
    });
    
    renderProductTable(sortedProducts);
}