# Karin_gamesite - プロジェクトコンテクスト

## プロジェクト概要

**プロジェクト名**: Karin_gamesite
**種類**: 日本のエロティックゲーム紹介サイト (PC向け)
**開発方針**: Walking Skeleton / MVP (Minimum Viable Product)
**技術スタック**: HTML5, CSS3, Vanilla JavaScript (ES6+)
**アーキテクチャ**: マルチページ構成 (SEO重視)

---

## プロジェクト状態

**現在のフェーズ**: 計画・設計完了 → 次: Issue分割 → 実装着手待ち

**完了済み**:
- ✅ 要件定義書作成 ([reference/production-docs/requirements.md](reference/production-docs/requirements.md))
- ✅ 参考サイト分析完了 (http://bug-system.com/product/04_mk/)
- ✅ 本番用サイトマップ作成 (13ページ構成)
- ✅ ビジュアルサイトマップ作成
- ✅ 実装計画書作成
- ✅ プロンプティングマニュアル作成
- ✅ 開発ガイド整備
- ✅ referenceディレクトリ整理完了
- ✅ OpenMemoryセットアップ完了

**次のステップ**:
1. Issue分割 (実装タスクの詳細化)
2. アセット準備 (HP素材集/ から必要画像/動画を選定)
3. Walking Skeleton実装開始

---

## ディレクトリ構造

### プロジェクトルート
```
Karin_gamesite/
├── HP素材集/                     # アセット集 (画像/動画)
│   ├── キャラクター素材 (PNG)
│   ├── 背景画像 (JPG)
│   ├── ロゴ/メインビジュアル
│   └── 動画素材 (MP4)
│
├── reference/                    # 参照ドキュメント
│   ├── README.md                 # ディレクトリ概要
│   ├── INDEX.md                  # 完全ファイルインデックス
│   ├── analyzed-sites/           # 参考サイト分析
│   ├── production-docs/          # 本番用ドキュメント
│   ├── development-guides/       # 開発ガイド
│   └── screenshots/              # スクリーンショット (今後追加)
│
├── CLAUDE.md                     # Claude Code用ガイダンス
├── package.json                  # npm設定 (Puppeteer/Cheerio)
├── enhanced_scraper.py           # サイト分析ツール (Python)
├── advanced-site-analyzer.js     # サイト分析ツール (Puppeteer)
└── web_scraper_sitemap.py        # シンプルなサイトマップ生成
```

### 本番サイト構造 (実装予定)
```
/
├── index.html                    # 年齢確認ページ
├── opening.html                  # オープニングアニメーション
├── main.html                     # メインページ
├── pages/                        # サブページ
│   ├── story.html
│   ├── characters.html
│   ├── gallery.html
│   ├── special.html
│   ├── download.html
│   ├── spec.html
│   └── news.html
├── css/                          # スタイルシート
│   ├── common.css
│   ├── index.css
│   ├── opening.css
│   ├── main.css
│   └── pages/
├── js/                           # JavaScript
│   ├── common.js
│   ├── age-verification.js
│   ├── opening-animation.js
│   ├── gallery.js
│   └── utils/
└── assets/                       # アセット
    ├── images/
    ├── videos/
    └── fonts/
```

---

## 重要ドキュメント

### 最重要 (毎日参照)
1. **[requirements.md](reference/production-docs/requirements.md)** (8.2KB)
   - 完全な要件定義書
   - 3ページ構成 (年齢確認、オープニング、メインページ)
   - カラーパレット、フォント、アニメーション仕様

2. **[production-sitemap.md](reference/production-docs/production-sitemap.md)** (15KB)
   - 13ページの完全な構造設計
   - ディレクトリ階層詳細
   - 各ページの役割と要件

3. **[prompting-manual.md](reference/development-guides/prompting-manual.md)**
   - AIへの効果的な指示方法
   - Issue分割テンプレート
   - ベストプラクティス5原則

### 重要 (週に数回参照)
- **[implementation-plan.md](reference/production-docs/implementation-plan.md)** - 実装フェーズ計画
- **[walking-skeleton-flow.md](reference/production-docs/walking-skeleton-flow.md)** - MVP仕様
- **[sitemap.md](reference/analyzed-sites/bug-system/sitemap.md)** (41KB) - 参考サイト詳細分析

### 補助 (必要時参照)
- **[conversation-analysis.md](reference/development-guides/conversation-analysis.md)** - 開発プロセス評価
- **[openmemory-setup-guide.md](reference/development-guides/openmemory-setup-guide.md)** - OpenMemory設定
- **[shared-memory-architecture.md](reference/development-guides/shared-memory-architecture.md)** - メモリ共有設計

---

## 技術仕様

### フロントエンド
- **HTML5**: セマンティックマークアップ
- **CSS3**: Flexbox/Grid, アニメーション, レスポンシブ
- **JavaScript**: Vanilla JS (ES6+), モジュール構成

### デザイン
**カラーパレット**:
- プライマリ: `#8B0000` (深紅) - 情熱、禁忌
- セカンダリ: `#2C1810` (ダークブラウン) - 重厚感
- アクセント: `#D4AF37` (ゴールド) - 高級感
- 背景: `#1A1A1A` (チャコールブラック)
- テキスト: `#F5F5F5` (オフホワイト)

**フォント**:
- メイン: 'Noto Serif JP' (明朝体) - 格調高い雰囲気
- サブ: 'Noto Sans JP' (ゴシック体) - 読みやすさ

### アニメーション
- フェードイン/アウト: 0.3-0.5秒
- ホバーエフェクト: 0.2秒
- ページ遷移: 0.5秒
- オープニング扉アニメーション: 3秒

### レスポンシブ
- デスクトップ: 1920px
- タブレット: 768px
- モバイル: 375px

---

## 開発ワークフロー

### 確立された正しい流れ
1. **計画フェーズ** ✅ 完了
   - 要件定義
   - サイトマップ作成
   - 技術選定

2. **Issue分割** ⏳ 次のステップ
   - [prompting-manual.md](reference/development-guides/prompting-manual.md)のテンプレート使用
   - 各ページごとにタスク分割
   - 優先順位付け (Phase 1-4)

3. **アセット準備** ⏳ 次のステップ
   - `HP素材集/` から必要素材を選定
   - リサイズ/最適化
   - `assets/` ディレクトリに配置

4. **実装** ⏳ 待機中
   - Walking Skeleton (Phase 1) から開始
   - 段階的に機能追加
   - 検証とテストを並行

### プロンプティングの5原則
1. **具体的であること** - 曖昧な指示を避ける
2. **コンテキストを含める** - 参照ファイルを明示
3. **参照を明示する** - `reference/` 内のドキュメントを指定
4. **検証可能であること** - 成果物の確認方法を示す
5. **段階的であること** - 一度に多くを要求しない

---

## 参考サイト分析結果

**URL**: http://bug-system.com/product/04_mk/
**タイトル**: 真愛の百合は赤く染まる
**制作**: BUG SYSTEM (ClearRave)

**技術スタック**:
- jQuery 1.11.1
- Colorbox (画像ギャラリー)
- 単一ページアプリケーション

**構造**:
- 284 HTML要素
- 46個の div
- 3つのCSS (external)
- 5つのJS (external)
- 8枚の画像ギャラリー
- 1つの動画 (扉アニメーション)

**主な特徴**:
- ダークテーマ
- 中世ヨーロッパ風デザイン
- 高級感あるゴールドアクセント
- 扉が開くオープニングアニメーション
- モーダルギャラリー (Colorbox)

---

## ツールとセットアップ

### OpenMemory
**状態**: ✅ セットアップ完了

**設定ファイル**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "openmemory": {
      "command": "npx",
      "args": ["-y", "@openmemory/server"],
      "env": {
        "OPENMEMORY_API_KEY": "om-7r7v2424hjijeg0j05zftbengq4qo15r"
      }
    }
  }
}
```

**用途**:
- Claude CodeとCodex CLIでコンテキスト共有
- プロジェクト情報の永続化
- 会話履歴の記憶

### Python仮想環境
```bash
python3 -m venv venv
source venv/bin/activate
pip install requests beautifulsoup4 urllib3
```

### Node.js依存関係
```bash
npm install
# puppeteer, cheerio インストール済み
```

---

## アセット情報

### HP素材集/ の内容
**キャラクター**:
- イレーヌ.png
- マリィ.png
- クリスタ.png
- ポーリン.png
- グルマン.png
- 司教長.png
- 異端審問官ギース.png

**背景/シーン**:
- 大聖堂シリーズ (複数照明パターン)
- イベントCG
- シーン背景

**ブランディング**:
- ロゴ改変 2.png
- メインビジュアル01.jpg
- メインビジュアル002 2.png

**動画**:
- 扉動き 2.mp4 (オープニング用)

---

## 実装優先順位

### Phase 1: Walking Skeleton (1-2週間)
- [ ] index.html (年齢確認)
- [ ] opening.html (シンプルな扉アニメーション)
- [ ] main.html (基本レイアウトのみ)
- [ ] 基本CSS (レイアウト、カラーパレット)
- [ ] 基本JS (ページ遷移、年齢確認)

### Phase 2: コンテンツ充実 (2-3週間)
- [ ] story.html
- [ ] characters.html
- [ ] gallery.html (基本)
- [ ] 各ページのコンテンツ追加
- [ ] アニメーション強化

### Phase 3: インタラクション (2週間)
- [ ] ギャラリー完全実装
- [ ] スムーズスクロール
- [ ] モーダル実装
- [ ] ホバーエフェクト

### Phase 4: 仕上げ (1週間)
- [ ] special.html
- [ ] download.html
- [ ] spec.html
- [ ] news.html
- [ ] パフォーマンス最適化
- [ ] クロスブラウザテスト

---

## よくある問題と解決策

### Q: どのドキュメントから読むべき？
A: [reference/README.md](reference/README.md) → [requirements.md](reference/production-docs/requirements.md) → [production-sitemap.md](reference/production-docs/production-sitemap.md)

### Q: AIにどう指示を出す？
A: [prompting-manual.md](reference/development-guides/prompting-manual.md) のテンプレートを使用

### Q: 実装の順序は？
A: [implementation-plan.md](reference/production-docs/implementation-plan.md) のPhase 1から順番に

### Q: アセットはどう準備する？
A: `HP素材集/` から必要素材を選定 → リサイズ/最適化 → `assets/` に配置

### Q: 参考サイトの構造を確認したい
A: [sitemap.md](reference/analyzed-sites/bug-system/sitemap.md) (詳細) または [reference-site-sitemap.md](reference/analyzed-sites/bug-system/reference-site-sitemap.md) (簡易版)

---

## Git設定 (今後)

### .gitignore (作成予定)
```
# Dependencies
node_modules/
venv/

