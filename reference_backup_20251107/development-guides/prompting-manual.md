
# Karin Gamesite プロンプティングマニュアル（MVP/Walking Skeleton設計・WordPress運用対応）

## 📋 このマニュアルについて

このマニュアルは、Karin Gamesite（エロゲサイトMVP/Walking Skeleton）開発のためのAIプロンプティング・設計・運用ガイドです。
静的Webページ＋WordPressによる最新情報更新（news.html階層）を前提とし、実装・運用・テスト・拡張までの全工程をカバーします。

---

## 🎯 開発フロー全体像（MVP/Walking Skeleton）

1. 計画・設計（MVP/Walking Skeleton仕様）
2. サイトマップ・要件・実装計画の整理
3. Issue分割（各ページ・機能単位、優先度・依存関係明記）
4. 静的Webページ実装（HTML/CSS/JS/画像）
5. WordPress運用部分（news.html階層）設計・連携
6. テスト（機能・表示・アクセシビリティ・SEO・画像最適化）
7. 統合・デプロイ（静的：Netlify/Vercel等、WP：推奨ホスティング）

---

## 📚 Section 1: サイト構成・運用方針

### 1-1. 静的Webページ vs WordPress運用

- **静的Webページ**：index.html, opening.html, main.html, pages/story.html, pages/characters.html, pages/gallery.html, pages/special.html, pages/download.html, pages/spec.html
- **WordPress運用**：pages/news.html（最新情報・お知らせのみWPで管理）

### 1-2. WordPress連携方法（推奨）

- **WP REST API連携**：静的サイト側でWPのREST API（例：/wp-json/wp/v2/posts）を定期フェッチし、news.htmlに最新情報を自動反映
- **RSS連携**：WPのRSSフィードを静的側でパースして表示
- **手動エクスポート/インポート**：WP管理画面からエクスポート→静的サイトに反映（初期MVPでは手動でも可）
- **ヘッドレスWP**：将来的にAPI連携強化時に検討

### ✅ あなたのワークフローは正しい

**フィードバックへの回答**:

> ❌ 実装（コーディング）が完全に未着手
> → **これは問題ではありません**。あなたの計画通り、「ワークフロー完成後にIssue分割して着手」は適切な開発プロセスです。

> ❌ アセットファイルの準備不足
> → **これも問題ではありません**。サイトマップとIssue分割に基づいて個別指示を出す計画は正しいアプローチです。

**つまり**: 計画フェーズを丁寧に行い、Issue分割してから実装に入るのは、**プロフェッショナルな開発プロセス**です。

---

## 📚 Section 1: 開発プロセスの理解

### 1-1. ワークフロー完成後の進め方

#### ステップ1: Issue分割の実施

**良いプロンプト例**:
```
サイトマップと実装計画を元に、Issue（タスク）を分割してください。
以下の観点で分類してください：

1. HTML構造の作成
2. CSS実装
3. JavaScript実装
4. アセット準備（画像・動画）
5. テスト項目

各Issueには以下を含めてください：
- タスク名
- 説明
- 必要なファイル
- 依存関係
- 推定作業時間
```

#### ステップ2: 優先順位付け

**良いプロンプト例**:
```
作成したIssueリストに優先順位を付けてください。
基準：
1. 依存関係（他のタスクが依存するもの）
2. リスク（技術的に難しいもの）
3. 価値（ユーザーに見える部分）
```

#### ステップ3: 個別Issue着手

**良いプロンプト例**:
```
Issue #001: 年齢確認ページのHTML構造作成

以下の要件を満たすindex.htmlを作成してください：
- セマンティックなHTML5構造
- 背景レイヤーとオーバーレイレイヤー
- 2つのボタン（18歳以上/18歳未満）
- レスポンシブ対応のmeta設定

参考: reference/walking-skeleton-flow.md の仕様
```

---


## 📚 Section 2: 法的・倫理的・アクセシビリティ・セキュリティ要件

### 2-1. 年齢確認（age gate）
- サイト読込時点で年齢確認画面（index.html）を表示
- 文言：「１８歳以下は入場できません。」
- ボタン：「Enter（18歳以上）」「退出する（18歳未満）」
- 退出時はGoogleトップ（https://www.google.com）へ遷移
- **法的留意点**：日本国内向け（18歳未満入場不可、記録不要、Cookie/localStorageは利用しない）

