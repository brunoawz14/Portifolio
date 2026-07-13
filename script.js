// ==================== RESPONSIVE NAVIGATION ====================
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar-container')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.tech-card, .project-card, .cert-card, .timeline-item, .contact-card, .stat-item')
    .forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });

// ==================== STICKY HEADER ====================
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==================== SMOOTH SCROLL ====================
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

// ==================== TYPING EFFECT ====================
document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const phrases = [
        'Desenvolvedor Back-End',
        'Java & Spring Boot',
        'Construindo APIs robustas',
        'Aprendendo sempre mais',
        'Back-End Developer',
        'REST APIs & Microservices'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isPaused) {
            setTimeout(type, 1500);
            isPaused = false;
            isDeleting = true;
            return;
        }

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 400);
                return;
            }
            setTimeout(type, 30);
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                isPaused = true;
                setTimeout(type, 50);
                return;
            }
            setTimeout(type, 70);
        }
    }

    setTimeout(type, 800);
});

// ==================== COUNTER ANIMATION ====================
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
};

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 40;
    const duration = 1500;
    const stepTime = duration / 40;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

animateCounters();

// ==================== TECH BAR ANIMATION ====================
const animateTechBars = () => {
    const bars = document.querySelectorAll('.tech-bar-fill');

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                entry.target.style.width = level + '%';
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(bar => barObserver.observe(bar));
};

animateTechBars();

// ==================== SCROLL DOWN INDICATOR ====================
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

// ==================== THEME DETECTION ====================
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const prefersLightScheme = window.matchMedia('(prefers-color-scheme: light)');

function setTheme(isLight) {
    if (isLight) {
        document.body.classList.add('light-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        localStorage.setItem('theme', 'dark');
    }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme === 'light');
} else {
    setTheme(prefersLightScheme.matches);
}

prefersLightScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches);
    }
});

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const isLight = !document.body.classList.contains('light-mode');
        setTheme(isLight);
    });
}

// ==================== CONTACT FORM ====================
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnContent = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

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
                    formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Mensagem enviada com sucesso!';
                    formStatus.style.display = 'flex';
                    contactForm.reset();
                } else {
                    formStatus.classList.add('error');
                    formStatus.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${data.message || 'Ocorreu um erro ao enviar.'}`;
                    formStatus.style.display = 'flex';
                }
            } catch (error) {
                formStatus.classList.add('error');
                formStatus.innerHTML = '<i class="fas fa-wifi"></i> Erro de rede. Verifique sua conexão.';
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

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
    const matrix = letters.split('');

    const fontSize = 14;
    let columns = canvas.width / fontSize;

    let drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff41';
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

    setInterval(draw, 40);

    window.addEventListener('resize', () => {
        resizeCanvas();
        columns = canvas.width / fontSize;
        drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
    });
});
