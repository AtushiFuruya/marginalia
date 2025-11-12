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
const DEFAULT_ENDPOINT = 'https://api.openmemory.dev';
const DEFAULT_CLIENT = 'codex-cli';
const SUPPORTED_SOURCES = ['todos', 'issues'];

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    mode: 'push',
    dryRun: false,
    sources: [...SUPPORTED_SOURCES],
    limit: null,
    endpoint: null,
    client: null,
    throttle: 250,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case '--mode':
      case '-m':
        options.mode = args[i + 1] || options.mode;
        i += 1;
        break;
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
      case '--endpoint':
        options.endpoint = args[i + 1];
        i += 1;
        break;
      case '--client':
        options.client = args[i + 1];
        i += 1;
        break;
      case '--throttle':
        options.throttle = parseInt(args[i + 1], 10);
        i += 1;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
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
  console.log(`\nOpenMemory Sync Script\n----------------------\nUsage: node .memory-scripts/sync-openmemory.js [options]\n\nOptions:\n  -m, --mode <push|dry-run>   Sync mode (default: push)\n  -s, --source <list>        Comma separated sources (todos,issues)\n  -l, --limit <number>       Limit number of records to send\n      --dry-run              Preview payload without sending\n      --endpoint <url>       Override API endpoint base URL\n      --client <name>        Override client name for MCP\n      --throttle <ms>        Delay between requests (default: 250ms)\n  -h, --help                 Show help\n`);
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
  const config = readJson(CONFIG_PATH, {});
  return config || {};
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

async function pushToOpenMemory(records, options, config) {
  const apiKey = process.env.OPENMEMORY_API_KEY || config?.openmemory?.apiKey;
  if (!apiKey) {
    throw new Error('OpenMemory API Key not found. Set OPENMEMORY_API_KEY env or .memory-config.json.');
  }

  const endpointBase = options.endpoint || config?.openmemory?.endpoint || DEFAULT_ENDPOINT;
  const clientName = options.client || config?.openmemory?.clientName || DEFAULT_CLIENT;
  const targetUrl = `${endpointBase.replace(/\/$/, '')}/mcp/add_memories`;

  const results = [];

  for (const record of records) {
    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text: record.content,
          client_name: clientName,
          async_mode: false,
        }),
      });

      const body = await response.text();
      if (!response.ok) {
        results.push({
          id: record.id,
          status: 'error',
          httpStatus: response.status,
          body,
        });
      } else {
        results.push({
          id: record.id,
          status: 'success',
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
    endpoint: targetUrl,
    clientName,
  };
}

function logSync(summary) {
  const log = readJson(SYNC_LOG_PATH, []);
  log.push(summary);
  fs.writeFileSync(SYNC_LOG_PATH, JSON.stringify(log, null, 2));
}

function updateLastSync(summary) {
  const existing = readJson(LAST_SYNC_PATH, {});
  const payload = {
    ...existing,
    lastPush: summary.timestamp,
    lastOperation: summary,
  };
  fs.writeFileSync(LAST_SYNC_PATH, JSON.stringify(payload, null, 2));
}

async function main() {
  const options = parseArgs();
  if (options.mode !== 'push') {
    console.error(`Mode ${options.mode} is not supported yet.`);
    process.exit(1);
  }

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
    const { results, endpoint, clientName } = await pushToOpenMemory(uniqueRecords, options, config);
    const success = results.filter((r) => r.status === 'success').length;
    const failures = results.filter((r) => r.status !== 'success');

    const summary = {
      timestamp: new Date().toISOString(),
      mode: options.mode,
      clientName,
      endpoint,
      total: uniqueRecords.length,
      success,
      failure: failures.length,
      sources: options.sources,
      hostname: os.hostname(),
      details: failures.slice(0, 5),
    };

    if (success > 0) {
      logSync(summary);
      updateLastSync(summary);
    }

    console.log(`Push complete. Success: ${success}, Failed: ${failures.length}`);
    if (failures.length) {
      console.log('Failures:');
      failures.forEach((failure) => {
        console.log(` - ${failure.id}: ${failure.httpStatus || ''} ${failure.message || failure.body}`);
      });
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('Failed to push to OpenMemory:', error.message);
    process.exit(1);
  }
}

main();
