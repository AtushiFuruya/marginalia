#!/usr/bin/env node

/**
 * mem0 (OpenMemory) 統合スクリプト
 *
 * 要件:
 * 1. MEM0_API_KEY / MEM0_ENDPOINT でクライアントを初期化
 * 2. ポストアクションフックで SHARED_DEV_CONTEXT に最小限の要約を保存
 * 3. プレアクションフックで mem0.search を使い、最大3件の関連スニペットを取得
 * 4. 取得結果はモデル入力トークン上限の30%以内にトリム
 * 5. GITHUB_PROJECT_DATA キーで GitHub メタデータを管理
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { MemoryClient } = require('mem0ai');

const ROOT = path.join(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, '.memory-config.json');
const LOCAL_SHARED_CONTEXT_PATH = path.join(ROOT, '.memory', 'context', 'dev-context.json');
const LOCAL_GITHUB_DATA_PATH = path.join(ROOT, '.memory', 'context', 'github-project-data.json');

const FALLBACK_SHARED_CONTEXT_KEY = 'SHARED_DEV_CONTEXT';
const FALLBACK_GITHUB_KEY = 'GITHUB_PROJECT_DATA';
const DEFAULT_MODEL_MAX_TOKENS = 200000;
const DEFAULT_TOKEN_RATIO = 0.3;
const SUMMARY_MAX_LENGTH = 200; // 文字数ベースで要約を強制的に縮める

let cachedConfig = null;
let cachedClient = null;

function loadConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }
  if (!fs.existsSync(CONFIG_PATH)) {
    cachedConfig = {};
    return cachedConfig;
  }
  cachedConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  return cachedConfig;
}

function getMem0Settings() {
  const config = loadConfig();
  const mem0 = config.mem0 || {};
  const keys = mem0.keys || {};

  const maxModelTokens = mem0.maxModelTokens || DEFAULT_MODEL_MAX_TOKENS;
  const tokenBudgetRatio = typeof mem0.tokenBudgetRatio === 'number'
    ? mem0.tokenBudgetRatio
    : DEFAULT_TOKEN_RATIO;

  return {
    enabled: mem0.enabled !== false,
    apiKeyEnv: mem0.apiKeyEnv || 'MEM0_API_KEY',
    endpointEnv: mem0.endpointEnv || 'MEM0_ENDPOINT',
    defaultEndpoint: mem0.defaultEndpoint || 'https://api.mem0.ai',
    userId: mem0.userId || os.userInfo().username || 'shared-user',
    projectId: mem0.projectId || 'shared-dev-context',
    sharedContextKey: keys.sharedContext || FALLBACK_SHARED_CONTEXT_KEY,
    githubKey: keys.githubProject || FALLBACK_GITHUB_KEY,
    tokenBudgetRatio,
    maxModelTokens,
    contextTokenLimit: Math.floor(maxModelTokens * tokenBudgetRatio)
  };
}

async function getMem0Client() {
  if (cachedClient) {
    return cachedClient;
  }

  const settings = getMem0Settings();
  if (!settings.enabled) {
    throw new Error('mem0 integration is disabled via configuration.');
  }

  const apiKey = process.env[settings.apiKeyEnv] || process.env.MEM0_API_KEY;
  if (!apiKey) {
    throw new Error(`環境変数 ${settings.apiKeyEnv} (MEM0_API_KEY) が設定されていません`);
  }

  const endpoint = process.env[settings.endpointEnv] || settings.defaultEndpoint;
  cachedClient = new MemoryClient({
    apiKey,
    host: endpoint,
    projectId: settings.projectId
  });

  return cachedClient;
}

function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function normalizeTaskData(taskData = {}) {
  const files = Array.isArray(taskData.files) ? taskData.files : [];
  const trimmedSummary = (taskData.summary || '').trim().replace(/\s+/g, ' ');

  return {
    type: taskData.type || 'unspecified-task',
    files: files.slice(0, 8),
    summary: trimmedSummary.slice(0, SUMMARY_MAX_LENGTH),
    status: taskData.status || 'unknown',
    author: taskData.author || process.env.GIT_AUTHOR_NAME || os.userInfo().username,
    ticket: taskData.ticket || null
  };
}

function buildSemanticSummary(taskData) {
  const fileHint = taskData.files.length ? `Files:${taskData.files.join('|')}` : 'Files:none';
  const ticketHint = taskData.ticket ? `Ticket:${taskData.ticket}` : 'Ticket:none';
  return `Task:${taskData.type} | Status:${taskData.status} | ${fileHint} | ${ticketHint} | Delta:${taskData.summary}`;
}

async function appendLocalSharedContext(entry) {
  ensureDir(LOCAL_SHARED_CONTEXT_PATH);
  let entries = [];
  if (fs.existsSync(LOCAL_SHARED_CONTEXT_PATH)) {
    try {
      entries = JSON.parse(fs.readFileSync(LOCAL_SHARED_CONTEXT_PATH, 'utf8'));
    } catch (error) {
      console.warn('ローカルコンテキストの読み込みに失敗しました。再初期化します。');
      entries = [];
    }
  }
  entries.unshift(entry);
  fs.writeFileSync(LOCAL_SHARED_CONTEXT_PATH, JSON.stringify(entries, null, 2));
}

function filterMetadata(metadata = {}) {
  const allowed = ['key', 'task_type', 'status', 'files', 'timestamp', 'token_count', 'author', 'ticket'];
  const filtered = {};
  allowed.forEach((field) => {
    if (metadata[field] !== undefined) {
      filtered[field] = metadata[field];
    }
  });
  if (Array.isArray(filtered.files)) {
    filtered.files = filtered.files.slice(0, 8);
  }
  return filtered;
}

function extractMemoryText(memory) {
  if (!memory) return '';
  if (typeof memory.memory === 'string') {
    return memory.memory;
  }
  if (memory.data?.memory) {
    return memory.data.memory;
  }
  if (Array.isArray(memory.messages)) {
    return memory.messages.map((msg) => `${msg.role}: ${typeof msg.content === 'string' ? msg.content : ''}`).join('\n');
  }
  return '';
}

function formatMemorySnippet(memory, settings) {
  return {
    id: memory.id,
    summary: extractMemoryText(memory),
    metadata: filterMetadata(memory.metadata || { key: settings.sharedContextKey }),
    createdAt: memory.created_at || memory.updated_at || new Date().toISOString()
  };
}

function applyTokenBudget(snippets, settings) {
  const limit = settings.contextTokenLimit;
  const budgeted = [];
  let used = 0;

  for (const snippet of snippets) {
    let serialized = JSON.stringify(snippet);
    let tokens = estimateTokens(serialized);

    if (used + tokens > limit) {
      const remaining = limit - used;
      if (remaining <= 0) break;
      if (snippet.summary) {
        const approxChars = Math.max(0, remaining * 4 - 2);
        snippet.summary = snippet.summary.slice(0, approxChars);
        serialized = JSON.stringify(snippet);
        tokens = estimateTokens(serialized);
      }
      if (used + tokens > limit) {
        break;
      }
    }

    budgeted.push(snippet);
    used += tokens;
  }

  return {
    snippets: budgeted,
    usedTokens: used,
    limitTokens: limit
  };
}

async function postActionHook(rawTaskData) {
  const settings = getMem0Settings();
  const taskData = normalizeTaskData(rawTaskData);
  const semanticSummary = buildSemanticSummary(taskData);

  const metadata = {
    key: settings.sharedContextKey,
    task_type: taskData.type,
    status: taskData.status,
    files: taskData.files,
    timestamp: new Date().toISOString(),
    token_count: estimateTokens(semanticSummary),
    author: taskData.author,
    ticket: taskData.ticket || undefined
  };

  const payload = {
    summary: semanticSummary,
    metadata,
    storedIn: 'local'
  };

  try {
    const client = await getMem0Client();
    const memories = await client.add([
      { role: 'system', content: 'Shared development context. Store only minimal semantic deltas.' },
      { role: 'user', content: semanticSummary }
    ], {
      user_id: settings.userId,
      project_id: settings.projectId,
      metadata,
      categories: [settings.sharedContextKey],
      infer: false,
      immutable: false
    });

    payload.storedIn = 'mem0';
    payload.memoryId = memories?.[0]?.id;
  } catch (error) {
    payload.error = error.message;
    console.warn('mem0 への保存に失敗しました。ローカルキャッシュにフォールバックします:', error.message);
  }

  await appendLocalSharedContext({ ...metadata, summary: semanticSummary });
  return payload;
}

function keywordScore(entry, query) {
  const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = JSON.stringify(entry).toLowerCase();
  return keywords.reduce((acc, keyword) => acc + (haystack.includes(keyword) ? 1 : 0), 0);
}

function readLocalSharedContext() {
  if (!fs.existsSync(LOCAL_SHARED_CONTEXT_PATH)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(LOCAL_SHARED_CONTEXT_PATH, 'utf8'));
  } catch (error) {
    console.warn('ローカル共有コンテキストの読み込みに失敗:', error.message);
    return [];
  }
}

async function preActionHook(taskDescription) {
  const settings = getMem0Settings();
  let snippets = [];
  let source = 'local';

  try {
    const client = await getMem0Client();
    const memories = await client.search(taskDescription, {
      user_id: settings.userId,
      project_id: settings.projectId,
      filters: { key: settings.sharedContextKey },
      limit: 3,
      top_k: 3,
      includes: 'metadata'
    });
    snippets = memories.slice(0, 3).map((memory) => formatMemorySnippet(memory, settings));
    source = 'mem0';
  } catch (error) {
    console.warn('mem0.search に失敗したためローカル検索を使用します:', error.message);
    const entries = readLocalSharedContext();
    snippets = entries
      .map((entry, index) => ({ entry, score: keywordScore(entry, taskDescription), index }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, 3)
      .map((item) => ({
        id: `local-${item.index}`,
        summary: item.entry.summary,
        metadata: filterMetadata(item.entry),
        createdAt: item.entry.timestamp || new Date().toISOString()
      }));
  }

  const budgeted = applyTokenBudget(snippets, settings);
  return {
    source,
    usedTokens: budgeted.usedTokens,
    limitTokens: budgeted.limitTokens,
    snippets: budgeted.snippets
  };
}

function sanitizeProjectData(data = {}) {
  if (!data || typeof data !== 'object') {
    return {};
  }
  const sanitized = {};
  const keys = Object.keys(data).sort();
  keys.forEach((key) => {
    const value = data[key];
    if (value === undefined) {
      return;
    }
    if (value === null) {
      sanitized[key] = null;
      return;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
      return;
    }
    if (Array.isArray(value)) {
      sanitized[key] = value.map((item) => (typeof item === 'object' ? { ...item } : item));
      return;
    }
    sanitized[key] = { ...value };
  });
  return sanitized;
}

async function purgeMemoriesByKey(key, settings) {
  try {
    const client = await getMem0Client();
    const matches = await client.search(key, {
      user_id: settings.userId,
      project_id: settings.projectId,
      filters: { key },
      limit: 5,
      top_k: 5
    });
    for (const memory of matches) {
      try {
        await client.delete(memory.id);
      } catch (deleteError) {
        console.warn(`メモリ ${memory.id} の削除に失敗:`, deleteError.message);
      }
    }
  } catch (error) {
    console.warn('キー指定削除に失敗しました (fallback to latest add).', error.message);
  }
}

async function saveGitHubProjectData(projectData) {
  const settings = getMem0Settings();
  const sanitized = sanitizeProjectData(projectData);
  const serialized = JSON.stringify({
    key: settings.githubKey,
    captured_at: new Date().toISOString(),
    ...sanitized
  }, null, 2);

  ensureDir(LOCAL_GITHUB_DATA_PATH);
  fs.writeFileSync(LOCAL_GITHUB_DATA_PATH, serialized);

  try {
    await purgeMemoriesByKey(settings.githubKey, settings);
    const client = await getMem0Client();
    const result = await client.add([
      { role: 'system', content: 'GitHub project metadata snapshot (unsummarized).' },
      { role: 'user', content: serialized }
    ], {
      user_id: settings.userId,
      project_id: settings.projectId,
      metadata: { key: settings.githubKey, timestamp: new Date().toISOString() },
      categories: [settings.githubKey],
      immutable: true
    });
    return { storedIn: 'mem0', memoryId: result?.[0]?.id };
  } catch (error) {
    console.warn('GitHubメタデータのmem0保存に失敗。ローカルのみ保持します:', error.message);
    return { storedIn: 'local', error: error.message };
  }
}

async function getGitHubProjectData() {
  const settings = getMem0Settings();

  try {
    const client = await getMem0Client();
    const memories = await client.search(settings.githubKey, {
      user_id: settings.userId,
      project_id: settings.projectId,
      filters: { key: settings.githubKey },
      limit: 1,
      top_k: 1
    });

    if (memories.length) {
      const text = extractMemoryText(memories[0]);
      try {
        return { source: 'mem0', data: JSON.parse(text) };
      } catch (parseError) {
        return { source: 'mem0', data: { raw: text } };
      }
    }
  } catch (error) {
    console.warn('mem0 からのGitHubデータ取得に失敗:', error.message);
  }

  if (fs.existsSync(LOCAL_GITHUB_DATA_PATH)) {
    try {
      return { source: 'local', data: JSON.parse(fs.readFileSync(LOCAL_GITHUB_DATA_PATH, 'utf8')) };
    } catch (error) {
      console.warn('ローカルGitHubデータの読み取りに失敗:', error.message);
    }
  }

  return { source: 'none', data: null };
}

async function handleCli() {
  const [,, command, ...rest] = process.argv;

  try {
    switch (command) {
      case 'post-action': {
        const payload = rest.join(' ');
        const taskData = payload ? JSON.parse(payload) : {};
        const result = await postActionHook(taskData);
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      case 'pre-action': {
        const query = rest.join(' ').trim();
        if (!query) {
          throw new Error('pre-action には検索クエリが必要です');
        }
        const context = await preActionHook(query);
        console.log(JSON.stringify(context, null, 2));
        break;
      }
      case 'save-github': {
        const payload = rest.join(' ');
        if (!payload) {
          throw new Error('GitHubメタデータ(JSON)を指定してください');
        }
        const result = await saveGitHubProjectData(JSON.parse(payload));
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      case 'get-github': {
        const data = await getGitHubProjectData();
        console.log(JSON.stringify(data, null, 2));
        break;
      }
      case '--help':
      case '-h': {
        console.log(`
利用方法:
  node .memory-scripts/mem0-integration.js post-action '{"type":"task","files":["index.html"],"summary":"UIを更新","status":"done"}'
  node .memory-scripts/mem0-integration.js pre-action "age gate 実装"
  node .memory-scripts/mem0-integration.js save-github '{"repository":"https://github.com/user/repo","latest_commit_sha":"abc123"}'
  node .memory-scripts/mem0-integration.js get-github
        `);
        process.exit(0);
      }
      default:
        console.log(`
利用方法:
  node .memory-scripts/mem0-integration.js post-action '{"type":"task","files":["index.html"],"summary":"UIを更新","status":"done"}'
  node .memory-scripts/mem0-integration.js pre-action "age gate 実装"
  node .memory-scripts/mem0-integration.js save-github '{"repository":"https://github.com/user/repo","latest_commit_sha":"abc123"}'
  node .memory-scripts/mem0-integration.js get-github
        `);
        process.exit(1);
    }
  } catch (error) {
    console.error('mem0-integration エラー:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  handleCli();
}

module.exports = {
  postActionHook,
  preActionHook,
  saveGitHubProjectData,
  getGitHubProjectData,
  estimateTokens,
  applyTokenBudget,
  getMem0Settings
};
