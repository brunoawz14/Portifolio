// ==================== ADMIN PANEL LOGIC ====================

// ==================== CONFIGURAÇÃO DE SENHA ====================
// Hash SHA-256 com salt. A senha NUNCA fica no código.
// Para gerar o hash da sua senha, abra o console (F12) e digite: sha256Prompt()
const ADMIN_SALT = 'b4uno_p0rtf0l10_2026';
const ADMIN_PASSWORD_HASH = '29b523a8a82d25f43dbe346fb83ca014d27c070c80fac1042d056f0fc01eb230';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos
let data = null;
let adminPassword = null; // Senha em memoria apenas — nao fica em storage

// Hash SHA-256 com salt
async function sha256(message) {
  const salted = ADMIN_SALT + message;
  const msgBuffer = new TextEncoder().encode(salted);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Gera o hash da senha que você quiser (use no console: sha256Prompt())
window.sha256Prompt = async function () {
  const pass = prompt('Digite a senha para gerar o hash:');
  if (!pass) return;
  const hash = await sha256(pass);
  console.log('%c Hash da sua senha: ', 'background:#00ff41;color:#000;font-weight:bold;padding:4px 8px;border-radius:4px;');
  console.log(hash);
  alert('Hash gerado! Copie do console (F12) e cole no admin.js:\n\n1. Variável ADMIN_PASSWORD_HASH\n2. Se mudar o salt, atualize ADMIN_SALT também\n\nHash: ' + hash);
};

function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-message').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function updateCounts() {
  let techCount = 0;
  data.technologies.forEach(cat => techCount += cat.items.length);
  document.getElementById('tech-count').textContent = techCount;
  document.getElementById('cert-count').textContent = data.certifications.length;
  document.getElementById('project-count').textContent = data.projects.length;
}

function generateColorClass(name) {
  const n = name.toLowerCase().replace(/[^a-z]/g, '');
  const known = { html: 'html-card', css: 'css-card', javascript: 'java-card', java: 'java-card', spring: 'spring-card', springboot: 'spring-card', maui: 'maui-card', sql: 'sql-card', php: 'php-card', dotnet: 'maui-card', csharp: 'maui-card' };
  for (const [key, cls] of Object.entries(known)) {
    if (n.includes(key)) return cls;
  }
  return 'tech-card';
}

function getIconMap() {
  return {
    'html': 'fab fa-html5', 'css': 'fab fa-css3-alt', 'javascript': 'fab fa-js',
    'java': 'fab fa-java', 'spring': 'fas fa-leaf', 'springboot': 'fas fa-leaf',
    'php': 'fab fa-php', 'sql': 'fas fa-database', 'python': 'fab fa-python',
    'react': 'fab fa-react', 'vue': 'fab fa-vuejs', 'angular': 'fab fa-angular',
    'node': 'fab fa-node-js', 'dotnet': 'fab fa-microsoft', 'csharp': 'fab fa-microsoft',
    'maui': 'fab fa-microsoft', 'docker': 'fab fa-docker', 'git': 'fab fa-git-alt',
    'github': 'fab fa-github', 'linux': 'fab fa-linux', 'aws': 'fab fa-aws',
    'figma': 'fab fa-figma', 'typescript': 'fab fa-js', 'sass': 'fab fa-sass',
    'flutter': 'fab fa-flutter', 'swift': 'fab fa-swift', 'kotlin': 'fab fa-android',
    'rust': 'fab fa-rust', 'go': 'fab fa-golang', 'ruby': 'fab fa-ruby',
    'postgres': 'fas fa-database', 'mysql': 'fas fa-database', 'mongodb': 'fas fa-database',
    'redis': 'fas fa-database', 'graphql': 'fas fa-project-diagram',
    'rest': 'fas fa-plug', 'api': 'fas fa-plug', 'swagger': 'fas fa-file-alt',
    'junit': 'fas fa-flask', 'maven': 'fas fa-cogs', 'gradle': 'fas fa-cogs',
    'vscode': 'fab fa-microsoft', 'intellij': 'fas fa-code',
    'kubernetes': 'fas fa-dharmachakra', 'k8s': 'fas fa-dharmachakra',
    'nginx': 'fas fa-server', 'terraform': 'fas fa-cloud', 'azure': 'fab fa-microsoft',
    'gcp': 'fab fa-google', 'firebase': 'fas fa-fire', 'supabase': 'fas fa-database'
  };
}