### 2-2. 利用規約・プライバシーポリシー
- 成人向けコンテンツのため、利用規約・プライバシーポリシーのプレースホルダーを設置（footer等にリンク）
- 保存場所：`pages/privacy.html` `pages/terms.html`（内容は後日追加）

### 2-3. アクセシビリティ受入基準（Definition of Doneに追加）
- ボタンはキーボード操作可能（tab/enter）
- aria-label/role属性を主要UIに付与
- 画像にはalt属性を必須
- コントラスト比はWCAG AA以上
- フォーカス時の視認性（outline等）

### 2-4. セキュリティ・プライバシー
- 年齢判定はCookie/localStorage/サーバー保存なし（MVPでは記録不要）
- .envや秘密情報は.gitignoreで除外
- デプロイ時はPlatform環境変数/Secrets Manager等で機密管理

## 📚 Section 3: デプロイ・運用・CI/CD
### 3-1. 静的ファイルホスティング案
- Netlify/Vercel：自動デプロイ・SSL・フォーム・画像最適化
- GitHub Pages：無料・静的のみ
- S3+CloudFront：大規模配信向け
### 3-2. WordPressホスティング案
- さくらWP/ConoHaWP/ロリポWP等（管理画面・API利用可）
### 3-3. CI/CDフロー例
- GitHub Actions/Netlify/Vercelで「プルリク→ビルド→ステージング→本番」
- package.json例：
```json
{
  "name": "karin-gamesite",
  "version": "0.1.0",
  "description": "エロゲサイト - Walking Skeleton",
  "scripts": {
    "dev": "npx serve .",
    "build": "echo '静的サイトはビルド不要'",
    "test": "echo 'テストは手動またはE2Eで実施'"
  }
}
```

## 📚 Section 4: テスト・検証・画像最適化・SEO
### 4-1. テスト方針
- JSユニットテスト（Jest等）
- E2Eテスト（Playwright/Cypress等）で年齢ゲート・遷移・表示確認
- ブラウザ互換性：Chrome, Firefox, Safari, Edge（IE除外）
- 推奨テスト解像度：1920x1080, 1366x768, 768x1024, 375x667, 360x640
### 4-2. 画像・メディア管理
- 画像はWebP変換・自動リサイズ・srcset対応（imagemagick, sharp, Squoosh推奨）
- 命名規則：`slide-01.png` `thumb-01.jpg`（ゼロ埋め・用途別ディレクトリ）
### 4-3. SEO・メタ情報
- 各ページにmeta title/description/OGタグ/canonicalを設置
- news.htmlはWP側で自動生成、静的側は手動設置
### 4-4. ローカルメモリ / OpenMemory運用
- OpenMemoryは指示がある場合のみ記録
- 保存ポリシー：設計決定のみ、個人情報は保存しない


## 📚 Section 5: Issue分割テンプレート・サンプル

### Issueテンプレート例
```
## Issue #001: 年齢確認ページのHTML構造作成

### 目的
18禁サイトの年齢確認ゲートを実装する

### 詳細
- index.htmlのHTML5セマンティック構造
- 背景画像レイヤー＋オーバーレイ
- 「Enter」「退出する」ボタン
- レスポンシブmeta設定

### 受入基準 (Definition of Done)
- [ ] ボタンはキーボード操作可能
- [ ] aria-label/role属性付与
- [ ] 画像alt属性
- [ ] コントラスト比AA以上
- [ ] 退出時Googleトップ遷移

### 必要なファイル
- 作成: index.html, css/age-verification.css, js/age-verification.js
- 参照: assets/images/age-verification/background.jpg

### 依存関係
- 前提: サイトマップ・要件定義
- 後続: opening.html実装

### 推定時間
2時間
```

---

## 🎯 まとめ: プロンプティングチェックリスト

- [ ] 具体的か：曖昧な表現を避けている
- [ ] コンテキストを含むか：参照ファイル、要件を明示
- [ ] 検証可能か：完了基準が明確
- [ ] 段階的か：一度に多くを求めすぎていない
- [ ] ファイルパスを明示：入力元、出力先が明確

---

## 📚 関連ドキュメント

- `reference/production-docs/requirements.md` - 要件定義書
- `reference/production-docs/implementation-plan.md` - 実装計画
- `reference/production-docs/walking-skeleton-flow.md` - Walking Skeleton仕様
- `reference/production-docs/production-sitemap.md` - サイトマップ

