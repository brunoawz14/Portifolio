// ==================== VERCEL SERVERLESS FUNCTION ====================
// Recebe o data.json do admin e faz commit automatico no GitHub.

const SITE_URL = 'https://bruno-anjos-dev.vercel.app';
const SITE_HOST = 'bruno-anjos-dev.vercel.app';
const MAX_BODY_SIZE = 1024 * 50; // 50KB max
const ADMIN_SALT = 'b4uno_p0rtf0l10_2026';
const ADMIN_PASSWORD_HASH = '29b523a8a82d25f43dbe346fb83ca014d27c070c80fac1042d056f0fc01eb230';

// Comparacao timing-safe para evitar timing attacks
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Verifica se a origin e permitida (producao ou previews do Vercel)
function isAllowedOrigin(origin) {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    // Producao exata
    if (url.host === SITE_HOST) return true;
    // Previews do Vercel: *.vercel.app
    if (url.hostname.endsWith('.vercel.app')) return true;
    // Localhost para dev
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return true;
  } catch {}
  return false;
}

export default async function handler(req, res) {
  // --- CORS restrito ao proprio dominio ---
  const origin = req.headers.origin || '';
  const allowed = isAllowedOrigin(origin);
  const allowOrigin = allowed ? origin : '';
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    if (!allowed) return res.status(403).json({ error: 'Acesso negado.' });
    return res.status(200).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!allowed) {
    return res.status(403).json({ error: 'Acesso negado.' });
  }

  // --- Validar variavel de ambiente ---
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = process.env.REPO_OWNER;
  const REPO_NAME = process.env.REPO_NAME;

  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    return res.status(500).json({ error: 'Servidor mal configurado.' });
  }

  // --- Validar body ---
  const rawBody = JSON.stringify(req.body || {});
  if (rawBody.length > MAX_BODY_SIZE) {
    return res.status(413).json({ error: 'Dados excedem limite permitido.' });
  }

  const { password, data, nonce, ts } = req.body;
  if (!password || !data) {
    return res.status(400).json({ error: 'Dados obrigatorios ausentes.' });
  }

  // --- Anti-replay: nonce + timestamp (janela de 5 min) ---
  if (!nonce || !ts) {
    return res.status(400).json({ error: 'Requisicao invalida.' });
  }
  const now = Date.now();
  if (typeof ts !== 'number' || Math.abs(now - ts) > 5 * 60 * 1000) {
    return res.status(401).json({ error: 'Requisicao expirada.' });
  }

  // --- Verificar senha com hash salted (timing-safe) ---
  const encoder = new TextEncoder();
  const salted = encoder.encode(ADMIN_SALT + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', salted);
  const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  if (!timingSafeEqual(hash, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ error: 'Credenciais invalidas.' });
  }

  // --- Verificar nonce ---
  const nonceExpected = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(ADMIN_SALT + String(ts) + password)
  );
  const nonceHash = Array.from(new Uint8Array(nonceExpected)).map(b => b.toString(16).padStart(2, '0')).join('');

  if (!timingSafeEqual(nonce, nonceHash)) {
    return res.status(401).json({ error: 'Requisicao invalida.' });
  }

  // --- Validar estrutura basica do JSON ---
  if (!data.profile || !data.technologies || !data.certifications) {
    return res.status(400).json({ error: 'Estrutura do JSON invalida.' });
  }

  try {
    // 1. Buscar o SHA atual do data.json no repo
    const getFileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data.json`;
    const getRes = await fetch(getFileUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'Portfolio-Admin' }
    });

    let sha = null;
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // 2. Criar ou atualizar o data.json
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const commitMessage = `[admin] Atualizar portfolio - ${new Date().toISOString().split('T')[0]}`;

    const body = {
      message: commitMessage,
      content,
      committer: { name: 'Portfolio Admin', email: 'admin@portfolio.local' }
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(getFileUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-Admin'
      },
      body: JSON.stringify(body)
    });

    if (!putRes.ok) {
      return res.status(500).json({ error: 'Falha ao salvar no GitHub.' });
    }

    const result = await putRes.json();
    return res.status(200).json({
      success: true,
      message: 'Portfolio atualizado com sucesso!',
      commit: result.commit?.html_url
    });

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
