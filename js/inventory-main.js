import { database } from './firebase-config.js';
import { 
    loadProducts, 
    renderProductTable, 
    searchProducts, 
    sortProducts,
    deleteProduct
} from './product-manager.js';

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    
    document.getElementById('searchBtn').addEventListener('click', searchProducts);
    document.getElementById('sortAscBtn').addEventListener('click', () => sortProducts('asc'));
    document.getElementById('sortDescBtn').addEventListener('click', () => sortProducts('desc'));
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            deleteProduct(e.target.dataset.id);
        }
    });
});