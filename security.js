// ==================== SECURITY UTILITIES ====================

const Security = {
  // Escapa HTML para prevenir XSS
  escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;' };
    return str.replace(/[&<>"'/]/g, c => map[c]);
  },

  // Valida URL — só permite http/https
  isValidUrl(url) {
    if (typeof url !== 'string') return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  },

  // Valida email
  isValidEmail(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // Limita tamanho de string
  clamp(str, maxLen) {
    if (typeof str !== 'string') return '';
    return str.substring(0, maxLen);
  },

  // Sanitiza dados carregados do localStorage/data.json
  sanitizeData(data) {
    if (!data || typeof data !== 'object') return null;

    const s = (str, max) => this.clamp(this.escapeHtml(str), max || 200);

    // Profile
    if (data.profile) {
      data.profile.name = s(data.profile.name, 100);
      data.profile.shortName = s(data.profile.shortName, 30);
      data.profile.role = s(data.profile.role, 80);
      data.profile.description = s(data.profile.description, 500);
      data.profile.roleEn = s(data.profile.roleEn || '', 80);
      if (Array.isArray(data.profile.about)) {
        data.profile.about = data.profile.about.map(p => s(p, 500));
      }
      if (data.profile.info) {
        data.profile.info.age = s(data.profile.info.age, 20);
        data.profile.info.education = s(data.profile.info.education, 100);
        data.profile.info.specialization = s(data.profile.info.specialization, 100);
        data.profile.info.status = s(data.profile.info.status, 100);
      }
      if (data.profile.social) {
        data.profile.social.github = this.isValidUrl(data.profile.social.github) ? data.profile.social.github : '#';
        data.profile.social.linkedin = this.isValidUrl(data.profile.social.linkedin) ? data.profile.social.linkedin : '#';
        data.profile.social.email = this.isValidEmail(data.profile.social.email) ? data.profile.social.email : '';
      }
    }

    // Stats
    if (Array.isArray(data.stats)) {
      data.stats = data.stats.map(st => ({
        label: s(st.label, 30),
        target: parseInt(st.target) || 0,
        detail: s(st.detail, 50),
        suffix: s(st.suffix, 10)
      }));
    }

    // Technologies
    if (Array.isArray(data.technologies)) {
      data.technologies.forEach(cat => {
        cat.category = s(cat.category, 40);
        cat.icon = s(cat.icon, 50);
        if (Array.isArray(cat.items)) {
          cat.items.forEach(tech => {
            tech.name = s(tech.name, 50);
            tech.icon = s(tech.icon, 50);
            tech.colorClass = s(tech.colorClass, 30);
            tech.color = /^#[0-9a-fA-F]{3,8}$/.test(tech.color) ? tech.color : '#00ff41';
            tech.level = Math.min(100, Math.max(0, parseInt(tech.level) || 0));
          });
        }
      });
    }

    // Projects
    if (Array.isArray(data.projects)) {
      data.projects.forEach(p => {
        p.title = s(p.title, 100);
        p.description = s(p.description, 500);
        p.icon = s(p.icon, 50);
        p.github = this.isValidUrl(p.github) ? p.github : '#';
        if (Array.isArray(p.tags)) {
          p.tags = p.tags.map(t => s(t, 30));
        }
      });
    }

    // Certifications
    if (Array.isArray(data.certifications)) {
      data.certifications.forEach(c => {
        c.title = s(c.title, 150);
        c.institution = s(c.institution, 80);
        c.year = s(c.year, 10);
        c.hours = s(c.hours, 20);
        c.url = this.isValidUrl(c.url) ? c.url : '#';
      });
    }

    // Education
    if (Array.isArray(data.education)) {
      data.education.forEach(e => {
        e.title = s(e.title, 150);
        e.institution = s(e.institution, 100);
        e.year = s(e.year, 40);
        e.description = s(e.description, 500);
      });
    }

    // Typing phrases
    if (Array.isArray(data.typingPhrases)) {
      data.typingPhrases = data.typingPhrases.map(p => s(p, 80));
    }

    return data;
  },

  // Gera um token simples para o admin
  generateToken() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  },

  // Valida hash com timing-safe comparison
  timingSafeEqual(a, b) {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
};

// Disponibilizar globalmente
window.Security = Security;
