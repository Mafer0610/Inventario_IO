import { database } from './firebase-config.js';

// Variable para almacenar productos
export let products = [];
let nextId = 1;
let editMode = false;

// Cargar productos desde Firebase
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

// Guardar productos en Firebase
export function saveProducts() {
    const updates = {};
    products.forEach(product => {
        const productData = {...product};
        delete productData.id;
        updates['/products/' + product.id] = productData;
    });
    database.ref().update(updates);
}

// Renderizar tabla de productos
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

// Mostrar modal de producto
export function showProductModal() {
    console.log("Mostrando modal...");
    const modal = document.getElementById('productModal');
    modal.style.display = 'block';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    editMode = false;
    
    // Añadir la clase show para la animación
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Ocultar modal de producto
export function hideProductModal() {
    console.log("Ocultando modal...");
    const modal = document.getElementById('productModal');
    modal.classList.remove('show');
    
    // Esperar a que termine la animación antes de ocultar completamente
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Configurar listeners para el modal
export function setupModalListeners() {
    console.log("Configurando listeners del modal...");
    
    // Botón para mostrar el formulario
    const showFormBtn = document.getElementById('showFormBtn');
    if (showFormBtn) {
        showFormBtn.addEventListener('click', function() {
            console.log("Botón 'Agregar Producto' clickeado");
            showProductModal();
        });
    } else {
        console.error("No se encontró el botón 'showFormBtn'");
    }
    
    // Botón para cerrar el formulario
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideProductModal);
    } else {
        console.error("No se encontró el botón de cierre '.close-btn'");
    }
    
    // Botón para cancelar
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideProductModal);
    } else {
        console.error("No se encontró el botón 'cancelBtn'");
    }
    
    // Cerrar al hacer clic fuera del modal
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('productModal');
        if (e.target === modal) {
            hideProductModal();
        }
    });
}

// Guardar producto
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

// Editar producto
export function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productPrice').value = product.price;

    editMode = true;
    showProductModal();
}

// Eliminar producto
export function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        products = products.filter(product => product.id !== id);
        saveProducts();
        renderProductTable();
    }
}