function autoDetectIcon(name) {
  const n = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const map = getIconMap();
  for (const [key, icon] of Object.entries(map)) {
    if (n.includes(key)) return icon;
  }
  return 'fas fa-code';
}

function autoDetectColor(name) {
  const n = name.toLowerCase().replace(/[^a-z]/g, '');
  const colors = {
    html: '#e34f26', css: '#1572b6', javascript: '#f7df1e', typescript: '#3178c6',
    java: '#ed8b00', spring: '#6db33f', springboot: '#6db33f', php: '#777bb4',
    python: '#3776ab', react: '#61dafb', vue: '#42b883', angular: '#dd0031',
    node: '#339933', dotnet: '#512bd4', csharp: '#512bd4', maui: '#512bd4',
    docker: '#2496ed', git: '#f05032', sql: '#336791', postgres: '#336791',
    mysql: '#4479a1', mongodb: '#47a248', redis: '#dc382d', ruby: '#cc342d',
    rust: '#dea584', go: '#00add8', swift: '#f05138', kotlin: '#7f52ff',
    flutter: '#02569b', sass: '#cc6699', figma: '#f24e1e', linux: '#fcc624',
    azure: '#0089d6', aws: '#ff9900', gcp: '#4285f4', firebase: '#ffca28',
    nginx: '#009639', graphql: '#e10098', kubernetes: '#326ce5', k8s: '#326ce5',
    terraform: '#7b42bc', jinja: '#b41717', jest: '#c21325', selenium: '#43b02a',
    swagger: '#85ea2d', postman: '#ff6c37', vscode: '#007acc', intellij: '#fe315d'
  };
  for (const [key, color] of Object.entries(colors)) {
    if (n.includes(key)) return color;
  }
  return '#00ff41';
}

// ==================== RENDER ====================
const esc = (s) => window.Security ? Security.escapeHtml(s) : s;

function renderTechList() {
  const list = document.getElementById('tech-list');
  let html = '';
  data.technologies.forEach((cat, catIdx) => {
    cat.items.forEach((tech, techIdx) => {
      html += `
        <div class="item-card">
          <div class="item-info">
            <h4><i class="${esc(tech.icon)}" style="color:${esc(tech.color)};margin-right:8px;"></i> ${esc(tech.name)}</h4>
            <p>${esc(cat.category)} — Nível: ${tech.level}%</p>
          </div>
          <div class="item-meta">
            <span class="item-badge">${tech.level}%</span>
            <button class="btn btn-outline btn-sm" onclick="editTech(${catIdx},${techIdx})"><i class="fas fa-pen"></i></button>
            <button class="btn btn-danger btn-sm" onclick="deleteTech(${catIdx},${techIdx})"><i class="fas fa-trash"></i></button>
          </div>
        </div>`;
    });
  });
  if (!html) list.innerHTML = '<div class="empty-state"><i class="fas fa-code"></i><p>Nenhuma tecnologia cadastrada.</p></div>';
  else list.innerHTML = html;
}

function renderCertList() {
  const list = document.getElementById('cert-list');
  let html = '';
  data.certifications.forEach((cert, i) => {
    html += `
      <div class="item-card">
        <div class="item-info">
          <h4>${esc(cert.title)}</h4>
          <p>${esc(cert.institution)} — ${esc(cert.year)} — ${esc(cert.hours)}</p>
        </div>
        <div class="item-meta">
          <span class="item-badge">${esc(cert.year)}</span>
          <button class="btn btn-outline btn-sm" onclick="editCert(${i})"><i class="fas fa-pen"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deleteCert(${i})"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
  });
  if (!html) list.innerHTML = '<div class="empty-state"><i class="fas fa-award"></i><p>Nenhum certificado cadastrado.</p></div>';
  else list.innerHTML = html;
}

function renderProjectList() {
  const list = document.getElementById('project-list');
  let html = '';
  data.projects.forEach((proj, i) => {
    html += `
      <div class="item-card">
        <div class="item-info">
          <h4><i class="${esc(proj.icon)}" style="margin-right:8px;"></i> ${esc(proj.title)}</h4>
          <p>${proj.tags.map(t => esc(t)).join(' · ')}</p>
        </div>
        <div class="item-meta">
          <button class="btn btn-outline btn-sm" onclick="editProject(${i})"><i class="fas fa-pen"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deleteProject(${i})"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
  });
  if (!html) list.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>Nenhum projeto cadastrado.</p></div>';
  else list.innerHTML = html;
}