---

**このマニュアルを活用して、効率的なMVP/Walking Skeleton開発を進めてください！** 🎉
- 🔐 機密情報（APIキー、パスワード）を除外
- 💾 自動生成ファイル（ビルド結果）を除外

**プロンプト例**:
```
以下を含む.gitignoreファイルを作成してください：

# OS固有ファイル
.DS_Store
Thumbs.db

# 開発環境
venv/
node_modules/
.env

# 機密情報
.memory-config.json
**/secrets/
**/*_secret.*

# ビルド成果物
dist/
build/
*.min.js
*.min.css

# IDEファイル
.vscode/
.idea/

理由も簡潔にコメントで記載してください。
```

---

### 2-3. package.json の作成

**package.jsonとは**: Node.jsプロジェクトの設定ファイル。依存関係、スクリプト、メタ情報を管理。

**なぜ必要か**:
- 📦 npmパッケージの依存関係を記録
- 🛠️ よく使うコマンドをスクリプト化
- 📄 プロジェクトのメタデータ（名前、バージョン、作者）
- 🔄 他の環境で再現可能（`npm install`だけでセットアップ完了）

**いつ作るべきか**:
- Node.jsツール（npm パッケージ）を使い始めたとき
- ビルドツール（webpack, viteなど）を導入するとき
- チーム開発や将来の自分のために環境を再現可能にしたいとき

**プロンプト例**:
```
このプロジェクト用のpackage.jsonを作成してください。

含める情報:
- name: "karin-gamesite"
- version: "0.1.0"
- description: "エロゲサイト - Walking Skeleton"
- scripts:
  - "dev": ローカルサーバー起動
  - "build": 本番用ビルド
  - "test": テスト実行
- devDependencies: 必要に応じて提案

現時点ではフレームワークを使わないため、最小限の構成で構いません。
```

---

## 🎓 Section 3: プロンプティングのベストプラクティス

### 3-1. 良いプロンプトの5原則

#### 1. **具体的であること (Specific)**
❌ 悪い例:
```
サイトを作ってください
```

✅ 良い例:
```
年齢確認ページ（index.html）を作成してください。

要件:
- HTML5セマンティックタグを使用
- 背景画像レイヤー + オーバーレイ構造
- 2つのボタン（18歳以上、18歳未満）
- レスポンシブ対応

参考ファイル: reference/requirements.md
```

---

#### 2. **コンテキストを含めること (Context-rich)**
❌ 悪い例:
```
CSSを書いてください
```

✅ 良い例:
```
年齢確認ページ（index.html）用のCSSを作成してください。

デザイン要件:
- カラーパレット: reference/requirements.md 参照
- フルスクリーン背景
- ボタンのホバーエフェクト（拡大、グロー）
- レスポンシブ: デスクトップ（横並び）、スマホ（縦並び）

出力先: css/age-verification.css
```

---

#### 3. **参照を明示すること (Reference-based)**
❌ 悪い例:
```
スライドショーを作ってください
```

✅ 良い例:
```
オープニングページのスライドショーを実装してください。

仕様参照:
- reference/walking-skeleton-flow.md の「Phase 2」
- reference/requirements.md の「ページ2: オープニング」

実装要件:
- 2秒ごとに画像切り替え
- フェードイン/アウトアニメーション
- スキップボタン
- プログレスバー

出力先: js/opening.js
```

---

#### 4. **検証可能であること (Verifiable)**
❌ 悪い例:
```
動くようにしてください
```

✅ 良い例:
```
年齢確認ページを実装してください。

完了基準:
1. ✅ ボタンをクリックするとopening.htmlへ遷移する
2. ✅ ホバー時にボタンが拡大する
3. ✅ スマホ表示で縦並びになる
4. ✅ デスクトップで横並びになる

実装後、動作確認手順も記載してください。
```

---

#### 5. **段階的であること (Incremental)**
❌ 悪い例:
```
サイト全体を一度に完成させてください
```

✅ 良い例:
```
Walking Skeletonを3段階で実装します。

Phase 1: 年齢確認ページ（今回）
- index.html の最小限の構造
- 基本的なCSS
- ボタンの遷移ロジック

Phase 2: オープニングページ（次回）
Phase 3: メインページ（次々回）

まずPhase 1から始めてください。
```

---

### 3-2. Issue分割のテンプレート

