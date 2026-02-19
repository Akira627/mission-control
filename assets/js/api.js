// mission-control/assets/js/api.js
// API functions for Mission Control Dashboard

class MissionControlAPI {
    constructor() {
        this.baseURLs = {
            projects: 'http://localhost:3001/api/projects',
            gatewayHealth: 'http://localhost:18789/api/health',
            secondBrain: 'http://localhost:3000',
            projectServer: 'http://localhost:3001',
            commandCenter: 'http://localhost:8081'
        };
        
        this.cache = {
            projects: null,
            subagents: null,
            systemHealth: null,
            lastLockIn: null,
            lastUpdated: null
        };
        
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
    }

    // Generic fetch with retry logic
    async fetchWithRetry(url, options = {}, retries = this.retryAttempts) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            if (retries > 0) {
                console.warn(`Retrying ${url}... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                return this.fetchWithRetry(url, options, retries - 1);
            }
            throw error;
        }
    }

    // API #1: Project Data
    async fetchProjects() {
        try {
            const response = await this.fetchWithRetry(`${this.baseURLs.projects}?action=list`);
            const data = await response.json();
            
            this.cache.projects = {
                data: data,
                timestamp: Date.now(),
                total: data.projects?.length || 0,
                active: data.projects?.filter(p => p.status === 'active' || p.status === 'in-progress').length || 0
            };
            
            return this.cache.projects;
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            return {
                error: 'Unable to fetch project data',
                total: 0,
                active: 0,
                timestamp: Date.now()
            };
        }
    }

    // API #2: Subagent Status (via OpenClaw)
    async fetchSubagents() {
        try {
            // In a real implementation, this would call OpenClaw's API
            // For now, we'll simulate with a mock response
            const mockSubagents = [
                { id: 'main', name: 'Main Agent', status: 'active', type: 'main' },
                { id: 'scout', name: 'Scout', status: 'active', type: 'research' },
                { id: 'architect', name: 'Architect', status: 'active', type: 'code' },
                { id: 'foreman', name: 'Foreman', status: 'idle', type: 'management' }
            ];
            
            this.cache.subagents = {
                data: mockSubagents,
                timestamp: Date.now(),
                total: mockSubagents.length,
                active: mockSubagents.filter(a => a.status === 'active').length
            };
            
            return this.cache.subagents;
        } catch (error) {
            console.error('Failed to fetch subagents:', error);
            return {
                error: 'Unable to fetch subagent data',
                total: 0,
                active: 0,
                timestamp: Date.now()
            };
        }
    }

    // API #3: System Health
    async checkSystemHealth() {
        const endpoints = [
            { name: 'Gateway', url: this.baseURLs.gatewayHealth },
            { name: '2nd Brain', url: this.baseURLs.secondBrain },
            { name: 'Project Server', url: this.baseURLs.projectServer },
            { name: 'Command Center', url: this.baseURLs.commandCenter }
        ];

        const healthChecks = await Promise.allSettled(
            endpoints.map(async (endpoint) => {
                try {
                    const startTime = Date.now();
                    const response = await fetch(endpoint.url, { method: 'HEAD' });
                    const latency = Date.now() - startTime;
                    
                    return {
                        name: endpoint.name,
                        url: endpoint.url,
                        status: response.ok ? 'healthy' : 'unhealthy',
                        latency: latency,
                        timestamp: Date.now()
                    };
                } catch (error) {
                    return {
                        name: endpoint.name,
                        url: endpoint.url,
                        status: 'down',
                        latency: null,
                        error: error.message,
                        timestamp: Date.now()
                    };
                }
            })
        );

        const results = healthChecks.map(check => check.value);
        const allHealthy = results.every(r => r.status === 'healthy');
        const anyDown = results.some(r => r.status === 'down');

        this.cache.systemHealth = {
            data: results,
            timestamp: Date.now(),
            overallStatus: allHealthy ? 'healthy' : anyDown ? 'critical' : 'warning',
            healthyCount: results.filter(r => r.status === 'healthy').length,
            totalCount: results.length
        };

        return this.cache.systemHealth;
    }

    // API #4: Last Lock In
    async fetchLastLockIn() {
        try {
            // In a real implementation, this would fetch from the OpenClaw API
            // For now, we'll use a mock response based on file system
            const response = await fetch('/api/last-lock-in'); // This endpoint would need to be created
            
            if (response.ok) {
                const data = await response.json();
                this.cache.lastLockIn = {
                    data: data,
                    timestamp: Date.now(),
                    lastTimestamp: data.timestamp
                };
                return this.cache.lastLockIn;
            }
            
            // Fallback: use most recent daily file
            const fallbackDate = this.getMostRecentDailyFile();
            this.cache.lastLockIn = {
                data: { timestamp: fallbackDate },
                timestamp: Date.now(),
                lastTimestamp: fallbackDate
            };
            
            return this.cache.lastLockIn;
        } catch (error) {
            console.error('Failed to fetch last lock-in:', error);
            
            // Ultimate fallback
            const fallbackDate = this.getMostRecentDailyFile();
            return {
                error: 'Using fallback data',
                lastTimestamp: fallbackDate,
                timestamp: Date.now()
            };
        }
    }

    // Helper: Get most recent daily file (fallback)
    getMostRecentDailyFile() {
        // This would be implemented server-side in a real app
        // For now, return current date minus 1 day as mock
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    // Fetch all data at once
    async fetchAllData() {
        try {
            const [projects, subagents, systemHealth, lastLockIn] = await Promise.allSettled([
                this.fetchProjects(),
                this.fetchSubagents(),
                this.checkSystemHealth(),
                this.fetchLastLockIn()
            ]);

            return {
                projects: projects.status === 'fulfilled' ? projects.value : { error: projects.reason?.message },
                subagents: subagents.status === 'fulfilled' ? subagents.value : { error: subagents.reason?.message },
                systemHealth: systemHealth.status === 'fulfilled' ? system.value : { error: systemHealth.reason?.message },
                lastLockIn: lastLockIn.status === 'fulfilled' ? lastLockIn.value : { error: lastLockIn.reason?.message },
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('Failed to fetch all data:', error);
            return {
                error: 'Failed to fetch dashboard data',
                timestamp: Date.now()
            };
        }
    }

    // Check if data is stale (older than 5 minutes)
    isDataStale(cacheKey, maxAge = 5 * 60 * 1000) {
        if (!this.cache[cacheKey] || !this.cache[cacheKey].timestamp) {
            return true;
        }
        return Date.now() - this.cache[cacheKey].timestamp > maxAge;
    }

    // Get cached data if not stale
    getCachedData(cacheKey, maxAge = 5 * 60 * 1000) {
        if (!this.isDataStale(cacheKey, maxAge)) {
            return this.cache[cacheKey];
        }
        return null;
    }
}

// Create global instance
window.MissionControlAPI = new MissionControlAPI();