function renderProfileForm() {
  const p = data.profile;
  const v = (s) => esc(s).replace(/"/g, '&quot;');
  document.getElementById('profile-form').innerHTML = `
    <div class="form-group"><label>Nome Completo</label><input type="text" id="p-name" value="${v(p.name)}"></div>
    <div class="form-row">
      <div class="form-group"><label>Nome Curto</label><input type="text" id="p-shortName" value="${v(p.shortName)}"></div>
      <div class="form-group"><label>Cargo</label><input type="text" id="p-role" value="${v(p.role)}"></div>
    </div>
    <div class="form-group"><label>Descrição</label><textarea id="p-description">${esc(p.description)}</textarea></div>
    <div class="form-group"><label>Texto "Sobre" (um parágrafo por linha)</label><textarea id="p-about" rows="5">${(p.about || []).map(a => esc(a)).join('\n')}</textarea></div>
    <div class="form-row">
      <div class="form-group"><label>GitHub URL</label><input type="url" id="p-github" value="${v(p.social.github)}"></div>
      <div class="form-group"><label>LinkedIn URL</label><input type="url" id="p-linkedin" value="${v(p.social.linkedin)}"></div>
    </div>
    <div class="form-group"><label>Email</label><input type="email" id="p-email" value="${v(p.social.email)}"></div>
    <div class="form-row">
      <div class="form-group"><label>Idade</label><input type="text" id="p-age" value="${v(p.info.age)}"></div>
      <div class="form-group"><label>Formação</label><input type="text" id="p-education" value="${v(p.info.education)}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Especialização</label><input type="text" id="p-specialization" value="${v(p.info.specialization)}"></div>
      <div class="form-group"><label>Status</label><input type="text" id="p-status" value="${v(p.info.status)}"></div>
    </div>
    <button class="btn btn-primary btn-sm" id="save-profile-btn" style="width:auto;margin-top:8px;">
      <i class="fas fa-save"></i> Salvar Perfil
    </button>`;
  document.getElementById('save-profile-btn').onclick = saveProfile;
}

function renderStatsForm() {
  let html = '';
  data.stats.forEach((s, i) => {
    html += `
      <div class="card" style="margin-bottom:12px;">
        <div class="form-row-3">
          <div class="form-group"><label>Label</label><input type="text" id="s-label-${i}" value="${s.label}"></div>
          <div class="form-group"><label>Valor</label><input type="number" id="s-target-${i}" value="${s.target}"></div>
          <div class="form-group"><label>Sufixo</label><input type="text" id="s-suffix-${i}" value="${s.suffix || ''}"></div>
        </div>
        <div class="form-group"><label>Detalhe</label><input type="text" id="s-detail-${i}" value="${s.detail}"></div>
      </div>`;
  });
  html += `<button class="btn btn-primary btn-sm" id="save-stats-btn" style="width:auto;margin-top:8px;">
    <i class="fas fa-save"></i> Salvar Stats
  </button>`;
  document.getElementById('stats-form').innerHTML = html;
  document.getElementById('save-stats-btn').onclick = saveStats;
}

// ==================== SAVE PROFILE ====================
function saveProfile() {
  data.profile.name = document.getElementById('p-name').value;
  data.profile.shortName = document.getElementById('p-shortName').value;
  data.profile.role = document.getElementById('p-role').value;
  data.profile.description = document.getElementById('p-description').value;
  data.profile.about = document.getElementById('p-about').value.split('\n').filter(l => l.trim());
  data.profile.social.github = document.getElementById('p-github').value;
  data.profile.social.linkedin = document.getElementById('p-linkedin').value;
  data.profile.social.email = document.getElementById('p-email').value;
  data.profile.info.age = document.getElementById('p-age').value;
  data.profile.info.education = document.getElementById('p-education').value;
  data.profile.info.specialization = document.getElementById('p-specialization').value;
  data.profile.info.status = document.getElementById('p-status').value;
  saveToStorage();
  showToast('Perfil salvo com sucesso!');
}

// ==================== SAVE STATS ====================
function saveStats() {
  data.stats.forEach((s, i) => {
    s.label = document.getElementById(`s-label-${i}`).value;
    s.target = parseInt(document.getElementById(`s-target-${i}`).value) || 0;
    s.suffix = document.getElementById(`s-suffix-${i}`).value;
    s.detail = document.getElementById(`s-detail-${i}`).value;
  });
  saveToStorage();
  showToast('Stats salvas com sucesso!');
}

// ==================== TECH CRUD ====================
function openTechModal(editIndex = -1, catIdx = -1, techIdx = -1) {
  document.getElementById('tech-edit-index').value = editIndex;
  if (editIndex >= 0) {
    document.getElementById('tech-modal-title').textContent = 'Editar Tecnologia';
    const tech = data.technologies[catIdx].items[techIdx];
    document.getElementById('tech-name').value = tech.name;
    document.getElementById('tech-icon').value = tech.icon;
    document.getElementById('tech-color').value = tech.color;
    document.getElementById('tech-level').value = tech.level;
    document.getElementById('tech-level-display').textContent = tech.level + '%';
    // Set category select
    const catSelect = document.getElementById('tech-category');
    for (let opt of catSelect.options) {
      if (opt.value === data.technologies[catIdx].category) { opt.selected = true; break; }
    }
  } else {
    document.getElementById('tech-modal-title').textContent = 'Nova Tecnologia';
    document.getElementById('tech-name').value = '';
    document.getElementById('tech-icon').value = '';
    document.getElementById('tech-color').value = '#00ff41';
    document.getElementById('tech-level').value = 50;
    document.getElementById('tech-level-display').textContent = '50%';
    document.getElementById('tech-category').selectedIndex = 0;
  }
  document.getElementById('tech-modal').classList.add('active');
  document.getElementById('tech-name').focus();
}

function editTech(catIdx, techIdx) {
  const tech = data.technologies[catIdx].items[techIdx];
  document.getElementById('tech-modal-title').textContent = 'Editar Tecnologia';
  document.getElementById('tech-edit-index').value = `${catIdx}:${techIdx}`;
  document.getElementById('tech-name').value = tech.name;
  document.getElementById('tech-icon').value = tech.icon;
  document.getElementById('tech-color').value = tech.color;
  document.getElementById('tech-level').value = tech.level;
  document.getElementById('tech-level-display').textContent = tech.level + '%';
  const catSelect = document.getElementById('tech-category');
  for (let opt of catSelect.options) {
    if (opt.value === data.technologies[catIdx].category) { opt.selected = true; break; }
  }
  document.getElementById('tech-modal').classList.add('active');
}

function deleteTech(catIdx, techIdx) {
  if (!confirm('Remover esta tecnologia?')) return;
  data.technologies[catIdx].items.splice(techIdx, 1);
  if (data.technologies[catIdx].items.length === 0) {
    data.technologies.splice(catIdx, 1);
  }
  saveToStorage();
  renderTechList();
  updateCounts();
  showToast('Tecnologia removida.');
}

function saveTech() {
  const editVal = document.getElementById('tech-edit-index').value;
  const name = document.getElementById('tech-name').value.trim();
  if (!name) { alert('Nome é obrigatório.'); return; }

  const category = document.getElementById('tech-category').value;
  let icon = document.getElementById('tech-icon').value.trim();
  const color = document.getElementById('tech-color').value;
  const level = parseInt(document.getElementById('tech-level').value);

  if (!icon) icon = autoDetectIcon(name);
  const colorClass = generateColorClass(name);

  const techObj = { name, icon, level, colorClass, color };

  if (editVal.includes(':')) {
    // Editing existing
    const [catIdx, techIdx] = editVal.split(':').map(Number);
    const oldCat = data.technologies[catIdx];

    // Check if category changed
    const newCatIdx = data.technologies.findIndex(c => c.category === category);
    if (newCatIdx >= 0 && newCatIdx !== catIdx) {
      // Move to different category
      oldCat.items.splice(techIdx, 1);
      if (oldCat.items.length === 0) data.technologies.splice(catIdx, 1);
      // Adjust newCatIdx if old was before new
      const adjustedIdx = newCatIdx > catIdx ? newCatIdx - 1 : newCatIdx;
      data.technologies[adjustedIdx].items.push(techObj);
    } else if (newCatIdx >= 0) {
      // Same category, just update
      data.technologies[newCatIdx].items[techIdx] = techObj;
    } else {
      // New category doesn't exist yet
      data.technologies[catIdx].items.splice(techIdx, 1);
      if (data.technologies[catIdx].items.length === 0) data.technologies.splice(catIdx, 1);
      data.technologies.push({ category, icon: 'fas fa-code', items: [techObj] });
    }
  } else {
    // Adding new
    const catIdx = data.technologies.findIndex(c => c.category === category);
    if (catIdx >= 0) {
      data.technologies[catIdx].items.push(techObj);
    } else {
      const catIcons = { 'Front-End': 'fas fa-palette', 'Back-End': 'fas fa-server', 'Mobile': 'fas fa-mobile-alt', 'Database': 'fas fa-database', 'DevOps': 'fas fa-cogs', 'Other': 'fas fa-code' };
      data.technologies.push({ category, icon: catIcons[category] || 'fas fa-code', items: [techObj] });
    }
  }

  saveToStorage();
  renderTechList();
  updateCounts();
  document.getElementById('tech-modal').classList.remove('active');
  showToast(editVal.includes(':') ? 'Tecnologia atualizada!' : 'Tecnologia adicionada!');
}

// ==================== CERT CRUD ====================
function openCertModal(editIndex = -1) {
  document.getElementById('cert-edit-index').value = editIndex;
  if (editIndex >= 0) {
    document.getElementById('cert-modal-title').textContent = 'Editar Certificado';
    const cert = data.certifications[editIndex];
    document.getElementById('cert-title').value = cert.title;
    document.getElementById('cert-institution').value = cert.institution;
    document.getElementById('cert-year').value = cert.year;
    document.getElementById('cert-hours').value = cert.hours;
    document.getElementById('cert-url').value = cert.url;
  } else {
    document.getElementById('cert-modal-title').textContent = 'Novo Certificado';
    document.getElementById('cert-title').value = '';
    document.getElementById('cert-institution').value = '';
    document.getElementById('cert-year').value = new Date().getFullYear().toString();
    document.getElementById('cert-hours').value = '';
    document.getElementById('cert-url').value = '';
  }
  document.getElementById('cert-modal').classList.add('active');
  document.getElementById('cert-title').focus();
}

function editCert(i) {
  const cert = data.certifications[i];
  document.getElementById('cert-edit-index').value = i;
  document.getElementById('cert-modal-title').textContent = 'Editar Certificado';
  document.getElementById('cert-title').value = cert.title;
  document.getElementById('cert-institution').value = cert.institution;
  document.getElementById('cert-year').value = cert.year;
  document.getElementById('cert-hours').value = cert.hours;
  document.getElementById('cert-url').value = cert.url;
  document.getElementById('cert-modal').classList.add('active');
}

function deleteCert(i) {
  if (!confirm('Remover este certificado?')) return;
  data.certifications.splice(i, 1);
  saveToStorage();
  renderCertList();
  updateCounts();
  showToast('Certificado removido.');
}

function saveCert() {
  const editIdx = parseInt(document.getElementById('cert-edit-index').value);
  const title = document.getElementById('cert-title').value.trim();
  if (!title) { alert('Título é obrigatório.'); return; }

  const certObj = {
    title,
    institution: document.getElementById('cert-institution').value.trim(),
    year: document.getElementById('cert-year').value.trim(),
    hours: document.getElementById('cert-hours').value.trim(),
    url: document.getElementById('cert-url').value.trim()
  };

  if (editIdx >= 0) {
    data.certifications[editIdx] = certObj;
  } else {
    data.certifications.push(certObj);
  }

  saveToStorage();
  renderCertList();
  updateCounts();
  document.getElementById('cert-modal').classList.remove('active');
  showToast(editIdx >= 0 ? 'Certificado atualizado!' : 'Certificado adicionado!');
}

// ==================== PROJECT CRUD ====================
let projectTags = [];

function openProjectModal(editIndex = -1) {
  document.getElementById('project-edit-index').value = editIndex;
  projectTags = [];
  if (editIndex >= 0) {
    document.getElementById('project-modal-title').textContent = 'Editar Projeto';
    const proj = data.projects[editIndex];
    document.getElementById('project-title').value = proj.title;
    document.getElementById('project-description').value = proj.description;
    document.getElementById('project-icon').value = proj.icon;
    document.getElementById('project-github').value = proj.github;
    projectTags = [...proj.tags];
  } else {
    document.getElementById('project-modal-title').textContent = 'Novo Projeto';
    document.getElementById('project-title').value = '';
    document.getElementById('project-description').value = '';
    document.getElementById('project-icon').value = '';
    document.getElementById('project-github').value = '';
  }
  renderProjectTags();
  document.getElementById('project-modal').classList.add('active');
  document.getElementById('project-title').focus();
}

function editProject(i) {
  const proj = data.projects[i];
  document.getElementById('project-edit-index').value = i;
  document.getElementById('project-modal-title').textContent = 'Editar Projeto';
  document.getElementById('project-title').value = proj.title;
  document.getElementById('project-description').value = proj.description;
  document.getElementById('project-icon').value = proj.icon;
  document.getElementById('project-github').value = proj.github;
  projectTags = [...proj.tags];
  renderProjectTags();
  document.getElementById('project-modal').classList.add('active');
}

function deleteProject(i) {
  if (!confirm('Remover este projeto?')) return;
  data.projects.splice(i, 1);
  saveToStorage();
  renderProjectList();
  updateCounts();
  showToast('Projeto removido.');
}

function renderProjectTags() {
  const container = document.getElementById('project-tags');
  container.innerHTML = projectTags.map((tag, i) =>
    `<span class="tag">${tag} <span class="remove-tag" onclick="removeProjectTag(${i})">&times;</span></span>`
  ).join('');
}

function addProjectTag() {
  const input = document.getElementById('project-tag-input');
  const val = input.value.trim();
  if (val && !projectTags.includes(val)) {
    projectTags.push(val);
    renderProjectTags();
  }
  input.value = '';
  input.focus();
}

function removeProjectTag(i) {
  projectTags.splice(i, 1);
  renderProjectTags();
}

function saveProject() {
  const editIdx = parseInt(document.getElementById('project-edit-index').value);
  const title = document.getElementById('project-title').value.trim();
  if (!title) { alert('Nome é obrigatório.'); return; }

  let icon = document.getElementById('project-icon').value.trim();
  if (!icon) icon = autoDetectIcon(title);

  const projObj = {
    title,
    description: document.getElementById('project-description').value.trim(),
    icon,
    github: document.getElementById('project-github').value.trim(),
    tags: [...projectTags]
  };

  if (editIdx >= 0) {
    data.projects[editIdx] = projObj;
  } else {
    data.projects.push(projObj);
  }

  saveToStorage();
  renderProjectList();
  updateCounts();
  document.getElementById('project-modal').classList.remove('active');
  showToast(editIdx >= 0 ? 'Projeto atualizado!' : 'Projeto adicionado!');
}

// ==================== STORAGE ====================
function saveToStorage() {
  localStorage.setItem('portfolio-admin-data', JSON.stringify(data));
}

function loadFromStorage() {
  const stored = localStorage.getItem('portfolio-admin-data');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return null; }
  }
  return null;
}

