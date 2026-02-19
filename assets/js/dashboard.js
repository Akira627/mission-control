// mission-control/assets/js/dashboard.js

class MissionControlDashboard {
    constructor() {
        this.initialize();
    }

    initialize() {
        console.log('Mission Control Dashboard initialized');
        this.setupEventListeners();
        this.setupAutoRefresh();
        this.setupThemeDetection();
        this.setupAccessibility();
    }

    setupEventListeners() {
        // Navigation menu toggle for mobile
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu) {
                    navMenu.classList.toggle('hidden');
                }
            });
        }

        // Status filter buttons
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const status = e.target.dataset.status || 'all';
                this.filterAgentsByStatus(status);
                
                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Quick action buttons
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            action.addEventListener('click', (e) => {
                const actionType = e.target.closest('.quick-action').dataset.action;
                this.handleQuickAction(actionType);
            });
        });

        // Alert dismissal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dismiss-alert')) {
                e.target.closest('.alert-item').remove();
                this.updateAlertCount();
            }
        });
    }

    filterAgentsByStatus(status) {
        const agentRows = document.querySelectorAll('tbody tr');
        
        agentRows.forEach(row => {
            const agentStatus = row.querySelector('.status-indicator').className;
            
            if (status === 'all') {
                row.style.display = '';
            } else if (status === 'online' && agentStatus.includes('status-online')) {
                row.style.display = '';
            } else if (status === 'warning' && agentStatus.includes('status-warning')) {
                row.style.display = '';
            } else if (status === 'offline' && agentStatus.includes('status-offline')) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    handleQuickAction(actionType) {
        const actions = {
            'new-agent': () => this.showModal('Create New Agent'),
            'start-all': () => this.startAllAgents(),
            'pause-all': () => this.pauseAllAgents(),
            'reports': () => this.generateReports(),
            'emergency': () => this.triggerEmergencyProtocol(),
            'settings': () => this.openSettings()
        };

        if (actions[actionType]) {
            actions[actionType]();
        } else {
            console.warn(`Unknown action type: ${actionType}`);
        }
    }

    showModal(title) {
        // In a real implementation, this would show a modal
        console.log(`Showing modal: ${title}`);
        alert(`Action: ${title}\n\nThis would open a modal in a real implementation.`);
    }

    startAllAgents() {
        // Simulate starting all agents
        document.querySelectorAll('.status-indicator.status-offline, .status-indicator.status-warning')
            .forEach(indicator => {
                indicator.classList.remove('status-offline', 'status-warning');
                indicator.classList.add('status-online');
            });
        
        this.showNotification('All agents started successfully', 'success');
    }

    pauseAllAgents() {
        // Simulate pausing all agents
        document.querySelectorAll('.status-indicator.status-online')
            .forEach(indicator => {
                indicator.classList.remove('status-online');
                indicator.classList.add('status-warning');
            });
        
        this.showNotification('All agents paused', 'warning');
    }

    generateReports() {
        // Simulate report generation
        this.showNotification('Generating system reports...', 'info');
        
        setTimeout(() => {
            this.showNotification('Reports generated successfully', 'success');
        }, 2000);
    }

    triggerEmergencyProtocol() {
        if (confirm('Are you sure you want to trigger emergency protocol? This will shut down all non-essential systems.')) {
            this.showNotification('Emergency protocol activated', 'critical');
            
            // Visual feedback
            document.body.style.animation = 'emergencyFlash 1s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
        }
    }

    openSettings() {
        this.showModal('Dashboard Settings');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="dismiss-notification">×</button>
        `;
        
        // Add to notification area
        const notificationArea = document.querySelector('.notification-area') || this.createNotificationArea();
        notificationArea.appendChild(notification);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        // Dismiss on click
        notification.querySelector('.dismiss-notification').addEventListener('click', () => {
            notification.remove();
        });
    }

    createNotificationArea() {
        const area = document.createElement('div');
        area.className = 'notification-area fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(area);
        return area;
    }

    updateAlertCount() {
        const alertCount = document.querySelectorAll('.alert-item').length;
        const alertBadge = document.querySelector('.alert-badge');
        
        if (alertBadge) {
            alertBadge.textContent = alertCount;
            alertBadge.style.display = alertCount > 0 ? 'flex' : 'none';
        }
    }

    setupAutoRefresh() {
        // Auto-refresh data every 30 seconds
        setInterval(() => {
            this.refreshDashboardData();
        }, 30000);
    }

    refreshDashboardData() {
        // Simulate data refresh
        console.log('Refreshing dashboard data...');
        
        // Update timestamp
        const timestampElement = document.querySelector('.last-updated');
        if (timestampElement) {
            const now = new Date();
            timestampElement.textContent = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
        }
        
        // Simulate random status changes
        this.simulateStatusChanges();
        
        // Show refresh notification
        this.showNotification('Dashboard data refreshed', 'info');
    }

    simulateStatusChanges() {
        const indicators = document.querySelectorAll('.status-indicator');
        indicators.forEach(indicator => {
            if (Math.random() > 0.95) { // 5% chance of status change
                if (indicator.classList.contains('status-online')) {
                    indicator.classList.remove('status-online');
                    indicator.classList.add('status-warning');
                } else if (indicator.classList.contains('status-warning')) {
                    indicator.classList.remove('status-warning');
                    indicator.classList.add('status-online');
                }
            }
        });
        
        // Update metrics randomly
        this.updateRandomMetrics();
    }

    updateRandomMetrics() {
        const metrics = document.querySelectorAll('.metric-value');
        metrics.forEach(metric => {
            if (Math.random() > 0.7) { // 30% chance of metric update
                const currentValue = parseInt(metric.textContent);
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                const newValue = Math.max(0, Math.min(100, currentValue + change));
                metric.textContent = newValue;
                
                // Update progress bars
                const progressBar = metric.closest('.metric-card').querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.width = `${newValue}%`;
                }
            }
        });
    }

    setupThemeDetection() {
        // Detect system theme preference
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const updateTheme = (e) => {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        };
        
        // Set initial theme
        updateTheme(darkModeMediaQuery);
        
        // Listen for theme changes
        darkModeMediaQuery.addListener(updateTheme);
    }

    setupAccessibility() {
        // Add ARIA labels to interactive elements
        const interactiveElements = document.querySelectorAll('button, a, [tabindex]');
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('aria-label')) {
                const text = element.textContent.trim() || element.getAttribute('title');
                if (text) {
                    element.setAttribute('aria-label', text);
                }
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Escape key closes modals (if any)
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Tab key navigation enhancement
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    closeAllModals() {
        // Close any open modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    handleTabNavigation(e) {
        // Ensure focus stays within modal if one is open
        const activeModal = document.querySelector('.modal[style*="display: block"]');
        if (activeModal) {
            const focusableElements = activeModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new MissionControlDashboard();
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MissionControlDashboard;
}