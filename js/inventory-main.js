import { database } from './firebase-config.js';
import { 
    loadProducts, 
    renderProductTable, 
    showProductModal, 
    hideProductModal, 
    saveProduct, 
    searchProducts, 
    sortProducts 
} from './product-manager.js';

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    
    document.getElementById('showFormBtn').addEventListener('click', showProductModal);
    document.querySelector('.close-btn').addEventListener('click', hideProductModal);
    document.getElementById('cancelBtn').addEventListener('click', hideProductModal);
    document.getElementById('productForm').addEventListener('submit', saveProduct);
    document.getElementById('searchBtn').addEventListener('click', searchProducts);
    document.getElementById('sortAscBtn').addEventListener('click', () => sortProducts('asc'));
    document.getElementById('sortDescBtn').addEventListener('click', () => sortProducts('desc'));
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn')) {
            editProduct(parseInt(e.target.dataset.id));
        }
        if (e.target.classList.contains('delete-btn')) {
            deleteProduct(parseInt(e.target.dataset.id));
        }
    });
});
// Debug: Verificar elementos del DOM
console.log("Elementos cargados:");
console.log("Botón agregar:", document.getElementById('showFormBtn'));
console.log("Modal:", document.getElementById('productModal'));
console.log("Formulario:", document.getElementById('productForm'));