// ==================== EXPORT / SAVE ====================
// Salva direto no GitHub via Vercel Serverless Function
async function saveToGitHub() {
  const btn = document.getElementById('save-github-btn');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

  try {
    let password = adminPassword;
    if (!password) {
      password = prompt('Sessao restaurada. Digite a senha para salvar:');
      if (!password) {
        showToast('Cancelado.');
        btn.disabled = false;
        btn.innerHTML = originalText;
        return;
      }
      const hash = await sha256(password);
      if (!Security.timingSafeEqual(hash, ADMIN_PASSWORD_HASH)) {
        showToast('Senha incorreta.');
        btn.disabled = false;
        btn.innerHTML = originalText;
        return;
      }
      adminPassword = password;
    }
    const ts = Date.now();
    const encoder = new TextEncoder();
    const nonceBuffer = await crypto.subtle.digest(
      'SHA-256',
      encoder.encode(ADMIN_SALT + String(ts) + password)
    );
    const nonce = Array.from(new Uint8Array(nonceBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    const resp = await fetch('/api/update-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: password,
        data: data,
        nonce: nonce,
        ts: ts
      })
    });

    const result = await resp.json();

    if (resp.ok && result.success) {
      showToast('Portfolio atualizado no GitHub! Deploy sera feito automaticamente.');
    } else {
      showToast('Erro: ' + (result.error || 'Falha ao salvar.'));
    }
  } catch (err) {
    showToast('Erro de conexao. Verifique sua internet.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// Fallback: baixar JSON manualmente
function exportJSON() {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('data.json baixado! Substitua no repositorio e faca push.');
}

function showPreview() {
  document.getElementById('json-preview-content').textContent = JSON.stringify(data, null, 2);
  document.getElementById('preview-modal').classList.add('active');
}

function copyJSON() {
  navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
    showToast('JSON copiado para a area de transferencia!');
  });
}

