/**
 * GitHub Agent v2.0 - Lead Scoring System
 * Tracks user behavior and calculates lead scores in real-time
 */

class LeadScoringSystem {
    constructor(config = {}) {
        this.config = {
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
            apiEndpoint: config.apiEndpoint || '/api/leads',
            debug: config.debug || false,
            ...config
        };
        
        this.leadData = {
            sessionId: this.generateSessionId(),
            visitorId: this.getOrCreateVisitorId(),
            score: 0,
            profile: 'unknown',
            events: [],
            metadata: {
                firstVisit: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                pageViews: 0,
                timeOnPage: 0,
                source: this.getTrafficSource(),
                device: this.getDeviceInfo()
            }
        };
        
        this.scoreRules = {
            // Page engagement scores
            visitedPricing: 20,
            watchedDemo: 30,
            downloadedWhitepaper: 40,
            requestedDemo: 50,
            requestedEnterprise: 60,
            githubConnected: 80,
            
            // Time-based scoring
            timeOnPage: {
                '30s': 5,
                '1m': 10,
                '2m': 15,
                '5m': 25
            },
            
            // Interaction scoring
            scrollDepth: {
                '25%': 2,
                '50%': 5,
                '75%': 8,
                '100%': 12
            },
            
            // Form engagement
            emailProvided: 15,
            companyProvided: 10,
            roleProvided: 8,
            phoneProvided: 20,
            
            // Technology indicators
            techDomain: 15, // .io, .dev, github.com email
            enterprise: 25  // Company size indicators
        };
        
        this.profiles = {
            hot: { min: 80, color: '#ef4444', priority: 'high' },
            warm: { min: 50, color: '#f97316', priority: 'medium' },
            cold: { min: 20, color: '#3b82f6', priority: 'low' },
            unknown: { min: 0, color: '#6b7280', priority: 'low' }
        };
        
        this.emailSequences = {
            developer: {
                triggers: ['visited_pricing', 'watched_demo'],
                emails: [
                    { delay: 0, template: 'welcome_developer', subject: 'Welcome to GitHub Agent v2.0' },
                    { delay: 3, template: 'technical_deep_dive', subject: 'Under the Hood: How AI Powers 10x Speed' },
                    { delay: 7, template: 'performance_comparison', subject: 'See Why Developers Choose Agent v2.0' },
                    { delay: 14, template: 'early_access_offer', subject: 'Your Early Access Invitation' }
                ]
            },
            enterprise: {
                triggers: ['requested_enterprise', 'company_provided'],
                emails: [
                    { delay: 0, template: 'roi_calculator', subject: 'Calculate Your ROI with GitHub Agent' },
                    { delay: 2, template: 'case_study', subject: 'How TechCorp Reduced Deploy Time by 85%' },
                    { delay: 5, template: 'schedule_call', subject: 'Ready for a Technical Discussion?' },
                    { delay: 10, template: 'pilot_program', subject: 'Exclusive 30-Day Pilot Program' }
                ]
            },
            manager: {
                triggers: ['role_tech_lead', 'role_cto'],
                emails: [
                    { delay: 0, template: 'team_productivity', subject: 'Boost Your Team\'s Productivity by 12x' },
                    { delay: 3, template: 'team_case_study', subject: 'Real Results from Development Teams' },
                    { delay: 7, template: 'team_demo', subject: 'See Team Features in Action' },
                    { delay: 14, template: 'team_trial', subject: 'Start Your Team Trial Today' }
                ]
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadExistingData();
        this.setupEventTracking();
        this.startSessionTracking();
        this.trackPageView();
        
        if (this.config.debug) {
            console.log('Lead Scoring System initialized:', this.leadData);
        }
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getOrCreateVisitorId() {
        let visitorId = localStorage.getItem('gh_agent_visitor_id');
        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('gh_agent_visitor_id', visitorId);
        }
        return visitorId;
    }
    
    getTrafficSource() {
        const urlParams = new URLSearchParams(window.location.search);
        const referrer = document.referrer;
        
        // UTM parameters
        if (urlParams.get('utm_source')) {
            return {
                source: urlParams.get('utm_source'),
                medium: urlParams.get('utm_medium'),
                campaign: urlParams.get('utm_campaign'),
                content: urlParams.get('utm_content')
            };
        }
        
        // Referrer analysis
        if (referrer) {
            if (referrer.includes('google.com')) return { source: 'google', medium: 'organic' };
            if (referrer.includes('github.com')) return { source: 'github', medium: 'referral' };
            if (referrer.includes('twitter.com')) return { source: 'twitter', medium: 'social' };
            if (referrer.includes('linkedin.com')) return { source: 'linkedin', medium: 'social' };
            return { source: 'referral', medium: 'referral', referrer };
        }
        
        return { source: 'direct', medium: 'none' };
    }
    
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        };
    }
    
    loadExistingData() {
        const stored = localStorage.getItem('gh_agent_lead_data');
        if (stored) {
            const parsedData = JSON.parse(stored);
            this.leadData = { ...this.leadData, ...parsedData };
            this.leadData.sessionId = this.generateSessionId(); // New session
        }
    }
    
