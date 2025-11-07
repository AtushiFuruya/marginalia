# BUG SYSTEM - 真愛の百合は赤く染まる

## 📋 サイト情報

- **URL**: http://bug-system.com/product/04_mk/
- **タイトル**: 真愛の百合は赤く染まる
- **分析日**: 2025-11-06
- **分析ツール**: Enhanced Web Scraper (Python + Puppeteer)

---

## 📁 含まれるファイル

### 1. sitemap.md (41KB)
完全なサイト構造分析レポート

**内容:**
- 基本情報（URL、タイトル、言語）
- メタデータ（OGP、Twitter Card含む）
- HTML構造（DOCTYPE、HEAD/BODY要素）
- リソース（CSS、JavaScript、画像、動画）
- リンク構造（内部/外部）
- DOM ツリー構造（JSON形式）
- パフォーマンス指標

**用途:**
- サイト全体の理解
- 技術スタックの確認
- 構造の参考

---

### 2. site-analysis-full.json (45KB)
すべての分析データ（JSON形式）

**内容:**
- DOM構造（完全な階層）
- 全メタタグ
- すべてのリンク
- CSS/JSファイルリスト
- 画像・動画リスト

**用途:**
- プログラムでのデータ処理
- 詳細な構造分析
- 自動化ツールへの入力

---

### 3. reference-site-sitemap.md (1.5KB)
簡易版サイトマップ

**内容:**
- 基本的なページ構造
- 主要リンク

**用途:**
- クイックリファレンス
- 概要把握

---

### 4. reference-site-sitemap.json (2KB)
簡易版サイトマップ（JSON）

---

### 5. site-source.html (211B)
HTMLソースコード

**注意**: 404エラーページの可能性あり

---

### 6. site-analysis.json (1.7KB)
基本的な分析データ（Puppeteer版）

---

## 🏗️ サイト構造の要点

### 技術スタック
- **HTML**: XHTML 1.0 Transitional
- **CSS**: 3ファイル（reset.css, main.css, colorbox.css）
- **JavaScript**:
  - jQuery 1.11.1
  - Colorbox (画像モーダル)
  - Cookie, Corner プラグイン

### ページ構成
1. **年齢確認モーダル** (#modal)
2. **グローバルナビゲーション** (#glb)
   - Home
   - Story
   - Character
   - Gallery
   - Special
   - Download
   - Spec
3. **コンテンツウィンドウ** (.tgt_win)
   - 各セクションが個別のdivとして実装
   - JavaScript で表示切り替え

### デザインパターン
- **単一ページアプリケーション**（SPA的実装）
- **モーダルウィンドウ** による年齢確認
- **タブ切り替え** によるコンテンツ表示
- **Colorbox** による画像ギャラリー

---

## 📊 抽出データサマリー

| 項目 | 数 |
|-----|---|
| CSSファイル | 3 |
| JavaScriptファイル | 5 |
| 画像 | 8+ |
| 内部リンク | 8 |
| 外部リンク | 7 |
| div要素 | 46 |
| 総要素数 | 284 |

---

## 🎨 参考にすべきポイント

### ✅ 良い点
1. **シンプルな構造**: divベースで理解しやすい
2. **jQuery活用**: アニメーション、モーダルが簡単
3. **Colorbox**: 画像拡大表示が美しい
4. **ローディング画面**: UXが良い

### ⚠️ 改善できる点
1. **SEO**: 単一ページのため検索エンジンに不利
2. **セマンティック**: HTML5タグ（header, nav, main）未使用
3. **アクセシビリティ**: ARIA属性なし
4. **パフォーマンス**: 初回読み込みで全リソース取得

---

## 💡 本番サイトへの応用

### 採用する要素
- ローディング画面
- 画像ギャラリーのモーダル表示
- キャラクター切り替えUI

### 改善する要素
- **マルチページ構成**に変更（SEO対策）
- **HTML5セマンティックタグ**を使用
- **レスポンシブ対応**を強化
- **アクセシビリティ**向上

---

## 🔗 関連ファイル

### 本番用ドキュメント
- `/reference/production-docs/production-sitemap.md`
- `/reference/production-docs/requirements.md`

### 開発ガイド
- `/reference/development-guides/prompting-manual.md`

---

**このサイトを参考に、より良い本番サイトを構築しましょう！** 🚀
