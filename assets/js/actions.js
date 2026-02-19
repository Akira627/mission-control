// mission-control/assets/js/actions.js
// Quick action handlers for Mission Control Dashboard

class MissionControlActions {
    constructor() {
        this.api = window.MissionControlAPI;
        this.notificationSystem = window.dashboard?.showNotification || this.showFallbackNotification;
        this.initialize();
    }

    initialize() {
        this.setupActionButtons();
        this.setupConfirmationDialogs();
        this.setupLoadingStates();
    }

    setupActionButtons() {
        // Lock It In button
        const lockItInBtn = document.querySelector('[data-action="lock-it-in"]');
        if (lockItInBtn) {
            lockItInBtn.addEventListener('click', (e) => this.handleLockItIn(e));
        }

        // Quick Research button
        const researchBtn = document.querySelector('[data-action="quick-research"]');
        if (researchBtn) {
            researchBtn.addEventListener('click', (e) => this.handleQuickResearch(e));
        }

        // Code Task button
        const codeTaskBtn = document.querySelector('[data-action="code-task"]');
        if (codeTaskBtn) {
            codeTaskBtn.addEventListener('click', (e) => this.handleCodeTask(e));
        }

        // Emergency Kill button
        const emergencyKillBtn = document.querySelector('[data-action="emergency-kill"]');
        if (emergencyKillBtn) {
            emergencyKillBtn.addEventListener('click', (e) => this.handleEmergencyKill(e));
        }
    }

    setupConfirmationDialogs() {
        // This would integrate with a modal system in a real implementation
        console.log('Confirmation dialogs setup');
    }

    setupLoadingStates() {
        // Add loading state classes to action buttons
        const actionButtons = document.querySelectorAll('[data-action]');
        actionButtons.forEach(button => {
            button.classList.add('action-button');
            
            // Create loading spinner element
            const spinner = document.createElement('span');
            spinner.className = 'action-spinner hidden';
            spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.appendChild(spinner);
        });
    }

    // Action: Lock It In
    async handleLockItIn(event) {
        event.preventDefault();
        
        const button = event.currentTarget;
        this.setLoadingState(button, true);
        
        try {
            // In a real implementation, this would POST to the gateway API
            // or spawn a maintenance agent
            const response = await this.simulateAPICall('/api/lock-it-in', {
                method: 'POST',
                body: JSON.stringify({ action: 'lock_it_in' })
            });
            
            if (response.success) {
                this.showNotification('Lock It In triggered successfully!', 'success');
                
                // Update last lock-in display
                this.updateLastLockInDisplay();
            } else {
                throw new Error(response.error || 'Failed to trigger Lock It In');
            }
        } catch (error) {
            console.error('Lock It In failed:', error);
            this.showNotification(`Failed: ${error.message}`, 'error');
        } finally {
            this.setLoadingState(button, false);
        }
    }

    // Action: Quick Research
    async handleQuickResearch(event) {
        event.preventDefault();
        
        const button = event.currentTarget;
        this.setLoadingState(button, true);
        
        try {
            // Simulate spawning a scout agent
            const response = await this.simulateAPICall('/api/spawn-agent', {
                method: 'POST',
                body: JSON.stringify({
                    agentId: 'scout',
                    task: 'Quick research task',
                    priority: 'medium'
                })
            });
            
            if (response.success) {
                this.showNotification('Scout agent spawned for research!', 'success');
                
                // Update subagents display
                setTimeout(() => {
                    if (window.dashboard?.refreshDashboardData) {
                        window.dashboard.refreshDashboardData();
                    }
                }, 1000);
            } else {
                throw new Error(response.error || 'Failed to spawn scout agent');
            }
        } catch (error) {
            console.error('Quick Research failed:', error);
            this.showNotification(`Failed: ${error.message}`, 'error');
        } finally {
            this.setLoadingState(button, false);
        }
    }

