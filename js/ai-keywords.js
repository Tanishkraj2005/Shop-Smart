/* ========================================
   AI KEYWORDS - TRENDING SEARCHES
   This file uses AI-based keyword suggestions for SEO
   ======================================== */

// AI-suggested trending keywords based on current market trends
const aiKeywords = [
    "trendy fashion deals",
    "affordable home decor",
    "smart shopping discounts",
    "electronics sale 2025",
    "fashion trends India",
    "home furniture online"
];

// Function to display trending keywords in the footer
function displayTrendingSearches() {
    const trendingContainer = document.getElementById('trending-searches');
    
    if (trendingContainer) {
        // Take first 4 keywords for display
        const displayKeywords = aiKeywords.slice(0, 4);
        
        displayKeywords.forEach((keyword, index) => {
            const span = document.createElement('span');
            span.className = 'trending-keyword';
            span.textContent = keyword;
            span.style.cssText = `
                display: inline-block;
                background: rgba(255, 255, 255, 0.1);
                padding: 5px 10px;
                margin: 5px 5px 5px 0;
                border-radius: 15px;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.3s;
            `;
            
            // Add hover effect
            span.addEventListener('mouseenter', () => {
                span.style.background = 'rgba(255, 153, 0, 0.3)';
                span.style.transform = 'translateY(-2px)';
            });
            
            span.addEventListener('mouseleave', () => {
                span.style.background = 'rgba(255, 255, 255, 0.1)';
                span.style.transform = 'translateY(0)';
            });
            
            // Make it clickable to search
            span.addEventListener('click', () => {
                if (document.getElementById('search-input')) {
                    document.getElementById('search-input').value = keyword;
                    document.getElementById('search-input').focus();
                }
            });
            
            trendingContainer.appendChild(span);
        });
    }
}

// Log AI keywords for SEO tracking
console.log("AI Suggested Keywords for SEO:", aiKeywords);

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayTrendingSearches);
} else {
    displayTrendingSearches();
}

