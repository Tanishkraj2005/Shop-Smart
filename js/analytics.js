/* ========================================
   ANALYTICS DASHBOARD
   Simulated data for report preparation
   ======================================== */

// Simulated analytics data
const analyticsData = {
    totalVisitors: 12847,
    bounceRate: 38.2,
    sessionDuration: '4m 32s',
    conversionRate: 3.4,
    totalOrders: 1284,
    revenue: '₹12.4L',
    topProducts: [
        { name: 'Wireless Headphones', category: 'Electronics', views: 2543, addToCart: 342, conversion: 13.5 },
        { name: 'Leather Jacket', category: 'Fashion', views: 1890, addToCart: 287, conversion: 15.2 },
        { name: 'Smart Watch', category: 'Electronics', views: 1765, addToCart: 212, conversion: 12.0 },
        { name: 'Coffee Maker', category: 'Home', views: 1654, addToCart: 198, conversion: 12.0 },
        { name: 'Running Shoes', category: 'Fashion', views: 1543, addToCart: 187, conversion: 12.1 }
    ]
};

// Function to animate counters
function animateCounter(elementId, targetValue, duration = 1000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const start = 0;
    const end = parseInt(targetValue);
    const increment = end / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        
        if (elementId === 'total-visitors' || elementId === 'total-orders') {
            element.textContent = Math.floor(current).toLocaleString('en-IN');
        } else if (elementId.includes('rate')) {
            element.textContent = current.toFixed(1) + '%';
        } else if (elementId === 'session-duration') {
            element.textContent = analyticsData.sessionDuration;
        } else if (elementId === 'revenue') {
            element.textContent = analyticsData.revenue;
        }
    }, 16);
}

// Populate products table
function populateProductsTable() {
    const tbody = document.getElementById('products-table');
    if (!tbody) return;
    
    analyticsData.topProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.views.toLocaleString('en-IN')}</td>
            <td>${product.addToCart.toLocaleString('en-IN')}</td>
            <td>${product.conversion}%</td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize analytics dashboard
function initAnalyticsDashboard() {
    // Animate counters
    setTimeout(() => animateCounter('total-visitors', analyticsData.totalVisitors), 100);
    setTimeout(() => animateCounter('bounce-rate', analyticsData.bounceRate), 200);
    setTimeout(() => document.getElementById('session-duration').textContent = analyticsData.sessionDuration, 300);
    setTimeout(() => animateCounter('conversion-rate', analyticsData.conversionRate), 400);
    setTimeout(() => animateCounter('total-orders', analyticsData.totalOrders), 500);
    
    // Populate table
    populateProductsTable();
    
    // Simulate real-time updates
    setInterval(() => {
        // Update visitors (simulated real-time increment)
        const currentVisitors = parseInt(document.getElementById('total-visitors').textContent.replace(',', ''));
        document.getElementById('total-visitors').textContent = (currentVisitors + 1).toLocaleString('en-IN');
    }, 5000); // Update every 5 seconds
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalyticsDashboard);
} else {
    initAnalyticsDashboard();
}

console.log('Analytics Dashboard Loaded - Simulated Data for Demo Purposes');

