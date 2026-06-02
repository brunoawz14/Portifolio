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
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

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
    const scrollPosition = window.pageYOffset;

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
        if (window.pageYOffset > 100) {
            scrollDown.style.opacity = '0';
            scrollDown.style.pointerEvents = 'none';
        } else {
            scrollDown.style.opacity = '1';
            scrollDown.style.pointerEvents = 'auto';
        }
    }
};

window.addEventListener('scroll', addScrollClass);

// ==================== VALIDAÇÃO DE LINKS ====================
document.querySelectorAll('.nav-link, .project-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        // Se o link começa com #, deixar o navegador lidar
        if (!href.startsWith('#') && !href.startsWith('http') && href !== '#') {
            // Aqui você pode adicionar tratamento para links internos
        }
    });
});

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

// ==================== ATUALIZAR LINKS DINÂMICOS ====================
const updateDynamicLinks = () => {
    // Atualizar links do GitHub
    const githubLinks = document.querySelectorAll('a[href="https://github.com"]');
    githubLinks.forEach(link => {
        link.href = 'https://github.com/seuusuario'; // Substituir com seu usuário do GitHub
    });

    // Atualizar links do LinkedIn
    const linkedinLinks = document.querySelectorAll('a[href="https://linkedin.com"]');
    linkedinLinks.forEach(link => {
        link.href = 'https://linkedin.com/in/seu-perfil'; // Substituir com seu perfil do LinkedIn
    });

    // Atualizar email
    const emailLinks = document.querySelectorAll('a[href="mailto:seu.email@gmail.com"]');
    emailLinks.forEach(link => {
        link.href = 'mailto:seu.email@seu-provedor.com'; // Substituir com seu email
    });
};

updateDynamicLinks();

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
