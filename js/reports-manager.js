import { database } from './firebase-config.js';
import { products } from './product-manager.js';

export function generateStockReportHandler() {
    let lowStockProducts = products.filter(p => p.stock < 10);
    let html = '<h3>Productos con bajo stock</h3>';
    
    if (lowStockProducts.length === 0) {
        html += '<p>Todos los productos tienen stock suficiente</p>';
    } else {
        html += '<table><tr><th>Producto</th><th>Stock</th><th>Costo de Reposición</th></tr>';
        lowStockProducts.forEach(p => {
            const reorderCost = (10 - p.stock) * p.price;
            html += `<tr><td>${p.name}</td><td>${p.stock}</td><td>$${reorderCost.toFixed(2)}</td></tr>`;
        });
        html += '</table>';
    }
    
    document.getElementById('reportResults').innerHTML = html;
}

export function generateAnnualCostReportHandler() {
    database.ref('movements').once('value', (snapshot) => {
        const movements = [];
        snapshot.forEach((childSnapshot) => {
            movements.push(childSnapshot.val());
        });

        const sales = movements.filter(m => m.type === 'venta');
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const recentSales = sales.filter(s => new Date(s.date) > sixMonthsAgo);
        const totalSold = recentSales.reduce((sum, sale) => sum + sale.total, 0);
        
        const totalAnnualCost = totalSold * 2;
        const averageOrderCost = recentSales.length > 0 ? totalSold / recentSales.length : 0;
        
        let html = '<h3>Costo Anual de Inventario</h3>';
        html += `<p><strong>Costo total anual estimado:</strong> $${totalAnnualCost.toFixed(2)}</p>`;
        html += `<p><strong>Costo promedio por pedido:</strong> $${averageOrderCost.toFixed(2)}</p>`;
        html += `<p><strong>Ventas en los últimos 6 meses:</strong> $${totalSold.toFixed(2)}</p>`;
        
        document.getElementById('reportResults').innerHTML = html;
    });
}

export function generateMovementsReport() {
    database.ref('movements').once('value', (snapshot) => {
        const movements = [];
        snapshot.forEach((childSnapshot) => {
            movements.push(childSnapshot.val());
        });

        let html = '<h3>Últimos movimientos de inventario</h3>';
        
        if (movements.length === 0) {
            html += '<p>No hay movimientos registrados</p>';
        } else {
            movements.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            html += '<table><tr><th>Fecha</th><th>Tipo</th><th>Productos</th><th>Total</th></tr>';
            
            const recentMovements = movements.slice(0, 10);
            
            recentMovements.forEach(movement => {
                const date = new Date(movement.date);
                const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                
                html += `<tr>
                    <td>${formattedDate}</td>
                    <td>${movement.type}</td>
                    <td>${movement.items.map(i => `${i.productName} (${i.quantity})`).join(', ')}</td>
                    <td>$${movement.total.toFixed(2)}</td>
                </tr>`;
            });
            
            html += '</table>';
        }
        
        document.getElementById('reportResults').innerHTML = html;
    });
}

export function setupReportsHandlers() {
    document.getElementById('generateStockReport').addEventListener('click', generateStockReportHandler);
    document.getElementById('generateAnnualCostReport').addEventListener('click', generateAnnualCostReportHandler);
    document.getElementById('generateMovementsReport').addEventListener('click', generateMovementsReport);
}