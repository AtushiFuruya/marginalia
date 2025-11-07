# 共有メモリアーキテクチャ - Claude Code & Codex CLI

## 🎯 目的

Claude CodeとCodex CLIの両方が共通のコンテキストとメモリにアクセスできる統合システムを構築する。

---

## 🏗️ アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────────┐
│                    User Request                             │
│           "これを覚えておいてください"                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Claude Code / Codex CLI                        │
│                   (AI Interface)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐         ┌──────────────────┐
│ Local Memory │         │  OpenMemory      │
│   Storage    │◄───────►│  (Cloud Hosted)  │
│   (JSON/MD)  │  Sync   │                  │
└──────────────┘         └──────────────────┘
        │                         │
        │                         │
        ▼                         ▼
┌─────────────────────────────────────────┐
│      Shared Context Repository          │
│  - Project memories                     │
│  - User preferences                     │
│  - Conversation history                 │
│  - Code snippets & patterns             │
└─────────────────────────────────────────┘
        │
        │
        ▼
┌─────────────────────────────────────────┐
│   Both AI Assistants Can Access         │
│   Claude Code ←→ Codex CLI              │
└─────────────────────────────────────────┘
```

---

## 📁 ディレクトリ構造

```
Karin_gamesite/
├── .memory/                          # 共有メモリディレクトリ
│   ├── context/                      # プロジェクトコンテキスト
│   │   ├── project-info.json        # プロジェクト基本情報
│   │   ├── requirements.json        # 要件定義
│   │   ├── architecture.json        # アーキテクチャ情報
│   │   └── decisions.json           # 設計決定の記録
│   │
│   ├── conversations/                # 会話履歴
│   │   ├── 2025-11-06-session-01.md
│   │   ├── 2025-11-06-session-02.md
│   │   └── index.json               # 会話インデックス
│   │
│   ├── code-snippets/                # コードスニペット
│   │   ├── common-patterns.json
│   │   └── reusable-components.json
│   │
│   ├── user-preferences/             # ユーザー設定
│   │   ├── coding-style.json
│   │   └── project-preferences.json
│   │
│   └── sync/                         # 同期管理
│       ├── last-sync.json           # 最終同期情報
│       └── sync-log.json            # 同期ログ
│
├── .memory-scripts/                  # メモリ管理スクリプト
│   ├── save-memory.js               # ローカル保存スクリプト
│   ├── sync-openmemory.js           # OpenMemory同期
│   ├── query-memory.js              # メモリ検索
│   └── export-memory.js             # メモリエクスポート
│
└── .memory-config.json               # メモリ設定ファイル
```

---

## 🔧 実装仕様

### 1. ローカルメモリストレージ

**フォーマット**: JSON + Markdown

**メモリの種類**:

1. **プロジェクトコンテキスト**
   - プロジェクト名、目的、技術スタック
   - ディレクトリ構造
   - 重要な設計決定

2. **会話履歴**
   - タイムスタンプ付きの会話ログ
   - 重要な決定事項
   - タスクリスト

3. **コードスニペット**
   - 再利用可能なコードパターン
   - よく使うコマンド
   - 設定テンプレート

4. **ユーザー設定**
   - コーディングスタイル
   - プロジェクト固有の設定
   - 好みのツールやライブラリ

---

## 📝 メモリフォーマット例

### project-info.json
```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-06T17:32:00Z",
  "project": {
    "name": "Karin_gamesite",
    "type": "エロゲサイト制作",
    "description": "18禁対象のエロゲーム紹介サイト",
    "techStack": [
      "HTML5",
      "CSS3",
      "Vanilla JavaScript (ES6+)"
    ],
    "status": "MVP開発中",
    "currentPhase": "Walking Skeleton"
  },
  "team": {
    "client": "友人",
    "developer": "ユーザー名"
  },
  "goals": [
    "年齢確認ページの実装",
    "オープニングページの実装",
    "メインギャラリーページの実装"
  ]
}
```

### decisions.json
```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-06T17:32:00Z",
  "decisions": [
    {
      "id": "001",
      "date": "2025-11-06",
      "title": "Vanilla JavaScriptを使用",
      "description": "React/Vue等のフレームワークは使わず、Vanilla JSで実装",
      "reason": "シンプルさと学習コスト削減",
      "status": "confirmed"
    },
    {
      "id": "002",
      "date": "2025-11-06",
      "title": "MVP版では動画を画像で代替",
      "description": "Walking Skeleton版では静的画像を使用",
      "reason": "開発速度とテストの容易さ",
      "status": "temporary"
    }
  ]
}
```

### conversation-session.md
```markdown
# 会話セッション - 2025-11-06

