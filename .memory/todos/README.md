# TODO System

> **プロセスに依存しない永続的なTODO管理システム**
> **作成日**: 2025-11-08

---

## 📋 概要

このTODOシステムは、特定のプロセスやセッションに依存せず、プロジェクト全体で共有される永続的なタスク管理を提供します。

### 特徴
- ✅ **永続的**: セッションをまたいで保存される
- ✅ **プロセス独立**: Claude Code、Codex CLI、手動編集すべてに対応
- ✅ **構造化**: JSON形式でプログラムから操作可能
- ✅ **柔軟**: ステータス、優先度、カテゴリ、タグで分類
- ✅ **統合**: メモリシステムの一部として動作

---

## 📁 ファイル構成

```
.memory/todos/
├── README.md           # このファイル
├── todos.json          # TODOデータベース（メイン）
└── exports/            # エクスポートファイル保存先
    ├── todos-2025-11-08.md
    └── todos-2025-11-08.json
```

---

## 📝 データ構造

### TODOオブジェクト

```json
{
  "id": "TODO-001",
  "title": "Issue分割の実施",
  "description": "production-sitemap.mdを基にGitHub Issueを作成",
  "status": "pending",
  "priority": "high",
  "category": "planning",
  "tags": ["issue", "planning", "walking-skeleton"],
  "createdAt": "2025-11-08T00:00:00Z",
  "updatedAt": "2025-11-08T00:00:00Z",
  "completedAt": null,
  "dueDate": null,
  "assignee": null,
  "relatedFiles": [
    "reference/production-docs/production-sitemap.md"
  ],
  "notes": "Phase 1（年齢確認ページ）から着手予定"
}
```

### ステータス
- `pending` - 未着手
- `in_progress` - 作業中
- `completed` - 完了

### 優先度
- `critical` - 🔴 最優先（プロジェクト全体に影響）
- `high` - 🟠 高優先度（主要機能）
- `medium` - 🟡 中優先度（通常タスク）
- `low` - 🟢 低優先度（改善・最適化）

### カテゴリ
- `planning` - 計画・設計
- `setup` - 環境構築
- `testing` - テスト
- `implementation` - 実装
- `deployment` - デプロイ
- `maintenance` - メンテナンス
- `tooling` - ツール開発
- `documentation` - ドキュメント作成

---

## 🛠️ 使い方

### 1. コマンドラインツール

#### TODOリストの表示
```bash
# 全TODOを表示
node .memory-scripts/todo-manager.js list

# ステータスでフィルタ
node .memory-scripts/todo-manager.js list pending
node .memory-scripts/todo-manager.js list in_progress
node .memory-scripts/todo-manager.js list completed

# 優先度でフィルタ
node .memory-scripts/todo-manager.js list pending high
```

#### 新規TODO追加
```bash
node .memory-scripts/todo-manager.js add "タスク名" "説明"
```

#### TODO更新
```bash
# ステータス変更
node .memory-scripts/todo-manager.js update TODO-001 status in_progress

# 優先度変更
node .memory-scripts/todo-manager.js update TODO-001 priority critical

# タイトル変更
node .memory-scripts/todo-manager.js update TODO-001 title "新しいタイトル"
```

#### TODO完了
```bash
node .memory-scripts/todo-manager.js complete TODO-001
```

#### TODO削除
```bash
node .memory-scripts/todo-manager.js delete TODO-001
```

#### 統計表示
```bash
node .memory-scripts/todo-manager.js stats
```

#### エクスポート
```bash
# Markdown形式
node .memory-scripts/todo-manager.js export md

# JSON形式
node .memory-scripts/todo-manager.js export json
```

---

### 2. 直接編集

[todos.json](todos.json)を直接編集することも可能です。

```bash
# エディタで開く
code .memory/todos/todos.json
```

**注意**: 手動編集後は、`lastUpdated`と`metadata`が自動更新されないため、次回スクリプト実行時に更新されます。

---

### 3. Claude Code / Codex CLIからの利用

#### Claude Codeでの使用例
```
「TODOリストを見せて」
「TODO-001を完了にして」
「新しいTODOを追加: ギャラリーページ実装」
```

