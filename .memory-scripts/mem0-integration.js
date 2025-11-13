#!/usr/bin/env node

/**
 * mem0 (OpenMemory) 統合スクリプト
 *
 * 機能:
 * 1. 最小限のセマンティックサマリーを保存 (SHARED_DEV_CONTEXT)
 * 2. セマンティック検索 (最大3件)
 * 3. トークン制限 (30%上限)
 * 4. GitHubプロジェクトデータ管理 (GITHUB_PROJECT_DATA)
 */

const OPENMEMORY_API_KEY = process.env.OPENMEMORY_API_KEY || "m0-r0Q6tu9mlIIN2FHseHc3cnZenf4atIJ0ci97WBgZ";
const MEM0_ENDPOINT = process.env.MEM0_ENDPOINT || "http://localhost:8765";
const USER_ID = "karin_project";
const MAX_TOKEN_RATIO = 0.30; // 30%制限
const MODEL_MAX_TOKENS = 200000; // Sonnet 4.5
const CONTEXT_TOKEN_LIMIT = MODEL_MAX_TOKENS * MAX_TOKEN_RATIO; // 60,000トークン

/**
 * トークン数推定 (簡易版: 文字数 / 4)
 */
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

/**
 * コンテキストデータをトークン制限内に切り詰める
 */
function truncateContext(context) {
  let totalTokens = estimateTokens(JSON.stringify(context));

  if (totalTokens > CONTEXT_TOKEN_LIMIT) {
    console.warn(`⚠️  トークン超過: ${totalTokens} > ${CONTEXT_TOKEN_LIMIT}`);

    // 古い順に削除
    while (totalTokens > CONTEXT_TOKEN_LIMIT && context.length > 0) {
      context.pop();
      totalTokens = estimateTokens(JSON.stringify(context));
    }

    console.log(`✅ 切り詰め後: ${totalTokens} tokens, ${context.length} items`);
  }

  return context;
}

/**
 * タスクサマリーを保存 (最小限のセマンティック情報のみ)
 *
 * @param {Object} taskData - タスクデータ
 * @param {string} taskData.type - タスク種別
 * @param {string[]} taskData.files - 変更ファイル
 * @param {string} taskData.summary - 要約 (最大200文字)
 * @param {string} taskData.status - 状態
 */
async function saveTaskSummary(taskData) {
  const summary = {
    timestamp: new Date().toISOString(),
    task: taskData.type,
    files_changed: taskData.files?.length || 0,
    key_changes: taskData.summary.substring(0, 200), // 200文字制限
    result: taskData.status,
    token_count: estimateTokens(taskData.summary)
  };

  console.log('📝 タスクサマリー保存中...', summary);

  // ローカル保存 (mem0 API利用可能になるまで)
  const fs = require('fs');
  const path = require('path');
  const contextFile = path.join(__dirname, '../.memory/context/dev-context.json');

  let contexts = [];
  if (fs.existsSync(contextFile)) {
    contexts = JSON.parse(fs.readFileSync(contextFile, 'utf8'));
  }

  contexts.unshift(summary); // 新しいものを先頭に
  contexts = truncateContext(contexts); // トークン制限適用

  fs.writeFileSync(contextFile, JSON.stringify(contexts, null, 2));
  console.log(`✅ 保存完了: ${contextFile}`);

  return summary;
}

/**
 * 関連コンテキストを検索 (最大3件)
 *
 * @param {string} currentTask - 現在のタスク説明
 * @returns {Array} トップ3の関連コンテキスト
 */
async function getRelevantContext(currentTask) {
  console.log('🔍 コンテキスト検索中...', currentTask);

  const fs = require('fs');
  const path = require('path');
  const contextFile = path.join(__dirname, '../.memory/context/dev-context.json');

  if (!fs.existsSync(contextFile)) {
    console.log('📭 コンテキストファイルなし');
    return [];
  }

  const contexts = JSON.parse(fs.readFileSync(contextFile, 'utf8'));

  // 簡易セマンティック検索 (キーワードマッチング)
  const keywords = currentTask.toLowerCase().split(/\s+/);
  const scored = contexts.map(ctx => {
    const text = JSON.stringify(ctx).toLowerCase();
    const score = keywords.reduce((acc, kw) => {
      return acc + (text.includes(kw) ? 1 : 0);
    }, 0);
    return { ctx, score };
  });

  // スコア順にソート、トップ3取得
  const top3 = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.ctx);

  console.log(`✅ 検索結果: ${top3.length}件`);
  return top3;
}

/**
 * GitHubプロジェクトデータを保存
 *
 * @param {Object} projectData - プロジェクトメタデータ
 */
async function saveGitHubProjectData(projectData) {
  console.log('💾 GitHubプロジェクトデータ保存中...');

  const fs = require('fs');
  const path = require('path');
  const dataFile = path.join(__dirname, '../.memory/context/github-project-data.json');

  const data = {
    key: "GITHUB_PROJECT_DATA",
    last_updated: new Date().toISOString(),
    ...projectData
  };

  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  console.log(`✅ 保存完了: ${dataFile}`);

  return data;
}

/**
 * GitHubプロジェクトデータを取得
 */
async function getGitHubProjectData() {
  const fs = require('fs');
  const path = require('path');
  const dataFile = path.join(__dirname, '../.memory/context/github-project-data.json');

  if (!fs.existsSync(dataFile)) {
    console.log('📭 GitHubプロジェクトデータなし');
    return null;
  }

  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

// CLI実行
if (require.main === module) {
  const [,, command, ...args] = process.argv;

  switch (command) {
    case 'save-task':
      const taskData = JSON.parse(args[0]);
      saveTaskSummary(taskData).then(() => process.exit(0));
      break;

    case 'search':
      const query = args.join(' ');
      getRelevantContext(query).then(results => {
        console.log(JSON.stringify(results, null, 2));
        process.exit(0);
      });
      break;

    case 'save-github':
      const githubData = JSON.parse(args[0]);
      saveGitHubProjectData(githubData).then(() => process.exit(0));
      break;

    case 'get-github':
      getGitHubProjectData().then(data => {
        console.log(JSON.stringify(data, null, 2));
        process.exit(0);
      });
      break;

    default:
      console.log(`
使用方法:
  node mem0-integration.js save-task '{"type":"タスク名","files":["file.js"],"summary":"要約","status":"完了"}'
  node mem0-integration.js search "キーワード"
  node mem0-integration.js save-github '{"repository":"...","latest_commit_sha":"..."}'
  node mem0-integration.js get-github
      `);
      process.exit(1);
  }
}

module.exports = {
  saveTaskSummary,
  getRelevantContext,
  saveGitHubProjectData,
  getGitHubProjectData,
  truncateContext,
  estimateTokens
};