    // Action: Code Task
    async handleCodeTask(event) {
        event.preventDefault();
        
        const button = event.currentTarget;
        this.setLoadingState(button, true);
        
        try {
            // Simulate spawning an architect agent
            const response = await this.simulateAPICall('/api/spawn-agent', {
                method: 'POST',
                body: JSON.stringify({
                    agentId: 'architect',
                    task: 'New coding task',
                    priority: 'high'
                })
            });
            
            if (response.success) {
                this.showNotification('Architect agent spawned for coding task!', 'success');
                
                // Update subagents display
                setTimeout(() => {
                    if (window.dashboard?.refreshDashboardData) {
                        window.dashboard.refreshDashboardData();
                    }
                }, 1000);
            } else {
                throw new Error(response.error || 'Failed to spawn architect agent');
            }
        } catch (error) {
            console.error('Code Task failed:', error);
            this.showNotification(`Failed: ${error.message}`, 'error');
        } finally {
            this.setLoadingState(button, false);
        }
    }

    // Action: Emergency Kill
    async handleEmergencyKill(event) {
        event.preventDefault();
        
        // Show confirmation dialog
        if (!confirm('⚠️ EMERGENCY KILL\n\nAre you sure you want to kill all stuck agents?\n\nThis action cannot be undone.')) {
            return;
        }
        
        const button = event.currentTarget;
        this.setLoadingState(button, true);
        
        try {
            // Simulate killing all subagents
            const response = await this.simulateAPICall('/api/kill-agents', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'kill_all',
                    force: true
                })
            });
            
            if (response.success) {
                this.showNotification('All stuck agents killed!', 'warning');
                
                // Update dashboard immediately
                setTimeout(() => {
                    if (window.dashboard?.refreshDashboardData) {
                        window.dashboard.refreshDashboardData();
                    }
                }, 500);
            } else {
                throw new Error(response.error || 'Failed to kill agents');
            }
        } catch (error) {
            console.error('Emergency Kill failed:', error);
            this.showNotification(`Failed: ${error.message}`, 'error');
        } finally {
            this.setLoadingState(button, false);
        }
    }

    // Helper: Set loading state on button
    setLoadingState(button, isLoading) {
        const spinner = button.querySelector('.action-spinner');
        const icon = button.querySelector('.action-icon');
        const text = button.querySelector('.action-text');
        
        if (isLoading) {
            button.disabled = true;
            button.classList.add('opacity-50', 'cursor-not-allowed');
            if (spinner) spinner.classList.remove('hidden');
            if (icon) icon.classList.add('hidden');
            if (text) text.textContent = 'Processing...';
        } else {
            button.disabled = false;
            button.classList.remove('opacity-50', 'cursor-not-allowed');
            if (spinner) spinner.classList.add('hidden');
            if (icon) icon.classList.remove('hidden');
            if (text) text.textContent = button.dataset.originalText || button.textContent;
        }
    }

    // Helper: Simulate API call (for demo)
    async simulateAPICall(url, options) {
        console.log(`Simulating API call to ${url}`, options);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
        
        // Simulate success 90% of the time
        const success = Math.random() > 0.1;
        
        if (success) {
            return {
                success: true,
                message: 'Action completed successfully',
                timestamp: new Date().toISOString()
            };
        } else {
            throw new Error('Simulated API failure - please try again');
        }
    }

    // Helper: Update last lock-in display
    updateLastLockInDisplay() {
        const lastLockInElement = document.querySelector('#last-lock-in-time');
        if (lastLockInElement) {
            const now = new Date();
            lastLockInElement.textContent = now.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
            lastLockInElement.parentElement.classList.remove('text-gray-400');
            lastLockInElement.parentElement.classList.add('text-green-400');
        }
    }

    // Helper: Show notification
    showNotification(message, type = 'info') {
        if (this.notificationSystem && typeof this.notificationSystem === 'function') {
            this.notificationSystem(message, type);
        } else {
            this.showFallbackNotification(message, type);
        }
    }

    // Fallback notification system
    showFallbackNotification(message, type = 'info') {
        const types = {
            info: { bg: 'bg-blue-500', icon: 'ℹ️' },
            success: { bg: 'bg-green-500', icon: '✅' },
            warning: { bg: 'bg-yellow-500', icon: '⚠️' },
            error: { bg: 'bg-red-500', icon: '❌' }
        };
        
        const config = types[type] || types.info;
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 ${config.bg} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm transform transition-transform duration-300 translate-x-full`;
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">${config.icon}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
            notification.classList.add('translate-x-0');
        }, 10);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('translate-x-0');
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.classList.remove('translate-x-0');
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.MissionControlActions = new MissionControlActions();
});