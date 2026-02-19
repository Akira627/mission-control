// mission-control/assets/js/dashboard.js
// Main dashboard initialization and management

// Wait for all dependencies to load
window.addEventListener('load', () => {
    // Check if required APIs are available
    if (!window.MissionControlAPI) {
        console.error('MissionControlAPI not found!');
        showError('API module failed to load. Please refresh the page.');
        return;
    }
    
    if (!window.MissionControlActions) {
        console.error('MissionControlActions not found!');
        showError('Actions module failed to load. Please refresh the page.');
        return;
    }
    
    // Initialize dashboard
    console.log('Mission Control Dashboard loaded successfully');
    
    // Check for offline mode on startup
    if (!navigator.onLine) {
        showOfflineWarning();
    }
});

// Error display function
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-0 left-0 right-0 bg-red-600 text-white p-4 text-center z-50';
    errorDiv.innerHTML = `
        <div class="container mx-auto">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            ${message}
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-sm underline">
                Dismiss
            </button>
        </div>
    `;
    document.body.prepend(errorDiv);
}

// Offline warning
function showOfflineWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'fixed top-0 left-0 right-0 bg-yellow-600 text-white p-4 text-center z-50';
    warningDiv.innerHTML = `
        <div class="container mx-auto">
            <i class="fas fa-wifi-slash mr-2"></i>
            You are currently offline. Dashboard is using cached data.
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-sm underline">
                Dismiss
            </button>
        </div>
    `;
    document.body.prepend(warningDiv);
}

// Add double-click to refresh functionality to all metric cards
document.addEventListener('DOMContentLoaded', () => {
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.title = 'Double-click to refresh this data';
        
        card.addEventListener('dblclick', function() {
            const cardId = this.id;
            if (window.dashboardManager && window.dashboardManager.refreshCardData) {
                window.dashboardManager.refreshCardData(cardId);
            }
        });
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R to refresh all data
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        if (window.dashboardManager && window.dashboardManager.loadAllData) {
            window.dashboardManager.loadAllData();
        }
    }
    
    // Escape to clear notifications
    if (e.key === 'Escape') {
        document.querySelectorAll('.toast, .offline-indicator').forEach(el => el.remove());
    }
});

// Performance monitoring
if (window.performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log(`Dashboard loaded in ${Math.round(perfData.domContentLoadedEventEnd)}ms`);
            }
        }, 0);
    });
}

// Service worker registration for offline support (future enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}