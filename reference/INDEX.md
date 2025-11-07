# Reference Directory - 完全インデックス

## 📂 ディレクトリ構造

```
reference/
├── README.md                          # このディレクトリの説明
├── INDEX.md                           # このファイル（全ファイル索引）
│
├── analyzed-sites/                    # 参考サイト分析
│   └── bug-system/                    # 真愛の百合は赤く染まる
│       ├── README.md                  # サイト分析の概要
│       ├── ANALYSIS-SUMMARY.md        # 分析サマリー（新規）
│       ├── sitemap-summary.md         # サイトマップ簡易版（旧: reference-site-sitemap.md）
│       ├── sitemap-data.json          # サイトマップJSON（旧: reference-site-sitemap.json）
│       └── site-analysis.json         # 基本分析データ
│
├── production-docs/                   # 本番環境用ドキュメント
│   ├── README.md                      # 使い方ガイド
│   ├── requirements.md                # 要件定義書 (12KB)
│   ├── implementation-plan.md         # 実装計画書 (12KB)
│   ├── walking-skeleton-flow.md       # Walking Skeleton仕様 (16KB)
│   ├── production-sitemap.md          # 本番用サイトマップ (16KB)
│   ├── sitemap-visual.md              # ビジュアルサイトマップ (20KB)
│   └── responsive-design-2025.md      # レスポンシブデザインガイド (20KB) ✨新規
│
├── development-guides/                # 開発ガイド
│   ├── README.md                      # ガイド一覧
│   ├── prompting-manual.md            # AIプロンプティングマニュアル
│   ├── conversation-analysis.md       # 会話履歴分析
│   ├── openmemory-setup-guide.md      # OpenMemoryセットアップ
│   └── shared-memory-architecture.md  # 共有メモリアーキテクチャ
│
└── screenshots/                       # スクリーンショット
    └── (今後追加予定)
```

---

## 📊 ファイル一覧（カテゴリ別）

### 🔍 参考サイト分析（analyzed-sites/bug-system/）

| ファイル名 | サイズ | 説明 | 用途 |
|-----------|-------|------|------|
| **ANALYSIS-SUMMARY.md** ✨ | 4KB | 分析結果サマリー | クイックリファレンス（最優先） |
| **sitemap-summary.md** | 4KB | サイトマップ簡易版 | 構造把握 |
| **sitemap-data.json** | 4KB | サイトマップJSON | データ処理 |
| **site-analysis.json** | 4KB | 基本分析データ | 技術確認 |
| **README.md** | 4KB | サイト分析の概要 | 最初に読むファイル |

**削除されたファイル（重複・不要）:**
- ~~sitemap.md (44KB)~~ - 詳細すぎるため削除
- ~~site-analysis-full.json (48KB)~~ - 実装に不要なため削除
- ~~site-source.html~~ - 分析済みのため削除

**主な内容:**
- タイトル: 真愛の百合は赤く染まる
- 技術: jQuery 1.11.1, Colorbox, 単一ページアプリ
- 構造: 284要素, 46個のdiv, 3つのCSS, 5つのJS
- ギャラリー: 8枚の画像

---

### 📘 本番環境用ドキュメント（production-docs/）

| ファイル名 | サイズ | 重要度 | 説明 | いつ使う |
|-----------|-------|-------|------|---------|
| **requirements.md** | 12KB | 🔴最高 | 要件定義書 | 仕様確認時 |
| **production-sitemap.md** | 16KB | 🔴最高 | 本番用サイトマップ | 構造把握時 |
| **responsive-design-2025.md** ✨ | 20KB | 🔴最高 | レスポンシブガイド | 実装時必須 |
| **sitemap-visual.md** | 20KB | 🟠高 | ビジュアルサイトマップ | 視覚的理解 |
| **implementation-plan.md** | 12KB | 🟠高 | 実装計画書 | 実装開始前 |
| **walking-skeleton-flow.md** | 16KB | 🟡中 | Walking Skeleton仕様 | MVP実装時 |
| **README.md** | 8KB | 🟢補助 | ドキュメント使い方 | 迷った時 |

**主な内容:**
- 13ページの完全な設計図
- ディレクトリ階層
- 技術仕様（HTML5, CSS3, Vanilla JS）
- カラーパレット、フォント定義
- 実装優先順位（Phase 1-4）

---

### 🛠️ 開発ガイド（development-guides/）

| ファイル名 | 対象者 | 説明 | いつ使う |
|-----------|-------|------|---------|
| **prompting-manual.md** | 全員 | AIプロンプティングマニュアル | 指示を出す前 |
| **conversation-analysis.md** | PM/リーダー | プロジェクト分析 | 振り返り時 |
| **openmemory-setup-guide.md** | 開発者 | OpenMemoryセットアップ | 初回設定時 |
| **shared-memory-architecture.md** | 上級者 | 共有メモリ設計 | 統合システム構築時 |
| **README.md** | 全員 | ガイド一覧 | 最初に読む |

