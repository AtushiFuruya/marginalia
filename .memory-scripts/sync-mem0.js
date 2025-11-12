#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');
const { setTimeout: sleep } = require('timers/promises');

const ROOT = path.join(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, '.memory-config.json');
const TODO_PATH = path.join(ROOT, '.memory', 'todos', 'todos.json');
const ISSUES_PATH = path.join(ROOT, 'reference', 'issues.md');
const SYNC_LOG_PATH = path.join(ROOT, '.memory', 'sync', 'sync-log.json');
const LAST_SYNC_PATH = path.join(ROOT, '.memory', 'sync', 'last-sync.json');
const SUPPORTED_SOURCES = ['todos', 'issues'];
const DEFAULT_ENDPOINT = 'https://api.mem0.ai/v1/memories/';
const DEFAULT_USER_ID = 'karin_gamesite';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    sources: [...SUPPORTED_SOURCES],
    dryRun: false,
    limit: null,
    throttle: 250,
    endpoint: null,
    userId: null,
    orgId: null,
    projectId: null,
    appId: null,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case '--source':
      case '-s':
        options.sources = (args[i + 1] || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        i += 1;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--limit':
      case '-l':
        options.limit = parseInt(args[i + 1], 10);
        i += 1;
        break;
      case '--throttle':
        options.throttle = parseInt(args[i + 1], 10);
        i += 1;
        break;
      case '--endpoint':
        options.endpoint = args[i + 1];
        i += 1;
        break;
      case '--user-id':
      case '--user':
        options.userId = args[i + 1];
        i += 1;
        break;
      case '--org-id':
        options.orgId = args[i + 1];
        i += 1;
        break;
      case '--project-id':
        options.projectId = args[i + 1];
        i += 1;
        break;
      case '--app-id':
        options.appId = args[i + 1];
        i += 1;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        break;
    }
  }

  if (!options.sources.length) {
    options.sources = [...SUPPORTED_SOURCES];
  }

  return options;
}

function printHelp() {
  console.log(`\nmem0 Sync Script\n-----------------\nUsage: node .memory-scripts/sync-mem0.js [options]\n\nOptions:\n  -s, --source <list>        Comma separated sources (todos,issues)\n      --dry-run              Preview payloads without sending\n  -l, --limit <number>       Limit number of records\n      --endpoint <url>       Override API endpoint (default: ${DEFAULT_ENDPOINT})\n      --user-id <id>         Override user_id for mem0\n      --org-id <id>          Optional org_id for mem0\n      --project-id <id>      Optional project_id for mem0\n      --app-id <id>          Optional app_id for mem0\n      --throttle <ms>        Delay between requests (default: 250ms)\n  -h, --help                 Show this help message\n`);
}

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error.message);
    return fallback;
  }
}

function loadConfig() {
  return readJson(CONFIG_PATH, {}) || {};
}

function formatTodo(todo) {
  const parts = [
    `[${todo.id}] ${todo.title}`,
    `Status: ${todo.status} | Priority: ${todo.priority} | Category: ${todo.category}`,
    `Description: ${todo.description}`,
  ];

  if (todo.tags?.length) {
    parts.push(`Tags: ${todo.tags.join(', ')}`);
  }
  if (todo.relatedFiles?.length) {
    parts.push(`Files: ${todo.relatedFiles.join(', ')}`);
  }
  if (todo.notes) {
    parts.push(`Notes: ${todo.notes}`);
  }
  if (todo.dueDate) {
    parts.push(`Due: ${todo.dueDate}`);
  }
  if (todo.assignee) {
    parts.push(`Assignee: ${todo.assignee}`);
  }

  return parts.filter(Boolean).join('\n');
}

function loadTodos() {
  const data = readJson(TODO_PATH);
  if (!data?.todos) {
    return [];
  }

  return data.todos.map((todo) => ({
    id: todo.id,
    source: 'todos',
    title: todo.title,
    priority: todo.priority,
    status: todo.status,
    tags: todo.tags || [],
    content: formatTodo(todo),
  }));
}

function formatIssue(issue) {
  const parts = [
    `[Issue ${issue.id} (${issue.priority})] ${issue.title}`,
  ];

  if (issue.body) {
    parts.push(issue.body);
  }

  return parts.join('\n');
}

function loadIssues() {
  if (!fs.existsSync(ISSUES_PATH)) {
    return [];
  }
  const md = fs.readFileSync(ISSUES_PATH, 'utf8');
  const pattern = /### Issue #(\d+)\s*\((P\d)\)\s*—\s*(.+?)\n([\s\S]*?)(?=\n### Issue #|\n## |\n---|$)/g;
  const issues = [];
  let match;

  while ((match = pattern.exec(md)) !== null) {
    const [, number, priority, title, body] = match;
    const issueId = number.padStart(3, '0');
    const cleanBody = body
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^- /gm, '• ')
      .trim();

    issues.push({
      id: `ISSUE-${issueId}`,
      source: 'issues',
      title: title.trim(),
      priority,
      status: 'pending',
      content: formatIssue({
        id: issueId,
        priority,
        title: title.trim(),
        body: cleanBody,
      }),
    });
  }

  return issues;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