// ==================== SESSION MANAGEMENT ====================
function checkSession() {
  const loginTime = sessionStorage.getItem('admin-login-time');
  if (!loginTime) return false;
  return (Date.now() - parseInt(loginTime)) < SESSION_TIMEOUT;
}

function startSession(password) {
  sessionStorage.setItem('admin-logged-in', 'true');
  sessionStorage.setItem('admin-login-time', Date.now().toString());
  adminPassword = password;
}

function endSession() {
  sessionStorage.removeItem('admin-logged-in');
  sessionStorage.removeItem('admin-login-time');
  adminPassword = null;
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in and session not expired
  if (sessionStorage.getItem('admin-logged-in') && checkSession()) {
    showAdminPanel();
  } else {
    endSession();
  }

  // Login
  document.getElementById('login-btn').onclick = doLogin;
  document.getElementById('password-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doLogin();
  });

  // Logout
  document.getElementById('logout-btn').onclick = () => {
    endSession();
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('password-input').value = '';
    document.getElementById('login-error').classList.remove('show');
  };

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  // Tech modal
  document.getElementById('add-tech-btn').onclick = () => openTechModal();
  document.getElementById('tech-save').onclick = saveTech;
  document.getElementById('tech-cancel').onclick = () => document.getElementById('tech-modal').classList.remove('active');
  document.getElementById('tech-level').oninput = function () {
    document.getElementById('tech-level-display').textContent = this.value + '%';
  };

  // Auto-detect icon/color on name change
  document.getElementById('tech-name').addEventListener('input', function () {
    if (!document.getElementById('tech-edit-index').value.includes(':')) {
      document.getElementById('tech-icon').value = autoDetectIcon(this.value);
      document.getElementById('tech-color').value = autoDetectColor(this.value);
    }
  });

  // Cert modal
  document.getElementById('add-cert-btn').onclick = () => openCertModal();
  document.getElementById('cert-save').onclick = saveCert;
  document.getElementById('cert-cancel').onclick = () => document.getElementById('cert-modal').classList.remove('active');

  // Project modal
  document.getElementById('add-project-btn').onclick = () => openProjectModal();
  document.getElementById('project-save').onclick = saveProject;
  document.getElementById('project-cancel').onclick = () => document.getElementById('project-modal').classList.remove('active');
  document.getElementById('add-tag-btn').onclick = addProjectTag;
  document.getElementById('project-tag-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addProjectTag(); }
  });

  // Export & Preview & Save
  document.getElementById('save-github-btn').onclick = saveToGitHub;
  document.getElementById('export-btn').onclick = exportJSON;
  document.getElementById('preview-btn').onclick = showPreview;
  document.getElementById('copy-json-btn').onclick = copyJSON;
  document.getElementById('preview-close').onclick = () => document.getElementById('preview-modal').classList.remove('active');

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });

  // Close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });
});

