import { database } from './firebase-config.js';
import { 
    loadProducts, 
    renderProductTable, 
    showProductModal, 
    hideProductModal, 
    saveProduct, 
    editProduct,
    deleteProduct,
    setupModalListeners
} from './product-manager.js';

document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos
    loadProducts();
    
    // Configurar los listeners para el modal
    setupModalListeners();
    
    // Configurar el resto de listeners
    document.getElementById('productForm').addEventListener('submit', saveProduct);
    document.getElementById('searchBtn').addEventListener('click', () => {
        // Implementar búsqueda (o puedes agregar esta funcionalidad después)
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.category.toLowerCase().includes(searchTerm)
        );
        renderProductTable(filteredProducts);
    });
    
    // Listeners para ordenamiento
    document.getElementById('sortAscBtn').addEventListener('click', () => {
        const sortBy = document.getElementById('sortBy').value;
        const sortedProducts = [...products].sort((a, b) => {
            if (sortBy === 'id' || sortBy === 'stock') {
                return a[sortBy] - b[sortBy];
            }
            if (sortBy === 'price') {
                return a.price - b.price;
            }
            return a[sortBy].localeCompare(b[sortBy]);
        });
        renderProductTable(sortedProducts);
    });
    
    document.getElementById('sortDescBtn').addEventListener('click', () => {
        const sortBy = document.getElementById('sortBy').value;
        const sortedProducts = [...products].sort((a, b) => {
            if (sortBy === 'id' || sortBy === 'stock') {
                return b[sortBy] - a[sortBy];
            }
            if (sortBy === 'price') {
                return b.price - a.price;
            }
            return b[sortBy].localeCompare(a[sortBy]);
        });
        renderProductTable(sortedProducts);
    });
    
    // Listener para editar y eliminar productos
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn')) {
            editProduct(parseInt(e.target.dataset.id));
        }
        if (e.target.classList.contains('delete-btn')) {
            deleteProduct(parseInt(e.target.dataset.id));
        }
    });
    
    // Debug: Verificar elementos del DOM
    console.log("Elementos cargados:");
    console.log("Botón agregar:", document.getElementById('showFormBtn'));
    console.log("Modal:", document.getElementById('productModal'));
    console.log("Formulario:", document.getElementById('productForm'));
});