**主な内容:**
- プロンプティングベストプラクティス（5原則）
- Issue分割テンプレート
- OpenMemory設定方法
- Claude Code + Codex CLI統合

---

## 🎯 シーン別クイックガイド

### 📍 プロジェクトを初めて理解する
1. `production-docs/README.md` を読む
2. `production-docs/requirements.md` で要件を確認
3. `production-docs/sitemap-visual.md` で構造を視覚的に把握

### 📍 実装を開始する
1. `production-docs/implementation-plan.md` でフェーズを確認
2. `production-docs/walking-skeleton-flow.md` で最初のタスクを理解
3. `development-guides/prompting-manual.md` で効率的な指示方法を学ぶ

### 📍 参考サイトを確認する
1. `analyzed-sites/bug-system/ANALYSIS-SUMMARY.md` でサマリーを確認 ✨
2. `analyzed-sites/bug-system/sitemap-summary.md` で構造を把握
3. `screenshots/` でビジュアルを確認

### 📍 AIに指示を出す
1. `development-guides/prompting-manual.md` のテンプレートを使う
2. 具体的・検証可能・段階的な指示を心がける

### 📍 問題が発生した
1. `development-guides/conversation-analysis.md` で過去の問題を確認
2. `development-guides/prompting-manual.md` のトラブルシューティングを参照

---

## 📈 ドキュメントの重要度

### 最重要（毎日参照）
- ✅ `production-docs/requirements.md`
- ✅ `production-docs/production-sitemap.md`
- ✅ `production-docs/responsive-design-2025.md` ✨
- ✅ `development-guides/prompting-manual.md`

### 重要（週に数回参照）
- 🔵 `production-docs/implementation-plan.md`
- 🔵 `production-docs/walking-skeleton-flow.md`
- 🔵 `analyzed-sites/bug-system/ANALYSIS-SUMMARY.md` ✨

### 補助（必要時に参照）
- 🟢 `development-guides/conversation-analysis.md`
- 🟢 `development-guides/openmemory-setup-guide.md`
- 🟢 各README.md

---

## 🔄 ドキュメント更新履歴

| 日付 | 更新内容 | ファイル |
|-----|---------|---------|
| 2025-11-07 | 重複ファイル削除、整理最適化 | analyzed-sites/bug-system/* |
| 2025-11-07 | レスポンシブデザインガイド追加 | production-docs/responsive-design-2025.md |
| 2025-11-07 | 分析サマリー作成 | analyzed-sites/bug-system/ANALYSIS-SUMMARY.md |
| 2025-11-06 | 初版作成、ディレクトリ整理 | 全ファイル |
| 2025-11-06 | 参考サイト分析完了 | analyzed-sites/bug-system/* |
| 2025-11-06 | 本番用サイトマップ作成 | production-docs/production-sitemap.md |
| 2025-11-06 | プロンプティングマニュアル作成 | development-guides/prompting-manual.md |

---

## 📋 ファイルサイズ一覧

### 大容量ファイル（15KB以上）
- `production-docs/responsive-design-2025.md` (20KB) ✨
- `production-docs/sitemap-visual.md` (20KB)
- `production-docs/production-sitemap.md` (16KB)
- `production-docs/walking-skeleton-flow.md` (16KB)

### 中容量ファイル（10-15KB）
- `production-docs/requirements.md` (12KB)
- `production-docs/implementation-plan.md` (12KB)
- `development-guides/prompting-manual.md` (10KB程度)

### 小容量ファイル（5KB以下）
- その他のMDファイル、JSONファイル

---

## 🔗 外部リンク・参照

### 公式ドキュメント
- Claude Code: https://docs.claude.com/claude-code/
- OpenMemory: https://docs.mem0.ai/openmemory/

### 参考サイト
- 真愛の百合は赤く染まる: http://bug-system.com/product/04_mk/
- BUG SYSTEM公式: http://www.clearrave.co.jp/

---

## ⚠️ 使用上の注意

1. **本番環境にデプロイしない**
   - このディレクトリは開発用
   - `.gitignore` で除外推奨

2. **常に最新に保つ**
   - 実装と乖離しないよう更新
   - 変更履歴を記録

3. **チームで共有**
   - 全員がアクセスできる場所に
   - 更新を通知

4. **カスタマイズOK**
   - プロジェクトに合わせて調整
   - 不要なファイルは削除可

---

## 🎉 このインデックスの使い方

1. **検索機能を活用**
   - Ctrl/Cmd + F でキーワード検索
   - ファイル名、説明、用途で検索

2. **ブックマーク推奨**
   - よく使うファイルをブックマーク
   - VSCodeでピン留め

3. **印刷・PDF化**
   - オフラインでも参照可能に
   - チーム共有用

---

**このインデックスを活用して、効率的にドキュメントを参照してください！** 📚
