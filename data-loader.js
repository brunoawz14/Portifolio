// ==================== DATA LOADER ====================
// Loads portfolio data from data.json and renders dynamic sections.
// Falls back to hardcoded HTML if data.json is unavailable.

(function () {
  const DATA_URL = 'data.json';
  let data = null;

  // Escape HTML para injecao segura em innerHTML
  function esc(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;'}[c]));
  }

  async function loadData() {
    // 1. Prioridade: localStorage (preenchido pelo admin.html)
    const stored = localStorage.getItem('portfolio-admin-data');
    if (stored) {
      try {
        data = JSON.parse(stored);
        if (window.Security) data = Security.sanitizeData(data);
        renderAll();
        return;
      } catch (e) { /* fall through */ }
    }

    // 2. Fallback: data.json do servidor
    try {
      const resp = await fetch(DATA_URL + '?t=' + Date.now());
      if (!resp.ok) throw new Error('data.json not found');
      data = await resp.json();
      if (window.Security) data = Security.sanitizeData(data);
      renderAll();
    } catch (e) {
      console.warn('data.json not available, using hardcoded content.');
    }
  }

  function renderAll() {
    if (!data) return;
    renderStats();
    renderTechnologies();
    renderProjects();
    renderCertifications();
    updateTypingPhrases();
    updateMetaTags();
  }

  // ---- STATS ----
  function renderStats() {
    const grid = document.querySelector('.stats-grid');
    if (!grid || !data.stats) return;

    grid.innerHTML = data.stats.map(s => `
      <div class="stat-item">
        <span class="stat-number" data-target="${parseInt(s.target) || 0}">0</span>
        ${s.suffix ? `<span class="stat-suffix">${esc(s.suffix)}</span>` : ''}
        <span class="stat-label">${esc(s.label)}</span>
        <span class="stat-detail">${esc(s.detail)}</span>
      </div>
    `).join('');

    reinitCounters();
  }

  // ---- TECHNOLOGIES ----
  function renderTechnologies() {
    const grid = document.querySelector('.technologies-grid');
    if (!grid || !data.technologies) return;

    grid.innerHTML = data.technologies.map(cat => `
      <div class="tech-category">
        <h3 class="category-title"><i class="${esc(cat.icon)}"></i> ${esc(cat.category)}</h3>
        <div class="tech-cards">
          ${cat.items.map(tech => `
            <div class="tech-card ${esc(tech.colorClass || 'tech-card')}">
              <div class="tech-icon-wrapper" style="${tech.color ? `background:${hexToRgba(tech.color, 0.1)};color:${esc(tech.color)};` : ''}">
                <i class="${esc(tech.icon)}"></i>
              </div>
              <div class="tech-info">
                <span class="tech-name">${esc(tech.name)}</span>
                <div class="tech-bar">
                  <div class="tech-bar-fill" data-level="${parseInt(tech.level) || 0}"></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    reinitTechBars();
    reinitScrollObserver();
  }

  // ---- PROJECTS ----
  function renderProjects() {
    const grid = document.querySelector('.projects-grid');
    if (!grid || !data.projects) return;

    grid.innerHTML = data.projects.map(p => `
      <div class="project-card">
        <div class="project-header">
          <div class="project-icon">
            <i class="${esc(p.icon)}"></i>
          </div>
          <div class="project-links">
            <a href="${esc(p.github)}" target="_blank" rel="noopener noreferrer" class="project-social" aria-label="GitHub">
              <i class="fab fa-github"></i>
            </a>
          </div>
        </div>
        <h3>${esc(p.title)}</h3>
        <p class="project-description">${esc(p.description)}</p>
        <div class="project-tech-stack">
          ${p.tags.map(t => `<span class="tech-tag">${esc(t)}</span>`).join('')}
        </div>
      </div>
    `).join('');

    reinitScrollObserver();
  }

  // ---- CERTIFICATIONS ----
  function renderCertifications() {
    const grid = document.querySelector('.certifications-grid');
    if (!grid || !data.certifications) return;

    grid.innerHTML = data.certifications.map(c => `
      <a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer" class="cert-card" title="Ver Certificado">
        <div class="cert-badge">
          <i class="fas fa-award"></i>
        </div>
        <div class="cert-content">
          <span class="cert-year">${esc(c.year)}</span>
          <h3>${esc(c.title)}</h3>
          <p class="cert-institution">${esc(c.institution)}</p>
          <p class="cert-description">${esc(c.hours)} de carga horaria</p>
        </div>
        <i class="fas fa-external-link-alt cert-arrow"></i>
      </a>
    `).join('');

    reinitScrollObserver();
  }

  // ---- TYPING PHRASES ----
  function updateTypingPhrases() {
    if (!data.typingPhrases || !data.typingPhrases.length) return;
    window._typingPhrases = data.typingPhrases;
  }

  // ---- META ----
  function updateMetaTags() {
    if (!data.profile) return;
    // Usar dados brutos (sem escapeHtml) para meta tags do browser
    const raw = window.Security ? Security.getRawData(data) : data;
    document.title = `${raw.profile.name} - ${raw.profile.role}`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', raw.profile.description);
  }

  // ---- HELPERS ----
  function hexToRgba(hex, alpha) {
    const clean = hex.replace(/[^#0-9a-fA-F]/g, '');
    if (clean.length < 7) return `rgba(0,255,65,${alpha})`;
    const r = parseInt(clean.slice(1, 3), 16);
    const g = parseInt(clean.slice(3, 5), 16);
    const b = parseInt(clean.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function reinitCounters() {
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
  }

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

  function reinitTechBars() {
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
  }

  function reinitScrollObserver() {
    const elements = document.querySelectorAll('.tech-card, .project-card, .cert-card, .timeline-item, .contact-card, .stat-item');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
    elements.forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  // ---- BOOT ----
  loadData();
})();
