import { loadProducts } from './product-manager.js';
import { setupSalesHandlers } from './sales-manager.js';

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupSalesHandlers();
});