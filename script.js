// ==================== NAVEGAÇÃO RESPONSIVA ====================
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar-container')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// ==================== ANIMAÇÃO DE SCROLL ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('.tech-card, .project-card, .cert-card, .timeline-item, .contact-card')
    .forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });

// ==================== HEADER STICKY ====================
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        header.style.borderBottomColor = 'rgba(0, 255, 65, 0.2)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ==================== SUAVIZAÇÃO DE SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== EFEITO PARALAX SUAVE ====================
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero');
    const scrollPosition = window.scrollY;

    if (heroSection) {
        heroSection.style.backgroundPosition = `0 ${scrollPosition * 0.5}px`;
    }
});

// ==================== ANIMAÇÃO NÚMEROS ====================
const animateCounters = () => {
    const counters = document.querySelectorAll('.info-value');

    counters.forEach(counter => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                observer.unobserve(entry.target);
            }
        });

        observer.observe(counter);
    });
};

animateCounters();

// ==================== ADICIONAR CLASSE AO ROLE ====================
const addScrollClass = () => {
    const scrollDown = document.querySelector('.scroll-down');
    if (scrollDown) {
        if (window.scrollY > 100) {
            scrollDown.style.opacity = '0';
            scrollDown.style.pointerEvents = 'none';
        } else {
            scrollDown.style.opacity = '1';
            scrollDown.style.pointerEvents = 'auto';
        }
    }
};

window.addEventListener('scroll', addScrollClass);


// ==================== EFEITO HOVER NOS CARDS ====================
const cards = document.querySelectorAll('.tech-card, .project-card, .cert-card, .contact-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});


// ==================== LOADING SUAVE ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.querySelectorAll('[data-animate]').forEach(element => {
        element.classList.add('animate');
    });
});

// ==================== DETECTAR TEMA DO SISTEMA ====================
const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');

prefersColorScheme.addEventListener('change', (e) => {
    if (e.matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

// ==================== ADICIONAR ANIMAÇÃO DE ENTRADA NA PÁGINA ====================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ==================== FUNÇÃO PARA ANIMAR ELEMENTOS ====================
const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-scroll-animate]');

    elements.forEach(element => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        }, {
            threshold: 0.1
        });

        observer.observe(element);
    });
};

animateOnScroll();

// ==================== LOG PARA VERIFICAR CARREGAMENTO ====================
console.log('Portfolio carregado com sucesso! 🚀');
console.log('Desenvolvido com ❤️ por Bruno dos Anjos Santos');

// ==================== LÓGICA DO FORMULÁRIO DE CONTATO ====================
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Alterar estado do botão para carregamento
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            // Limpar status anterior
            formStatus.style.display = 'none';
            formStatus.className = 'form-status';
            formStatus.innerHTML = '';

            const formData = new FormData(contactForm);


            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.status === 200) {
                    formStatus.classList.add('success');
                    formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Mensagem enviada com sucesso! Entrarei em contato em breve. 🚀';
                    formStatus.style.display = 'flex';
                    contactForm.reset();
                } else {
                    formStatus.classList.add('error');
                    formStatus.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${data.message || 'Ocorreu um erro ao enviar.'}`;
                    formStatus.style.display = 'flex';
                }
            } catch (error) {
                formStatus.classList.add('error');
                formStatus.innerHTML = '<i class="fas fa-wifi"></i> Erro de rede. Verifique sua conexão e tente novamente.';
                formStatus.style.display = 'flex';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }
});

// ==================== MATRIX RAIN BACKGROUND ====================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    
    // Caracteres estilo Matrix
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
    const matrix = letters.split('');
    
    const fontSize = 16;
    let columns = canvas.width / fontSize;
    
    let drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        // Fundo translúcido para rastro do código
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff41'; // Verde Neon
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrix[Math.floor(Math.random() * matrix.length)];
            
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 33);
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        columns = canvas.width / fontSize;
        drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
    });
});

