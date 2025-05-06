import { database } from './firebase-config.js';

let products = [];
let nextId = 1;
let editMode = false;

// Cargar productos desde la base de datos
function loadProducts() {
    database.ref('products').once('value', (snapshot) => {
        products = [];
        snapshot.forEach((childSnapshot) => {
            const product = childSnapshot.val();
            product.id = childSnapshot.key;
            products.push(product);
        });
        nextId = products.length > 0 ? Math.max(...products.map(p => parseInt(p.id))) + 1 : 1;
        
        // Verificar si estamos en modo edición
        checkEditMode();
    });
}

// Guardar productos en la base de datos
function saveProducts() {
    const updates = {};
    products.forEach(product => {
        const productData = {...product};
        delete productData.id;
        updates['/products/' + product.id] = productData;
    });
    database.ref().update(updates);
}

// Verificar si estamos en modo edición (URL con parámetro id)
function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        const product = products.find(p => p.id.toString() === productId);
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productPrice').value = product.price;
            
            document.getElementById('formTitle').textContent = 'Editar Producto';
            document.getElementById('saveBtn').textContent = 'Actualizar Producto';
            editMode = true;
        }
    }
}

// Manejar el envío del formulario
function handleFormSubmit(e) {
    e.preventDefault();
    
    const product = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value),
        price: parseFloat(document.getElementById('productPrice').value)
    };

    if (editMode) {
        const id = document.getElementById('productId').value;
        product.id = id;
        const index = products.findIndex(p => p.id.toString() === id);
        if (index !== -1) {
            products[index] = product;
        }
    } else {
        product.id = nextId.toString();
        nextId++;
        products.push(product);
    }

    saveProducts();
    
    // Redirigir al inventario
    window.location.href = 'index.html';
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    document.getElementById('productForm').addEventListener('submit', handleFormSubmit);
});