## セッション情報
- **開始時刻**: 2025-11-06 14:00:00
- **AI**: Claude Code
- **トピック**: プロジェクトセットアップ

## 会話履歴

### [14:05] ユーザー
要件定義書を作成してください

### [14:10] Claude
要件定義書を作成しました。ファイルパス: reference/requirements.md

### [14:20] ユーザー
OpenMemoryをセットアップしてください

### [14:35] Claude
OpenMemoryの設定が完了しました。APIキー: om-7r7v2424hjijeg0j05zftbengq4qo15r

## 重要な決定
- Vanilla JavaScriptを使用
- MVP版では動画を静的画像で代替

## 次のタスク
- [ ] 年齢確認ページの実装
- [ ] オープニングページの実装
- [ ] メインページの実装
```

---

## 🔄 動作フロー

### 保存フロー（Claude Code / Codex CLI）

```
1. ユーザー: "これを覚えておいてください: プロジェクト名はKarin_gamesite"
   ↓
2. AI: メモリ保存スクリプトを実行
   ↓
3. ローカルストレージに保存
   .memory/context/project-info.json を更新
   ↓
4. OpenMemoryに同期
   APIを使用してクラウドに保存
   ↓
5. 確認メッセージ
   "✅ 記憶しました: プロジェクト名はKarin_gamesite"
```

### 取得フロー

```
1. ユーザー: "プロジェクト名は何でしたか？"
   ↓
2. AI: メモリ検索
   - まずローカルストレージを検索
   - 見つからなければOpenMemoryから取得
   ↓
3. 結果を返す
   "プロジェクト名は Karin_gamesite です"
```

---

## 🛠️ メモリ管理コマンド

### 保存コマンド
```bash
# ローカルに保存
node .memory-scripts/save-memory.js --type "project" --data "プロジェクト名: Karin_gamesite"

# OpenMemoryに同期
node .memory-scripts/sync-openmemory.js --mode "push"
```

### 検索コマンド
```bash
# ローカル検索
node .memory-scripts/query-memory.js --query "プロジェクト名"

# OpenMemory検索
node .memory-scripts/query-memory.js --query "プロジェクト名" --source "openmemory"
```

### 同期コマンド
```bash
# 双方向同期
node .memory-scripts/sync-openmemory.js --mode "sync"

# ローカル→OpenMemory
node .memory-scripts/sync-openmemory.js --mode "push"

# OpenMemory→ローカル
node .memory-scripts/sync-openmemory.js --mode "pull"
```

---

## 🔐 セキュリティ

### APIキー管理
- `.memory-config.json` に保存
- `.gitignore` に追加（Git管理外）
- 環境変数でも指定可能

### データプライバシー
- ローカルストレージは完全にプライベート
- OpenMemoryへの同期は選択的
- 機密情報は自動的にマスク

---

## 🎯 使用例

### Claude Codeでの使用

```
ユーザー: "このプロジェクトはエロゲサイトで、技術スタックはHTML5、CSS3、Vanilla JavaScriptです。これを覚えておいてください。"

Claude: "記憶しました。以下の情報を保存しました：
- プロジェクトタイプ: エロゲサイト
- 技術スタック: HTML5, CSS3, Vanilla JavaScript

ローカルとOpenMemoryの両方に保存されました。"
```

### Codex CLIでの使用

```bash
$ codex ask "このプロジェクトの技術スタックは何ですか？"

Codex: "共有メモリから取得しました：
技術スタック:
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

この情報はClaude Codeとも共有されています。"
```

---

## 📊 同期戦略

### 自動同期
- ファイル変更時に自動検出
- 5分ごとにバックグラウンド同期
- 重要な変更は即座に同期

### 手動同期
- コマンドラインから明示的に実行
- 選択的な同期（特定のコンテキストのみ）
- エクスポート/インポート機能

---

## 🚀 次のステップ

1. ✅ アーキテクチャ設計完了
2. ⏳ ディレクトリ構造の作成
3. ⏳ メモリ管理スクリプトの実装
4. ⏳ OpenMemory統合
5. ⏳ Codex CLI設定
6. ⏳ テストと検証

---

## 📚 関連ファイル

- `.memory-config.json` - メモリシステム設定
- `.memory-scripts/` - 管理スクリプト
- `.memory/` - ローカルメモリストレージ
- `reference/openmemory-setup-guide.md` - OpenMemoryセットアップガイド
