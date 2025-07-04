document.addEventListener('alpine:init', () => {
    Alpine.data('landingPageApp', () => ({
        showModal: false,
        form: {
            email: '',
            company: '',
            role: '',
        },
        stats: {
            waitlist: 2847,
            satisfaction: 94,
            productivity: 12,
        },

        init() {
            // Inicializa o sistema de lead scoring após o Alpine.js estar pronto
            this.initLeadScoring();
            
            // Inicia animações e efeitos
            this.$nextTick(() => {
                this.animateStats();
                this.initializeEffects();
            });
        },

        initLeadScoring() {
            if (typeof window.LeadScoringSystem === 'undefined') {
                console.warn('Lead Scoring System não está disponível');
                return;
            }

            try {
                window.leadScoring = new window.LeadScoringSystem({
                    debug: window.location.hostname === 'localhost',
                    apiEndpoint: '/api/leads'
                });

                // Configura listener para atualizações do lead scoring
                window.addEventListener('leadScoreUpdate', (event) => {
                    const { score, profile } = event.detail;
                    console.log(`Lead Score atualizado: ${score} (${profile})`);
                });

            } catch (error) {
                console.error('Erro ao inicializar Lead Scoring:', error);
            }

            // Inicia animações
            this.animateStats();
            this.initializeEffects();
        },

        requestAccess() {
            this.showModal = true;
            if (window.leadScoring) {
                window.leadScoring.trackCustomEvent('modal_opened', {
                    timestamp: new Date().toISOString()
                });
            }
        },

        async submitAccessRequest() {
            try {
                // Validação básica
                if (!this.form.email) {
                    throw new Error('Email é obrigatório');
                }

                // Integração com lead scoring
                if (window.leadScoring) {
                    window.leadScoring.identifyLead(this.form);
                    window.leadScoring.trackCustomEvent('access_requested', {
                        ...this.form,
                        timestamp: new Date().toISOString()
                    });
                }

                // Simulação de envio para API
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Atualiza estatísticas
                this.stats.waitlist++;

                // Feedback visual
                this.showSuccessMessage('Obrigado pelo interesse! Em breve entraremos em contato.');
                this.showModal = false;

                // Limpa formulário
                this.form = { email: '', company: '', role: '' };

            } catch (error) {
                this.showErrorMessage(error.message || 'Ocorreu um erro. Tente novamente.');
            }
        },

        showSuccessMessage(message) {
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-500 translate-y-0';
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.transform = 'translateY(150%)';
                setTimeout(() => toast.remove(), 500);
            }, 3000);
        },

        showErrorMessage(message) {
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg';
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => toast.remove(), 3000);
        },

        animateStats() {
            const animate = (el, target, duration = 2000) => {
                const start = parseInt(el.textContent);
                const increment = (target - start) / (duration / 16);
                let current = start;

                const update = () => {
                    current += increment;
                    el.textContent = Math.round(current);

                    if (increment > 0 ? current < target : current > target) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target;
                    }
                };

                requestAnimationFrame(update);
            };

            // Anima cada estatística
            const statElements = document.querySelectorAll('[x-text]');
            statElements.forEach(el => {
                const binding = el.getAttribute('x-text');
                if (binding.startsWith('stats.')) {
                    const key = binding.split('.')[1];
                    if (this.stats[key]) {
                        animate(el, this.stats[key]);
                    }
                }
            });
        },

        initializeEffects() {
            // Efeito de parallax suave no hero
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.hero-gradient');
                if (hero) {
                    hero.style.transform = `translateY(${scrolled * 0.4}px)`;
                }
            });

            // Animação do terminal
            const terminal = document.getElementById('terminal-demo');
            if (terminal) {
                let lines = terminal.innerHTML.split('\n');
                terminal.innerHTML = '';
                
                lines.forEach((line, i) => {
                    setTimeout(() => {
                        terminal.innerHTML += line + '\n';
                        terminal.scrollTop = terminal.scrollHeight;
                    }, i * 200);
                });
            }
        }
    }));
});