# Environment
.env
.env.local

# Build
dist/
build/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Memory
.memory/
*.memory.json

# Sensitive
*_secret*
*_private*
```

### 推奨コミットメッセージ形式
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正
refactor: リファクタリング
test: テスト追加/修正
chore: その他の変更
```

---

## メモリ管理

### ローカルメモリ (.memory/)
- `project-context.md` (このファイル)
- `current-tasks.md` (現在のタスク)
- `decisions.md` (技術的決定の記録)
- `issues.md` (問題と解決策)

### OpenMemory (クラウド)
- プロジェクト全体のコンテキスト
- 会話履歴の要約
- 重要な決定事項
- 頻繁に参照する情報

---

## 連絡先・リソース

### 公式ドキュメント
- Claude Code: https://docs.claude.com/claude-code/
- OpenMemory: https://docs.mem0.ai/openmemory/

### 参考サイト
- BUG SYSTEM: http://www.clearrave.co.jp/
- 参考作品: http://bug-system.com/product/04_mk/

---

## 更新履歴

| 日付 | 更新内容 |
|------|----------|
| 2025-11-06 | プロジェクト初期設定 |
| 2025-11-06 | 参考サイト分析完了 |
| 2025-11-06 | 本番用サイトマップ作成 |
| 2025-11-06 | 開発ガイド整備 |
| 2025-11-06 | referenceディレクトリ整理 |
| 2025-11-07 | プロジェクトコンテクスト保存 |

---

**最終更新**: 2025-11-07
**プロジェクト状態**: 計画完了 / Issue分割待ち
**次のアクション**: Issue分割 → アセット準備 → Walking Skeleton実装
