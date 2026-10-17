const http = require('http');
const fs = require('fs');
const path = require('path');
const { suggestPlan, readQuestionnaire, READ_TYPES, Anthropic } = require('./ai');

const ROOT = __dirname;
const INDEX_FILE = 'index.html';
const PORT = process.env.PORT || 3001;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8'
};

function aiConfigured(){ return !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN); }

function sendJson(res, status, body){
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function readJsonBody(req, limit){
  return new Promise((resolve, reject) => {
    let size = 0, chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > limit){ reject(Object.assign(new Error('Request too large.'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch (e){ reject(Object.assign(new Error('Invalid JSON.'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

// Most specific first — keeps retryable failures (rate limits, outages)
// distinguishable from setup problems (missing/invalid key).
function aiErrorResponse(err){
  if (err instanceof Anthropic.AuthenticationError) return [401, 'The Anthropic API key is missing or invalid — see README.md to set it.'];
  if (err instanceof Anthropic.PermissionDeniedError) return [403, 'This API key isn\u2019t allowed to use ' + 'the model.'];
  if (err instanceof Anthropic.RateLimitError) return [429, 'Too many AI requests right now — wait a moment and try again.'];
  if (err instanceof Anthropic.BadRequestError) return [400, 'The AI request was rejected: ' + err.message];
  if (err instanceof Anthropic.APIConnectionError) return [503, 'Couldn\u2019t reach the Anthropic API — check your internet connection.'];
  if (err instanceof Anthropic.APIError) return [502, 'The AI service returned an error (' + err.status + '). Try again shortly.'];
  if (err instanceof Anthropic.AnthropicError) return [500, 'AI is not set up: ' + err.message];
  return [err.status || 500, err.message || 'Something went wrong.'];
}

async function handleAiSuggest(req, res){
  try {
    const body = await readJsonBody(req, 200 * 1024);
    if (!body.answers || typeof body.answers !== 'object') return sendJson(res, 400, { error: 'Missing questionnaire answers.' });
    if (!aiConfigured()) return sendJson(res, 503, { error: 'AI suggestions aren\u2019t set up yet — the server needs an ANTHROPIC_API_KEY (see README.md).' });
    const result = await suggestPlan({ answers: body.answers, checkins: Array.isArray(body.checkins) ? body.checkins.slice(0, 20) : [] });
    console.log(`AI suggestion: ${result.model}, ${result.usage.input_tokens} in / ${result.usage.output_tokens} out tokens`);
    sendJson(res, 200, result);
  } catch (err){
    const [status, message] = aiErrorResponse(err);
    console.error('AI suggestion failed:', err.message);
    sendJson(res, status, { error: message });
  }
}

// A paper questionnaire (scans/photos, or a PDF with no typed answers)
// -> answers for the member to check in the form. Nothing is stored.
async function handleReadQuestionnaire(req, res){
  try {
    const body = await readJsonBody(req, 30 * 1024 * 1024);
    const files = Array.isArray(body.files) ? body.files : [];
    const questions = Array.isArray(body.questions) ? body.questions : [];
    if (!files.length || files.length > 10) return sendJson(res, 400, { error: 'Send between 1 and 10 pages.' });
    if (files.some(f => !f || typeof f.data !== 'string' || !READ_TYPES.includes(f.media_type))) return sendJson(res, 400, { error: 'Only PDF, JPEG, PNG, WebP or GIF files can be read.' });
    if (!questions.length) return sendJson(res, 400, { error: 'Missing the question list.' });
    if (!aiConfigured()) return sendJson(res, 503, { error: 'Reading paper forms needs AI, which isn\u2019t set up yet — the server needs an ANTHROPIC_API_KEY (see README.md).' });
    const result = await readQuestionnaire({ files, questions, dayRows: Array.isArray(body.dayRows) ? body.dayRows : [] });
    console.log(`AI read questionnaire: ${result.model}, ${files.length} file(s), ${result.usage.input_tokens} in / ${result.usage.output_tokens} out tokens`);
    sendJson(res, 200, result);
  } catch (err){
    const [status, message] = aiErrorResponse(err);
    console.error('AI questionnaire reading failed:', err.message);
    sendJson(res, status, { error: message });
  }
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  if (urlPath === '/api/ai-suggest'){
    if (req.method !== 'POST'){ res.writeHead(405, { Allow: 'POST' }); res.end(); return; }
    handleAiSuggest(req, res);
    return;
  }
  if (urlPath === '/api/ai-read-questionnaire'){
    if (req.method !== 'POST'){ res.writeHead(405, { Allow: 'POST' }); res.end(); return; }
    handleReadQuestionnaire(req, res);
    return;
  }
  if (urlPath === '/api/ai-status'){
    // Only whether a key is present — never the key itself.
    sendJson(res, 200, { configured: aiConfigured() });
    return;
  }

  if (urlPath === '/') urlPath = '/' + INDEX_FILE;

  const filePath = path.normalize(path.join(ROOT, urlPath));
  const rel = path.relative(ROOT, filePath);
  // Static files only — never node_modules or dotfiles (e.g. a .env
  // holding the API key).
  if (!filePath.startsWith(ROOT) || rel.split(path.sep).some(part => part === 'node_modules' || part.startsWith('.'))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found: ' + urlPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

// 127.0.0.1 only: the sandbox holds private drafts and an API key, so
// it shouldn't be reachable from other devices on the network.
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Meal Plan Sandbox running at http://localhost:${PORT}` + (process.env.ANTHROPIC_API_KEY ? '' : '  (AI suggestions off: ANTHROPIC_API_KEY not set)'));
});
