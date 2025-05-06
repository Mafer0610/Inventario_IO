import { database } from './firebase-config.js';

let products = [];
let nextId = 1;
let editMode = false;

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
                <button class="action-btn edit-btn" data-id="${product.id}">Editar</button>
                <button class="action-btn delete-btn" data-id="${product.id}">Eliminar</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

export function showProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'block';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    editMode = false;
    document.getElementById('saveBtn').textContent = 'Guardar Producto';
    
    // Forzar el enfoque y asegurar la visualización
    setTimeout(() => {
        document.getElementById('productName').focus();
        modal.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
    }, 10);
}

export function hideProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

export function setupModalListeners() {
    document.getElementById('showFormBtn').addEventListener('click', showProductModal);
    document.querySelector('.modal .close-btn').addEventListener('click', hideProductModal);
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('productModal')) {
            hideProductModal();
        }
    });
}

export function saveProduct(e) {
    e.preventDefault();
    const product = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value),
        price: parseFloat(document.getElementById('productPrice').value)
    };

    if (editMode) {
        const id = parseInt(document.getElementById('productId').value);
        product.id = id;
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = product;
        }
    } else {
        product.id = nextId++;
        products.push(product);
    }

    saveProducts();
    renderProductTable();
    hideProductModal();
}

export function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productPrice').value = product.price;

    document.getElementById('saveBtn').textContent = 'Actualizar Producto';
    editMode = true;
    showProductModal();
}

export function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        products = products.filter(product => product.id !== id);
        saveProducts();
        renderProductTable();
    }
}