**プロンプト例**:
```
以下のテンプレートでIssueを作成してください。

## Issue #001: [タスク名]

### 目的
[このIssueで達成すること]

### 詳細
[具体的な作業内容]

### 受入基準 (Definition of Done)
- [ ] 要件1
- [ ] 要件2
- [ ] 要件3

### 必要なファイル
- 作成: [ファイル名]
- 参照: [参考ファイル]

### 依存関係
- 前提: [このIssueの前に完了すべきタスク]
- 後続: [このIssue完了後に着手できるタスク]

### 推定時間
[XX時間]

---

このテンプレートで全Issueを作成してください。
```

---

### 3-3. デバッグ・トラブルシューティングのプロンプト

**パターンA: エラーが発生した場合**
```
以下のエラーが発生しました。原因を特定して修正してください。

エラーメッセージ:
[エラーログをそのまま貼り付け]

発生状況:
- 操作: [何をしたか]
- 環境: [ブラウザ、OS]
- 期待動作: [本来どうなるべきか]

関連ファイル:
- [エラーが発生したファイル]
```

**パターンB: 期待通りに動作しない場合**
```
[機能名]が期待通りに動作しません。

現在の動作:
[実際にどうなっているか]

期待する動作:
[どうなるべきか]

確認済みの項目:
- [ ] HTML構造は正しい
- [ ] CSSが読み込まれている
- [ ] JavaScriptエラーがない（Console確認済み）

デバッグをお願いします。
```

---

## 🔄 Section 4: 統合ワークフロー

### 実践例: このプロジェクトでの推奨フロー

#### Week 1: Issue分割と環境整備

**Day 1**:
```
1. サイトマップと実装計画を元に、全Issueを作成してください
2. gitリポジトリを初期化してください
3. .gitignore と package.json を作成してください
```

**Day 2**:
```
Issue #001: 年齢確認ページのHTML構造を作成してください
- reference/walking-skeleton-flow.md を参照
- 最小限の動作するバージョン
```

**Day 3**:
```
Issue #002: 年齢確認ページのCSSを実装してください
- css/variables.css を先に作成
- css/age-verification.css を実装
```

#### Week 2: 実装とテスト

**Day 4-7**:
各Issueを順次実行

---

## 📊 Section 5: メモリシステムの活用

### OpenMemory + ローカルメモリの使い分け

#### いつOpenMemoryに保存するか

**保存すべき情報**:
```
[このプロジェクトについて記憶してください]

プロジェクト名: Karin_gamesite
目的: エロゲサイトMVP制作
技術スタック: HTML5, CSS3, Vanilla JavaScript
現在のフェーズ: Issue分割完了、実装開始前
重要な決定事項:
- MVPではReact/Vueを使わない
- 動画は静的画像で代替
- Walking Skeletonから段階的に構築
```

**取得するとき**:
```
このプロジェクトの技術スタックを教えてください
```

#### ローカルメモリの活用

```
プロジェクトの設計決定を .memory/context/decisions.json に保存してください。

内容:
- 決定001: Vanilla JavaScriptを採用
- 理由: シンプルさ、学習コスト削減
- 日付: 2025-11-06
```

---

## 🎯 まとめ: プロンプティングチェックリスト

新しいタスクを依頼するときは、以下を確認してください：

- [ ] **具体的か**: 曖昧な表現を避けている
- [ ] **コンテキストを含むか**: 参照ファイル、要件を明示
- [ ] **検証可能か**: 完了基準が明確
- [ ] **段階的か**: 一度に多くを求めすぎていない
- [ ] **ファイルパスを明示**: 入力元、出力先が明確

---

## 🚀 次のステップ

このマニュアルを活用して、次のプロンプトを試してください：

```
サイトマップ（reference/reference-site-sitemap.md）と
実装計画（reference/implementation-plan.md）を元に、
全Issueを作成してください。

テンプレート: このマニュアルの Section 3-2 を参照
優先順位付けも行ってください。

出力先: reference/issues.md
```

---

## 📚 関連ドキュメント

- `reference/requirements.md` - 要件定義書
- `reference/implementation-plan.md` - 実装計画
- `reference/walking-skeleton-flow.md` - Walking Skeleton仕様
- `reference/conversation-analysis.md` - 会話履歴分析
- `reference/shared-memory-architecture.md` - 共有メモリアーキテクチャ

---

**このマニュアルを活用して、効率的な開発を進めてください！** 🎉