    saveData() {
        localStorage.setItem('gh_agent_lead_data', JSON.stringify(this.leadData));
    }
    
    setupEventTracking() {
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.trackScrollDepth(scrollPercent);
            }
        });
        
        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-track]');
            if (target) {
                const eventType = target.getAttribute('data-track');
                this.trackEvent(eventType, { element: target.tagName, text: target.textContent?.slice(0, 50) });
            }
        });
        
        // Track form interactions
        document.addEventListener('input', (e) => {
            if (e.target.type === 'email' && e.target.value.includes('@')) {
                this.trackEvent('email_provided', { email: e.target.value });
            }
        });
        
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('page_hidden', { timeOnPage: this.getTimeOnPage() });
            } else {
                this.trackEvent('page_visible', {});
            }
        });
    }
    
    startSessionTracking() {
        this.sessionStartTime = Date.now();
        
        // Update time on page every 30 seconds
        this.timeTracker = setInterval(() => {
            this.leadData.metadata.timeOnPage = this.getTimeOnPage();
            this.leadData.metadata.lastActivity = new Date().toISOString();
            this.checkTimeBasedScoring();
            this.saveData();
        }, 30000);
        
        // Track session end
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session_end', { 
                totalTime: this.getTimeOnPage(),
                score: this.leadData.score 
            });
            this.sendToServer();
        });
    }
    
    getTimeOnPage() {
        return Math.floor((Date.now() - this.sessionStartTime) / 1000);
    }
    
    trackPageView() {
        this.leadData.metadata.pageViews++;
        this.trackEvent('page_view', { 
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString()
        });
    }
    
    trackEvent(eventType, data = {}) {
        const event = {
            type: eventType,
            timestamp: new Date().toISOString(),
            data,
            score: this.calculateEventScore(eventType, data)
        };
        
        this.leadData.events.push(event);
        this.leadData.score += event.score;
        this.leadData.metadata.lastActivity = event.timestamp;
        
        // Update profile based on new score
        this.updateProfile();
        
        // Check for email sequence triggers
        this.checkEmailTriggers(eventType, data);
        
        // Save to localStorage
        this.saveData();
        
        // Send high-value events immediately
        if (event.score >= 30) {
            this.sendToServer();
        }
        
        if (this.config.debug) {
            console.log('Event tracked:', event, 'Total score:', this.leadData.score);
        }
        
        // Dispatch custom event for real-time UI updates
        window.dispatchEvent(new CustomEvent('leadScoreUpdate', { 
            detail: { 
                score: this.leadData.score, 
                profile: this.leadData.profile,
                event: event
            }
        }));
    }
    
    calculateEventScore(eventType, data) {
        // Direct score mappings
        if (this.scoreRules[eventType]) {
            return this.scoreRules[eventType];
        }
        
        // Email domain scoring
        if (eventType === 'email_provided' && data.email) {
            const domain = data.email.split('@')[1];
            if (['gmail.com', 'yahoo.com', 'hotmail.com'].includes(domain)) {
                return this.scoreRules.emailProvided;
            }
            if (domain.endsWith('.io') || domain.endsWith('.dev') || domain.includes('github')) {
                return this.scoreRules.emailProvided + this.scoreRules.techDomain;
            }
            return this.scoreRules.emailProvided + this.scoreRules.enterprise;
        }
        
        // Company size detection
        if (eventType === 'company_provided' && data.company) {
            const company = data.company.toLowerCase();
            const enterpriseKeywords = ['corp', 'inc', 'ltd', 'llc', 'technologies', 'systems', 'solutions'];
            if (enterpriseKeywords.some(keyword => company.includes(keyword))) {
                return this.scoreRules.companyProvided + this.scoreRules.enterprise;
            }
            return this.scoreRules.companyProvided;
        }
        
        return 0;
    }
    
    trackScrollDepth(percent) {
        const thresholds = [25, 50, 75, 100];
        const threshold = thresholds.find(t => percent >= t && !this.leadData.events.some(e => e.type === `scroll_${t}`));
        
        if (threshold) {
            this.trackEvent(`scroll_${threshold}`, { scrollPercent: percent });
        }
    }
    
    checkTimeBasedScoring() {
        const timeOnPage = this.getTimeOnPage();
        const timeThresholds = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
        
        timeThresholds.forEach(threshold => {
            if (timeOnPage >= threshold && !this.leadData.events.some(e => e.type === `time_${threshold}s`)) {
                const scoreKey = threshold < 60 ? `${threshold}s` : `${Math.floor(threshold/60)}m`;
                const score = this.scoreRules.timeOnPage[scoreKey] || 0;
                
                this.trackEvent(`time_${threshold}s`, { 
                    timeOnPage: timeOnPage,
                    threshold: threshold 
                });
            }
        });
    }
    
    updateProfile() {
        const score = this.leadData.score;
        
        if (score >= this.profiles.hot.min) {
            this.leadData.profile = 'hot';
        } else if (score >= this.profiles.warm.min) {
            this.leadData.profile = 'warm';
        } else if (score >= this.profiles.cold.min) {
            this.leadData.profile = 'cold';
        } else {
            this.leadData.profile = 'unknown';
        }
    }
    
    checkEmailTriggers(eventType, data) {
        Object.entries(this.emailSequences).forEach(([sequenceType, sequence]) => {
            if (sequence.triggers.includes(eventType)) {
                this.triggerEmailSequence(sequenceType, data);
            }
        });
        
        // Role-based triggers
        if (eventType === 'role_provided' && data.role) {
            if (['tech-lead', 'cto'].includes(data.role)) {
                this.triggerEmailSequence('manager', data);
            } else if (data.role === 'developer') {
                this.triggerEmailSequence('developer', data);
            }
        }
    }
    
    triggerEmailSequence(sequenceType, data) {
        const sequence = this.emailSequences[sequenceType];
        if (!sequence) return;
        
        // Check if already triggered
        const alreadyTriggered = this.leadData.events.some(e => 
            e.type === 'email_sequence_triggered' && e.data.sequenceType === sequenceType
        );
        
        if (!alreadyTriggered) {
            this.trackEvent('email_sequence_triggered', { 
                sequenceType, 
                triggerEvent: data,
                emailCount: sequence.emails.length 
            });
            
            // Schedule emails (in real implementation, this would call your email service)
            sequence.emails.forEach(email => {
                setTimeout(() => {
                    this.sendEmail(email, this.leadData);
                }, email.delay * 24 * 60 * 60 * 1000); // Convert days to milliseconds
            });
        }
    }
    
    sendEmail(emailConfig, leadData) {
        // Mock email sending - replace with actual email service
        if (this.config.debug) {
            console.log('Sending email:', emailConfig, 'to:', leadData.visitorId);
        }
        
        this.trackEvent('email_sent', {
            template: emailConfig.template,
            subject: emailConfig.subject,
            delay: emailConfig.delay
        });
    }
    
    // Public API methods
    identifyLead(userData) {
        Object.assign(this.leadData.metadata, userData);
        
        if (userData.email) {
            this.trackEvent('email_provided', { email: userData.email });
        }
        if (userData.company) {
            this.trackEvent('company_provided', { company: userData.company });
        }
        if (userData.role) {
            this.trackEvent('role_provided', { role: userData.role });
        }
    }
    
    trackCustomEvent(eventType, data = {}) {
        this.trackEvent(eventType, data);
    }
    
    getLeadScore() {
        return {
            score: this.leadData.score,
            profile: this.leadData.profile,
            profileConfig: this.profiles[this.leadData.profile],
            events: this.leadData.events.length,
            timeOnPage: this.getTimeOnPage()
        };
    }
    
    sendToServer() {
        if (!this.config.apiEndpoint) return;
        
        fetch(this.config.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...this.leadData,
                timeOnPage: this.getTimeOnPage()
            })
        }).catch(error => {
            if (this.config.debug) {
                console.error('Failed to send lead data:', error);
            }
        });
    }
    
    // Analytics integration helpers
    integrateWithGA4() {
        if (typeof gtag !== 'undefined') {
            // Set custom dimensions
            gtag('config', 'GA_MEASUREMENT_ID', {
                custom_map: {
                    dimension1: 'lead_score',
                    dimension2: 'lead_profile'
                }
            });
            
            // Send lead score as custom event
            gtag('event', 'lead_score_update', {
                lead_score: this.leadData.score,
                lead_profile: this.leadData.profile,
                visitor_id: this.leadData.visitorId
            });
        }
    }
    
    integrateWithMixpanel() {
        if (typeof mixpanel !== 'undefined') {
            mixpanel.identify(this.leadData.visitorId);
            mixpanel.people.set({
                'Lead Score': this.leadData.score,
                'Lead Profile': this.leadData.profile,
                'Events Count': this.leadData.events.length,
                'Time on Page': this.getTimeOnPage()
            });
        }
    }
    
    // Debug and administration
    getDebugInfo() {
        return {
            leadData: this.leadData,
            timeOnPage: this.getTimeOnPage(),
            sessionAge: Date.now() - this.sessionStartTime,
            scoreBreakdown: this.getScoreBreakdown()
        };
    }
    
    getScoreBreakdown() {
        const breakdown = {};
        this.leadData.events.forEach(event => {
            breakdown[event.type] = (breakdown[event.type] || 0) + event.score;
        });
        return breakdown;
    }
    
    reset() {
        localStorage.removeItem('gh_agent_lead_data');
        localStorage.removeItem('gh_agent_visitor_id');
        location.reload();
    }
}

// Auto-initialize if not manually initialized
if (typeof window !== 'undefined') {
    window.LeadScoringSystem = LeadScoringSystem;
    
    // Auto-start with default config
    window.leadScoring = new LeadScoringSystem({
        debug: window.location.hostname === 'localhost'
    });
    
    // Expose global tracking function
    window.trackLead = (event, data) => window.leadScoring.trackCustomEvent(event, data);
}

export default LeadScoringSystem;