async function doLogin() {
  const pass = document.getElementById('password-input').value;
  if (!pass) return;
  const hash = await sha256(pass);
  if (Security.timingSafeEqual(hash, ADMIN_PASSWORD_HASH)) {
    startSession(pass);
    showAdminPanel();
  } else {
    document.getElementById('login-error').classList.add('show');
    document.getElementById('password-input').value = '';
    document.getElementById('password-input').focus();
  }
}

function showAdminPanel() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';

  if (!adminPassword) {
    showToast('Sessao restaurada. Sera pedida a senha ao salvar.');
  }

  // Load data: localStorage first, then fetch from site
  const stored = loadFromStorage();
  if (stored) {
    data = stored;
    renderAll();
  } else {
    // Try to fetch data.json from the site root
    fetch('data.json')
      .then(r => r.json())
      .then(d => {
        data = d;
        saveToStorage();
        renderAll();
      })
      .catch(() => {
        // Create empty structure
        data = {
          profile: { name: '', shortName: '', role: '', roleEn: '', description: '', about: [], info: { age: '', education: '', specialization: '', status: '' }, social: { github: '', linkedin: '', email: '' } },
          stats: [], technologies: [], projects: [], certifications: [], education: [], typingPhrases: []
        };
        renderAll();
      });
  }
}

function renderAll() {
  renderTechList();
  renderCertList();
  renderProjectList();
  renderProfileForm();
  renderStatsForm();
  updateCounts();
}