async function pushToMem0(records, options, config) {
  const apiKey = process.env.MEM0_API_KEY
    || process.env.OPENMEMORY_API_KEY
    || config?.mem0?.apiKey
    || config?.openmemory?.apiKey;

  if (!apiKey) {
    throw new Error('Mem0/OpenMemory API key not found. Set MEM0_API_KEY, OPENMEMORY_API_KEY, or update .memory-config.json.');
  }

  const endpointBase = options.endpoint || config?.mem0?.endpoint || DEFAULT_ENDPOINT;
  const endpoint = endpointBase.endsWith('/') ? endpointBase : `${endpointBase}/`;
  const userId = options.userId || config?.mem0?.userId || config?.openmemory?.userId || DEFAULT_USER_ID;
  const projectId = options.projectId || config?.mem0?.projectId;
  const orgId = options.orgId || config?.mem0?.orgId;
  const appId = options.appId || config?.mem0?.appId;

  const results = [];

  for (const record of records) {
    const payload = {
      messages: [
        { role: 'system', content: 'Issue import from reference/issues.md for the Karin_gamesite project.' },
        { role: 'user', content: record.content },
      ],
      user_id: userId,
      metadata: {
        source: record.source,
        record_id: record.id,
        title: record.title,
        priority: record.priority,
        status: record.status,
        imported_at: new Date().toISOString(),
      },
      infer: true,
      async_mode: false,
    };

    if (projectId) payload.project_id = projectId;
    if (orgId) payload.org_id = orgId;
    if (appId) payload.app_id = appId;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      const raw = await response.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch (parseError) {
        data = raw;
      }

      if (!response.ok) {
        results.push({
          id: record.id,
          status: 'error',
          httpStatus: response.status,
          body: data,
        });
      } else {
        results.push({
          id: record.id,
          status: 'success',
          body: data,
        });
      }
    } catch (error) {
      results.push({
        id: record.id,
        status: 'error',
        message: error.message,
      });
    }

    if (options.throttle > 0) {
      await sleep(options.throttle);
    }
  }

  return {
    results,
    endpoint,
    userId,
    orgId,
    projectId,
    appId,
  };
}

function logSync(summary) {
  ensureDir(SYNC_LOG_PATH);
  const log = readJson(SYNC_LOG_PATH, []);
  log.push(summary);
  fs.writeFileSync(SYNC_LOG_PATH, JSON.stringify(log, null, 2));
}

function updateLastSync(summary) {
  ensureDir(LAST_SYNC_PATH);
  const existing = readJson(LAST_SYNC_PATH, {});
  const payload = {
    ...existing,
    lastPush: summary.timestamp,
    lastMem0Push: summary.timestamp,
    lastOperation: summary,
  };
  fs.writeFileSync(LAST_SYNC_PATH, JSON.stringify(payload, null, 2));
}

async function main() {
  const options = parseArgs();
  const config = loadConfig();
  const records = [];

  for (const source of options.sources) {
    if (!SUPPORTED_SOURCES.includes(source)) {
      console.warn(`Skipping unsupported source: ${source}`);
      continue;
    }

    if (source === 'todos') {
      records.push(...loadTodos());
    }
    if (source === 'issues') {
      records.push(...loadIssues());
    }
  }

  const uniqueRecords = [];
  const seen = new Set();
  for (const record of records) {
    if (seen.has(record.id)) continue;
    seen.add(record.id);
    uniqueRecords.push(record);
  }

  if (options.limit && options.limit > 0) {
    uniqueRecords.splice(options.limit);
  }

  if (!uniqueRecords.length) {
    console.log('No records found for the selected sources.');
    process.exit(0);
  }

  if (options.dryRun) {
    console.log('--- DRY RUN ---');
    uniqueRecords.forEach((record) => {
      console.log(`\n# ${record.id} (${record.source})`);
      console.log(record.content);
    });
    console.log(`\nTotal records previewed: ${uniqueRecords.length}`);
    return;
  }

  try {
    const { results, endpoint } = await pushToMem0(uniqueRecords, options, config);
    const success = results.filter((r) => r.status === 'success').length;
    const failures = results.filter((r) => r.status !== 'success');

    const summary = {
      timestamp: new Date().toISOString(),
      provider: 'mem0',
      endpoint,
      total: uniqueRecords.length,
      success,
      failure: failures.length,
      sources: options.sources,
      hostname: os.hostname(),
      details: failures.slice(0, 10),
    };

    if (success > 0) {
      logSync(summary);
      updateLastSync(summary);
    }

    console.log(`mem0 push complete. Success: ${success}, Failed: ${failures.length}`);
    if (failures.length) {
      console.log('Failures:');
      failures.forEach((failure) => {
        console.log(` - ${failure.id}: ${failure.httpStatus || ''} ${JSON.stringify(failure.body) || failure.message}`);
      });
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('Failed to push to mem0:', error.message);
    process.exit(1);
  }
}

main();