#### Codex CLIでの使用例
```bash
codex ask "TODOリストを表示して"
codex ask "優先度が高いTODOは？"
```

---

## 📊 現在のTODO統計

現在の統計情報は[todos.json](todos.json)の`metadata`セクションで確認できます。

```json
"metadata": {
  "totalTodos": 12,
  "statusCounts": {
    "pending": 7,
    "in_progress": 1,
    "completed": 4
  },
  "priorityCounts": {
    "critical": 1,
    "high": 2,
    "medium": 6,
    "low": 2
  },
  "categoryCounts": {
    "planning": 1,
    "setup": 1,
    "implementation": 6,
    "deployment": 1
  }
}
```

---

## 🎯 現在のTODO（サマリー）

### 🔴 Critical
- **TODO-004**: Phase 1: 年齢確認ページ実装 (in_progress)

### 🟠 High
- **TODO-001**: Issue分割の実施 (pending)
- **TODO-002**: Gitリポジトリの初期化 (pending)

### 🟡 Medium
- **TODO-003**: メモリシステムの動作テスト (pending)
- **TODO-010**: Phase 2: ストーリーページ実装 (pending)
- **TODO-011**: Phase 2: キャラクターページ実装 (pending)

### ✅ Completed
- **TODO-005**: スライドショーのギャラリー画像指定
- **TODO-006**: ロゴ動画演出の実装
- **TODO-007**: レスポンシブ調整（1280pxブレークポイント）
- **TODO-008**: GitHub Pagesへのデプロイ

詳細は[todos.json](todos.json)を参照してください。

---

## 🔗 関連ファイル

### メモリシステム
- [.memory-config.json](../../.memory-config.json) - メモリシステム設定
- [MEMORY-SYSTEM-REVIEW.md](../MEMORY-SYSTEM-REVIEW.md) - メモリシステムレビュー

### 管理スクリプト
- [todo-manager.js](../../.memory-scripts/todo-manager.js) - TODO管理スクリプト

### プロジェクトドキュメント
- [production-sitemap.md](../../reference/production-docs/production-sitemap.md) - 本番サイトマップ
- [implementation-plan.md](../../reference/production-docs/implementation-plan.md) - 実装計画

---

## 💡 ベストプラクティス

### TODO作成時
1. **明確なタイトル**: 何をするか一目でわかるように
2. **詳細な説明**: 実施内容を具体的に記述
3. **適切な優先度**: プロジェクトへの影響度で判断
4. **関連ファイル**: 関係するファイルを必ず記載
5. **タグ付け**: 検索・フィルタのために活用

### TODO管理時
- **定期的なレビュー**: 週に1回はTODOリストを見直す
- **完了時の記録**: 完了したら必ず`complete`コマンドを実行
- **優先度の見直し**: プロジェクト進行に応じて優先度を調整
- **エクスポート**: 重要なマイルストーン前にバックアップ

### セッション間での利用
- セッション開始時: `node .memory-scripts/todo-manager.js list pending`で未完了タスクを確認
- セッション終了時: `node .memory-scripts/todo-manager.js stats`で進捗を確認

---

## 🔄 OpenMemoryとの同期

TODOデータは`.memory-config.json`の設定に従ってOpenMemoryと自動同期されます。

```json
"todos": {
  "path": ".memory/todos/",
  "file": "todos.json",
  "autoBackup": true,
  "managerScript": ".memory-scripts/todo-manager.js"
}
```

---

## 📅 更新履歴

### 2025-11-08
- ✅ TODOシステム初期構築
- ✅ todos.json作成（12個のTODO登録）
- ✅ todo-manager.jsスクリプト実装
- ✅ .memory-config.jsonへの統合
- ✅ README.md作成

---

**最終更新**: 2025-11-08
**ステータス**: TODOシステム稼働中
**次のアクション**: `node .memory-scripts/todo-manager.js list` でTODOを確認

---

**このTODOシステムは、Claude Code、Codex CLI、手動操作のすべてで利用可能です** 🚀
