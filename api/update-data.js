// ==================== VERCEL SERVERLESS FUNCTION ====================
// Recebe o data.json do admin e faz commit automatico no GitHub.

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Validar variavel de ambiente
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = process.env.REPO_OWNER; // ex: brunoawz14
  const REPO_NAME = process.env.REPO_NAME;   // ex: Portifolio

  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    return res.status(500).json({
      error: 'Variaveis de ambiente nao configuradas.',
      help: 'Configure GITHUB_TOKEN, REPO_OWNER e REPO_NAME no painel do Vercel.'
    });
  }

  // Validar senha
  const { password, data } = req.body;
  if (!password || !data) {
    return res.status(400).json({ error: 'Senha e dados sao obrigatorios.' });
  }

  // Verificar senha com hash salted
  const ADMIN_SALT = 'b4uno_p0rtf0l10_2026';
  const ADMIN_PASSWORD_HASH = '29b523a8a82d25f43dbe346fb83ca014d27c070c80fac1042d056f0fc01eb230';

  const encoder = new TextEncoder();
  const salted = encoder.encode(ADMIN_SALT + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', salted);
  const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  if (hash !== ADMIN_PASSWORD_HASH) {
    return res.status(401).json({ error: 'Senha invalida.' });
  }

  // Validar estrutura basica do JSON
  if (!data.profile || !data.technologies || !data.certifications) {
    return res.status(400).json({ error: 'Estrutura do JSON invalida.' });
  }

  try {
    // 1. Buscar o SHA atual do data.json no repo
    const getFileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data.json`;
    const getRes = await fetch(getFileUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'Vercel-Admin' }
    });

    let sha = null;
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // 2. Criar ou atualizar o data.json
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const commitMessage = `[admin] Atualizar portfolio via painel admin - ${new Date().toISOString().split('T')[0]}`;

    const body = {
      message: commitMessage,
      content,
      committer: { name: 'Portfolio Admin', email: 'admin@portfolio.local' }
    };
    if (sha) body.sha = sha; // necessario para atualizar arquivo existente

    const putRes = await fetch(getFileUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Admin'
      },
      body: JSON.stringify(body)
    });

    if (!putRes.ok) {
      const err = await putRes.json();
      return res.status(500).json({ error: 'Erro ao commitar no GitHub.', details: err.message });
    }

    const result = await putRes.json();
    return res.status(200).json({
      success: true,
      message: 'Portfolio atualizado com sucesso!',
      commit: result.commit?.html_url
    });

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno.', details: err.message });
  }
}
