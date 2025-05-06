import { database } from './firebase-config.js';
import { 
    loadProducts, 
    renderProductTable, 
    showForm, 
    hideForm, 
    saveProduct, 
    editProduct, 
    deleteProduct 
} from './product-manager.js';
import {
    addToCart,
    updateCart,
    removeFromCart,
    completeSale,
    toggleSales
} from './sales-manager.js';
import {
    generateStockReportHandler,
    generateAnnualCostReportHandler,
    generateMovementsReport,
    toggleReports
} from './reports-manager.js';

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();

    document.getElementById('productForm').addEventListener('submit', saveProduct);
    document.getElementById('cancelBtn').addEventListener('click', hideForm);
    document.getElementById('showFormBtn').addEventListener('click', showForm);
    document.getElementById('closeFormBtn').addEventListener('click', hideForm);
    document.getElementById('addToCartBtn').addEventListener('click', addToCart);
    document.getElementById('completeSaleBtn').addEventListener('click', completeSale);
    document.getElementById('showSalesBtn').addEventListener('click', toggleSales);
    document.getElementById('closeSaleBtn').addEventListener('click', toggleSales);
    document.getElementById('showReportsBtn').addEventListener('click', toggleReports);
    document.getElementById('closeReportsBtn').addEventListener('click', toggleReports);
    document.getElementById('generateStockReport').addEventListener('click', generateStockReportHandler);
    document.getElementById('generateAnnualCostReport').addEventListener('click', generateAnnualCostReportHandler);
    document.getElementById('generateMovementsReport').addEventListener('click', generateMovementsReport);

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn')) {
            editProduct(parseInt(e.target.dataset.id));
        }
        if (e.target.classList.contains('delete-btn')) {
            deleteProduct(parseInt(e.target.dataset.id));
        }
        if (e.target.classList.contains('delete-btn') && e.target.hasAttribute('data-cart-index')) {
            removeFromCart(parseInt(e.target.dataset.cartIndex));
        }
    });
});