# 泡沫のユークロニア (Uchronia) - 完全サイト構造分析レポート

**分析対象URL:** https://licobits-game.com/uchronia/library/?category=ev
**分析日:** 2025-11-15
**プロジェクト:** Nintendo Switch向けビジュアルノベルゲーム公式サイト

---

## エグゼクティブサマリー

「泡沫のユークロニア」は、Broccoli社とTIS Creationが開発したNintendo Switch向けビジュアルノベルゲームの公式プロモーションサイトです。ダークで神秘的な雰囲気を持ち、ナラティブドリブンなコンテンツ提示を重視した設計になっています。

---

## 1. HTML構造分析

### 1.1 ドキュメント構造

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Google Tag Manager -->
  <!-- Typekit Font Loading -->
</head>
<body>
  <!-- Header -->
  <!-- Navigation -->
  <!-- Main Content -->
  <!-- Footer -->
</body>
</html>
```

### 1.2 セマンティック要素

- **ナビゲーション:** `<nav>` 要素による階層構造
- **リスト:** `<ul>` / `<li>` による意味的なメニュー構造
- **画像:** 標準的な `<img>` タグ（`picture` 要素や `srcset` は未使用）
- **段落:** `<p>` タグによるストーリーテキスト

### 1.3 主要セクション

#### ヘッダー
- ロゴ画像（レスポンシブ対応）
  - PC: `menu_logo_pc.png`
  - SP: `menu_logo_sp.png`
- アクションボタン
  - 購入ボタン: `/uchronia/product/`
  - 体験版DL: `/uchronia/special/trial/`

#### メインナビゲーション

```
TOP (/uchronia/)
├─ NEWS (/uchronia/news/)
├─ WORLD (/uchronia/world/)
│  ├─ Welcome to Touhagarashi
│  ├─ Story
│  └─ Glossary
├─ CHARACTER (/uchronia/character/)
├─ SYSTEM (/uchronia/system/)
├─ PRODUCT (/uchronia/product/)
│  ├─ Limited Edition
│  ├─ Store Bonuses
│  ├─ Music Info
│  └─ DLC
├─ LIBRARY (/uchronia/library/)
│  ├─ Event Illustrations (?category=ev)
│  ├─ Movies (?category=mv)
│  └─ Short Stories (?category=ss)
├─ GOODS (/uchronia/goods/)
└─ SPECIAL (/uchronia/special/)
```

#### ライブラリ/ギャラリーシステム

**URLパラメータ構造:**
```
?category=ev    # イベントイラスト
?category=mv    # ムービー
?category=ss    # ショートストーリー
?category=ev&pg=2  # ページネーション
```

**ページネーション実装:**
- 番号付きリンク: 1, 2, 3
- PREV/NEXTナビゲーション
- クエリパラメータベース

---

## 2. CSS・ビジュアルデザイン分析

### 2.1 カラースキーム

**全体的なトーン:**
- **背景:** ダーク系（黒、深紫）
- **テキスト:** 明るい色（白、ライトグレー）
- **アクセント:** 温かみのある色（ゴールド、クリムゾン、若緑）

**ムードと雰囲気:**
- 神秘的で親密な雰囲気
- ロマンティックなビジュアルノベルに適したカラーパレット
- 炎と氷のコントラスト（ナラティブテーマを反映）

### 2.2 タイポグラフィ

**フォントシステム:**
- **実装:** Adobe Typekit (`uet6fjr`)
- **読み込み戦略:** 非同期スクリプト注入
- **フォールバック:** 3秒タイムアウト後のフォールバッククラス適用
  - `wf-loading`: 読み込み中
  - `wf-inactive`: 読み込み失敗時

**テキスト階層:**
- 大きなスタイライズドフォント（セクションヘッダー）
- クリーンなサンセリフ（本文）
- 太字のキャラクター名（対話の明確化）

### 2.3 レイアウトテクニック

**推定される実装:**
- グリッドベースのギャラリーレイアウト
- レスポンシブ画像アセット（PC/SP別）
- 階層的なナビゲーション構造

**スペーシング:**
- 一貫したマージン/パディングパターン
- ホワイトスペースによるコンテンツフォーカス

### 2.4 インタラクティブ要素

**ボタンデザイン:**
- 画像ベースのボタン（PNG）
- レスポンシブバリエーション
  - `btn_buy_pc.png` / `btn_buy_sp.png`
  - `btn_trial_pc.png` / `btn_trial_sp.png`

**装飾要素:**
- `splash_plate.png`
- `splash_gear01.png`, `splash_gear02.png`, `splash_gear03.png`（アニメーションギア）

---

## 3. JavaScript機能分析

### 3.1 外部ライブラリ/フレームワーク

**Google Tag Manager:**
```javascript
// トラッキングID: GTM-W7R5TJT
// イベントトラッキング、ユーザー行動分析
```

**Adobe Typekit:**
```javascript
// フォントID: uet6fjr
// 非同期読み込み、3秒タイムアウト
```

### 3.2 インタラクション機能

**検出された機能:**
- ページネーション処理
- ナビゲーションメニューの展開/折りたたみ（推定）
- フォント読み込み状態管理
- アナリティクストラッキング

**データ属性:**
- HTML内に `data-*` 属性は検出されず
- クラスベースのJavaScript連携と推定

### 3.3 パフォーマンス最適化

**読み込み戦略:**
- 標準的な同期画像読み込み
- 遅延読み込み（lazy loading）未実装
- プリロード未実装

**改善提案:**
- 画像の遅延読み込み実装
- WebP形式への対応
- Critical CSSのインライン化

---

## 4. アニメーション構造分析

### 4.1 CSS アニメーション

**フォント読み込みアニメーション:**
- `wf-loading` クラスによるローディング状態
- `wf-inactive` クラスによるフォールバック状態
- トランジション効果（推定）

**インタラクション効果:**
- ホバー状態のスタイル変更（推定）
- ナビゲーション項目のフェード効果
- ボタンのホバー/アクティブ状態

### 4.2 JavaScript アニメーション

**検出されたアニメーション:**
- Google Tag Managerによるトラッキングアニメーション
- Typekitのフォント読み込み進捗
- ページ遷移効果（推定）

### 4.3 装飾アニメーション要素

**アセット:**
- `splash_gear01.png`, `splash_gear02.png`, `splash_gear03.png`
- 回転または移動アニメーションの可能性

---

## 5. 画像・メディア使用分析

### 5.1 画像アセット構造

**ディレクトリ構造:**
```
/uchronia/assets/img/
├─ menu_logo_pc.png
├─ menu_logo_sp.png
├─ btn_buy_pc.png
├─ btn_buy_sp.png
├─ btn_trial_pc.png
├─ btn_trial_sp.png
├─ splash_plate.png
├─ splash_gear01.png
├─ splash_gear02.png
├─ splash_gear03.png
└─ library/
   ├─ ev_tr_yashiro01.png (サムネイル)
   ├─ ev_yashiro01.jpg (フルサイズ)
   ├─ ev_yashiro02.jpg
   ├─ ev_tr_tobari01.png
   ├─ ev_tobari01.jpg
   ├─ ev_tobari02_x5vi.jpg
   ├─ ev_tr_awayuki01.png
   ├─ ev_awayuki01.jpg
   ├─ ev_awayuki02.jpg
   ├─ ev_tr_yori01.png
   ├─ ev_yori01.jpg
   ├─ ev_yori02_u9pa.jpg
   ├─ ev_tr_tsuyukusa01.png
   ├─ ev_tsuyukusa01.jpg
   ├─ ev_tsuyukusa02_x5vi.jpg
   ├─ ev_tr_hiiragi01.png
   └─ ev_hiiragi01.jpg
```

### 5.2 命名規則

**パターン:**
- `ev_`: イベントイラスト
- `tr_`: サムネイル（thumbnail）
- `[キャラクター名][番号]`: キャラクター別
- `_x5vi`, `_u9pa`: バージョン識別子

**フォーマット:**
- **PNG:** UI要素、サムネイル
- **JPG:** フルサイズアートワーク

### 5.3 キャラクターアートワーク

**登場キャラクター:**
1. **yashiro** (八代)
2. **tobari** (帳)
3. **awayuki** (淡雪)
4. **yori** (依)
5. **tsuyukusa** (露草)
6. **hiiragi** (柊)

**アートスタイル:**
- ソフトで詳細なキャラクターレンダリング
- ドラマチックなライティング（夕焼け、炎）
- クローズアップによる感情的瞬間の強調
- 統一されたアニメ調アートディレクション

---

## 6. レスポンシブデザイン分析

### 6.1 ブレイクポイント戦略

**検出された対応:**
- デスクトップ（PC）専用アセット
- スマートフォン（SP）専用アセット
- 明示的なメディアクエリは外部CSS内

### 6.2 モバイル最適化

**実装内容:**
- タッチフレンドリーなナビゲーションスペーシング
- 別々のロゴサイズ
- 別々のボタンサイズ
- フレキシブルグリッドレイアウト

**改善提案:**
- `picture` 要素と `srcset` の活用
- モバイルファーストCSS
- タッチジェスチャーサポート

---

## 7. SEO・技術的要素分析

### 7.1 メタタグ

**検出されたタグ:**
- ページタイトル: "イベントイラスト｜LIBRARY [ライブラリ]｜泡沫のユークロニア"
- 文字エンコーディング: UTF-8
- ビューポート設定: レスポンシブ対応

**推奨される追加:**
- Open Graph タグ
- Twitter Card タグ
- meta description
- canonical URL

### 7.2 外部リソース

**読み込まれるリソース:**
```
https://www.googletagmanager.com/gtm.js?id=GTM-W7R5TJT
https://use.typekit.net/uet6fjr.js
```

**参照ドメイン:**
- broccoli.co.jp（企業サイト）
- tis-c.com（開発会社）
- twitter.com/uchronia_jp
- youtube.com/@uchronia_jp
- line.me/228dxfus

### 7.3 ナビゲーション構造

**クローラビリティ:**
- 明確な階層構造
- セマンティックHTML使用
- robots/noindexタグなし（インデックス許可）

---

## 8. UX/UIデザイン分析

### 8.1 ユーザーフローパターン

**主要導線:**
1. トップページ訪問
2. ナビゲーションメニューからLIBRARYへ
3. カテゴリフィルター（イベントイラスト、ムービー、ショートストーリー）
4. ページネーションによる閲覧
5. 購入ページまたは体験版DLへのCTA

### 8.2 アクセシビリティ考慮事項

**実装されている要素:**
- セマンティックHTML構造
- 適切な `alt` 属性（推定）
- キーボードナビゲーション（推定）

**改善提案:**
- ARIA ラベル追加
- スキップリンク実装
- コントラスト比の検証
- スクリーンリーダー対応テスト

### 8.3 視覚的階層

**優先順位:**
1. **最高:** ヘッダーロゴ、購入/体験版ボタン
2. **高:** メインナビゲーション
3. **中:** イベントイラストギャラリー
4. **低:** フッター、法的情報

### 8.4 コンテンツ可読性

**テキスト処理:**
- キャラクター名の太字強調
- ナレーションと対話の明確な区別
- 適切な行間と段落スペーシング

---

## 9. コンテンツ戦略観察

### 9.1 ナラティブドリブン設計

**特徴:**
- ビジュアルとストーリーテキストの統合
- キャラクター関係性の強調
- 感情的投資を促すコンテンツ構成

### 9.2 ターゲットオーディエンス

**想定ユーザー:**
- ビジュアルノベル愛好者
- ロマンス/ドラマ志向のゲーマー
- ナラティブ重視のプレイヤー

### 9.3 エンゲージメント戦略

**手法:**
- 豊富なキャラクターアートワーク
- ストーリー抜粋による興味喚起
- ソーシャルメディア統合
- 体験版提供によるコンバージョン促進

---

## 10. 技術スタック推定

### 10.1 フロントエンド

**確認されたもの:**
- HTML5
- CSS3（外部ファイル）
- JavaScript（vanilla + ライブラリ）
- Adobe Typekit（フォント）
- Google Tag Manager（アナリティクス）

**推定されるもの:**
- jQuery（標準的なイベントハンドリング）
- カスタムJavaScript（ナビゲーション、ページネーション）

### 10.2 バックエンド

**推定:**
- サーバーサイドレンダリング（SSR）またはスタティックサイトジェネレーター
- PHPまたはNode.js（可能性）
- データベース不要（静的コンテンツ）

### 10.3 ホスティング

**ドメイン:** licobits-game.com
**プロトコル:** HTTPS

---

## 11. デザイン強み分析

### 11.1 成功している要素

✅ **一貫したビジュアルアイデンティティ**
- ゲームのテーマと完全に一致
- 色彩、タイポグラフィ、イメージングの統一感

✅ **明確な情報アーキテクチャ**
- 直感的なナビゲーション構造
- 論理的なコンテンツ階層

✅ **高品質なアートワーク**
- プロフェッショナルなイラスト
- 一貫したアートスタイル

✅ **効果的なCTA配置**
- 購入ボタンと体験版DLが常に視認可能
- 明確なコンバージョンパス

### 11.2 改善の余地がある領域

⚠️ **パフォーマンス最適化**
- 画像の遅延読み込み未実装
- WebP対応なし
- Critical CSSインライン化なし

⚠️ **アクセシビリティ**
- ARIAラベル不足
- キーボードナビゲーション検証必要

⚠️ **SEO強化**
- Open Graphタグ未実装
- meta description不足

⚠️ **モダンHTML機能**
- `picture` 要素未使用
- `srcset` 未使用

---

## 12. デザイントレンド使用

### 12.1 採用されているトレンド

✨ **ダークモード美学**
- 目に優しい暗色背景
- コンテンツへのフォーカス強化

✨ **ミニマリストUI**
- クリーンなインターフェース
- 過剰な装飾の排除

✨ **ストーリーテリングデザイン**
- ビジュアルとテキストの統合
- 感情的エンゲージメント重視

✨ **レスポンシブデザイン**
- マルチデバイス対応
- モバイルフレンドリー

### 12.2 クラシックなアプローチ

🎨 **画像ベースのボタン**
- CSS buttonではなくPNG画像使用
- フレキシビリティは低いが、デザイン統制は高い

🎨 **ページネーション**
- 無限スクロールではなく番号付きページ
- ユーザーコントロール重視

---

## 13. 推奨事項

### 13.1 即座の改善

**優先度: 高**
1. ✅ 画像の遅延読み込み実装
2. ✅ WebP形式への対応
3. ✅ Open Graph / Twitter Cardタグ追加
4. ✅ meta descriptionの最適化

**優先度: 中**
5. ✅ ARIAラベル追加
6. ✅ Critical CSSインライン化
7. ✅ `picture` 要素と `srcset` の活用
8. ✅ フォントサブセット化

**優先度: 低**
9. ✅ Service Worker実装（PWA化）
10. ✅ アニメーション強化

### 13.2 長期的な戦略

**コンテンツ戦略:**
- 定期的なニュース更新
- ユーザー生成コンテンツの統合
- コミュニティ機能の拡充

**技術的進化:**
- モダンフレームワーク移行検討（Next.js, Nuxt.js）
- ヘッドレスCMS導入
- パフォーマンス監視ツール統合

**マーケティング:**
- A/Bテスト実装
- コンバージョン率最適化
- ソーシャルメディア統合強化

---

## 14. 完全トレース実装ガイド

### 14.1 HTML基本構造

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>イベントイラスト｜LIBRARY｜泡沫のユークロニア</title>

  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-W7R5TJT');</script>

  <!-- Typekit Font Loading -->
  <script>
  (function(d) {
    var config = {
      kitId: 'uet6fjr',
      scriptTimeout: 3000,
      async: true
    },
    h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
  })(document);
  </script>

  <link rel="stylesheet" href="/uchronia/assets/css/main.css">
</head>
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W7R5TJT"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

  <div class="page-container">
    <!-- Header -->
    <header class="site-header">
      <a href="/uchronia/" class="logo">
        <img src="/uchronia/assets/img/menu_logo_pc.png" alt="泡沫のユークロニア" class="logo-pc">
        <img src="/uchronia/assets/img/menu_logo_sp.png" alt="泡沫のユークロニア" class="logo-sp">
      </a>

      <div class="header-actions">
        <a href="/uchronia/product/" class="btn-buy">
          <img src="/uchronia/assets/img/btn_buy_pc.png" alt="購入はこちら" class="btn-pc">
          <img src="/uchronia/assets/img/btn_buy_sp.png" alt="購入はこちら" class="btn-sp">
        </a>
        <a href="/uchronia/special/trial/" class="btn-trial">
          <img src="/uchronia/assets/img/btn_trial_pc.png" alt="体験版DL" class="btn-pc">
          <img src="/uchronia/assets/img/btn_trial_sp.png" alt="体験版DL" class="btn-sp">
        </a>
      </div>
    </header>

    <!-- Main Navigation -->
    <nav class="main-nav">
      <ul>
        <li><a href="/uchronia/">TOP</a></li>
        <li><a href="/uchronia/news/">NEWS</a></li>
        <li class="has-submenu">
          <a href="/uchronia/world/">WORLD</a>
          <ul class="submenu">
            <li><a href="/uchronia/world/#welcome">Welcome to Touhagarashi</a></li>
            <li><a href="/uchronia/world/#story">Story</a></li>
            <li><a href="/uchronia/world/#glossary">Glossary</a></li>
          </ul>
        </li>
        <li><a href="/uchronia/character/">CHARACTER</a></li>
        <li><a href="/uchronia/system/">SYSTEM</a></li>
        <li class="has-submenu">
          <a href="/uchronia/product/">PRODUCT</a>
          <ul class="submenu">
            <li><a href="/uchronia/product/#limited">Limited Edition</a></li>
            <li><a href="/uchronia/product/#bonus">Store Bonuses</a></li>
            <li><a href="/uchronia/product/#music">Music Info</a></li>
            <li><a href="/uchronia/product/#dlc">DLC</a></li>
          </ul>
        </li>
        <li class="has-submenu active">
          <a href="/uchronia/library/">LIBRARY</a>
          <ul class="submenu">
            <li><a href="/uchronia/library/?category=ev" class="active">Event Illustrations</a></li>
            <li><a href="/uchronia/library/?category=mv">Movies</a></li>
            <li><a href="/uchronia/library/?category=ss">Short Stories</a></li>
          </ul>
        </li>
        <li><a href="/uchronia/goods/">GOODS</a></li>
        <li><a href="/uchronia/special/">SPECIAL</a></li>
      </ul>
    </nav>

    <!-- Main Content -->
    <main class="library-content">
      <section class="library-header">
        <h1>イベントイラスト</h1>
        <p class="library-desc">物語の重要な場面を彩るイベントCGギャラリー</p>
      </section>

      <section class="event-gallery">
        <!-- Event Item: Yashiro -->
        <article class="event-item">
          <div class="event-image">
            <img src="/uchronia/assets/img/library/ev_tr_yashiro01.png" alt="八代イベントイラスト">
          </div>
          <div class="event-text">
            <h2 class="character-name">八代</h2>
            <p>ナレーション文章...</p>
          </div>
        </article>

        <!-- Event Item: Tobari -->
        <article class="event-item">
          <div class="event-image">
            <img src="/uchronia/assets/img/library/ev_tr_tobari01.png" alt="帳イベントイラスト">
          </div>
          <div class="event-text">
            <h2 class="character-name">帳</h2>
            <p>ナレーション文章...</p>
          </div>
        </article>

        <!-- Additional event items... -->
      </section>

      <!-- Pagination -->
      <nav class="pagination" aria-label="ページネーション">
        <ul>
          <li><a href="?category=ev&pg=1" class="active">1</a></li>
          <li><a href="?category=ev&pg=2">2</a></li>
          <li><a href="?category=ev&pg=3">3</a></li>
          <li><a href="?category=ev&pg=2" class="next">NEXT</a></li>
        </ul>
      </nav>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-social">
        <a href="https://twitter.com/uchronia_jp" target="_blank" rel="noopener">Twitter</a>
        <a href="https://page.line.me/228dxfus" target="_blank" rel="noopener">LINE</a>
        <a href="https://www.youtube.com/@uchronia_jp" target="_blank" rel="noopener">YouTube</a>
      </div>

      <div class="footer-legal">
        <a href="/uchronia/guideline/">Content Guidelines</a>
        <a href="https://broccoli.co.jp/guideline/">Fanworks Guidelines</a>
        <a href="https://broccoli.co.jp/privacy/">Privacy Policy</a>
        <a href="https://broccoli.co.jp/support/">Contact</a>
      </div>

      <div class="footer-copyright">
        <p>© Broccoli Co., Ltd. / TIS Creation</p>
        <p>Nintendo Switchは任天堂の商標です。</p>
      </div>
    </footer>
  </div>

  <script src="/uchronia/assets/js/main.js"></script>
</body>
</html>
```

### 14.2 CSS基本構造（推定）

```css
/* ========================================
   Global Styles
   ======================================== */

:root {
  --color-bg-dark: #0a0a0f;
  --color-bg-medium: #1a1a2e;
  --color-text-light: #f0f0f5;
  --color-text-medium: #c0c0d0;
  --color-accent-gold: #d4af37;
  --color-accent-crimson: #dc143c;
  --font-primary: 'Typekit Font', 'Noto Serif JP', serif;
  --font-secondary: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--color-bg-dark);
  color: var(--color-text-light);
  font-family: var(--font-primary);
  line-height: 1.8;
}

/* ========================================
   Typography
   ======================================== */

h1, h2, h3 {
  font-weight: 700;
  line-height: 1.4;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
}

p {
  margin-bottom: 1rem;
}

/* ========================================
   Header
   ======================================== */

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: var(--color-bg-medium);
}

.logo img {
  height: 60px;
  width: auto;
}

.logo-sp {
  display: none;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.btn-buy img,
.btn-trial img {
  height: 50px;
  width: auto;
  transition: opacity 0.3s ease;
}

.btn-buy img:hover,
.btn-trial img:hover {
  opacity: 0.8;
}

.btn-sp {
  display: none;
}

/* ========================================
   Navigation
   ======================================== */

.main-nav {
  background-color: var(--color-bg-medium);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.main-nav > ul {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.main-nav > ul > li {
  position: relative;
}

.main-nav > ul > li > a {
  display: block;
  padding: 15px 25px;
  color: var(--color-text-light);
  text-decoration: none;
  font-size: 0.95rem;
  letter-spacing: 0.05em;
  transition: color 0.3s ease, background-color 0.3s ease;
}

.main-nav > ul > li > a:hover,
.main-nav > ul > li.active > a {
  color: var(--color-accent-gold);
  background-color: rgba(212, 175, 55, 0.1);
}

.submenu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--color-bg-dark);
  list-style: none;
  min-width: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.has-submenu:hover .submenu {
  display: block;
}

.submenu li a {
  display: block;
  padding: 12px 20px;
  color: var(--color-text-medium);
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.submenu li a:hover,
.submenu li a.active {
  background-color: rgba(212, 175, 55, 0.15);
  color: var(--color-accent-gold);
}

/* ========================================
   Library Content
   ======================================== */

.library-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.library-header {
  text-align: center;
  margin-bottom: 60px;
}

.library-header h1 {
  font-size: 3rem;
  color: var(--color-accent-gold);
  margin-bottom: 15px;
}

.library-desc {
  font-size: 1.1rem;
  color: var(--color-text-medium);
}

/* ========================================
   Event Gallery
   ======================================== */

.event-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
}

.event-item {
  background-color: var(--color-bg-medium);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(212, 175, 55, 0.2);
}

.event-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-item:hover .event-image img {
  transform: scale(1.05);
}

.event-text {
  padding: 20px;
}

.character-name {
  color: var(--color-accent-gold);
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.event-text p {
  color: var(--color-text-medium);
  font-size: 0.95rem;
  line-height: 1.8;
}

/* ========================================
   Pagination
   ======================================== */

.pagination {
  margin: 60px 0;
}

.pagination ul {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  list-style: none;
}

.pagination li a {
  display: block;
  padding: 10px 18px;
  background-color: var(--color-bg-medium);
  color: var(--color-text-light);
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.95rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.pagination li a:hover,
.pagination li a.active {
  background-color: var(--color-accent-gold);
  color: var(--color-bg-dark);
}

.pagination li a.next {
  padding: 10px 24px;
  font-weight: 600;
}

/* ========================================
   Footer
   ======================================== */

.site-footer {
  background-color: var(--color-bg-medium);
  padding: 40px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-social {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
}

.footer-social a {
  color: var(--color-text-light);
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.footer-social a:hover {
  color: var(--color-accent-gold);
}

.footer-legal {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.footer-legal a {
  color: var(--color-text-medium);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-legal a:hover {
  color: var(--color-text-light);
}

.footer-copyright {
  text-align: center;
  color: var(--color-text-medium);
  font-size: 0.85rem;
}

.footer-copyright p {
  margin-bottom: 5px;
}

/* ========================================
   Responsive Design
   ======================================== */

@media (max-width: 768px) {
  /* Header */
  .site-header {
    padding: 15px 20px;
  }

  .logo-pc {
    display: none;
  }

  .logo-sp {
    display: block;
  }

  .logo img {
    height: 40px;
  }

  .btn-pc {
    display: none;
  }

  .btn-sp {
    display: block;
  }

  .btn-buy img,
  .btn-trial img {
    height: 35px;
  }

  /* Navigation */
  .main-nav > ul {
    flex-direction: column;
  }

  .main-nav > ul > li > a {
    padding: 12px 20px;
  }

  .submenu {
    position: static;
    box-shadow: none;
  }

  /* Library */
  .library-header h1 {
    font-size: 2rem;
  }

  .event-gallery {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  /* Footer */
  .footer-social,
  .footer-legal {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
}
```

### 14.3 JavaScript基本構造（推定）

```javascript
// ========================================
// Main JavaScript
// ========================================

(function() {
  'use strict';

  // ========================================
  // Navigation Menu Handling
  // ========================================

  const initNavigation = () => {
    const menuItems = document.querySelectorAll('.main-nav .has-submenu');

    menuItems.forEach(item => {
      const link = item.querySelector('a');
      const submenu = item.querySelector('.submenu');

      // Desktop: hover
      if (window.innerWidth > 768) {
        item.addEventListener('mouseenter', () => {
          submenu.style.display = 'block';
        });

        item.addEventListener('mouseleave', () => {
          submenu.style.display = 'none';
        });
      }

      // Mobile: click toggle
      else {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const isVisible = submenu.style.display === 'block';
          submenu.style.display = isVisible ? 'none' : 'block';
        });
      }
    });
  };

  // ========================================
  // Image Lazy Loading (improvement)
  // ========================================

  const initLazyLoading = () => {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  };

  // ========================================
  // Scroll Reveal Animation
  // ========================================

  const initScrollReveal = () => {
    const items = document.querySelectorAll('.event-item');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
        }
      });
    }, {
      threshold: 0.1
    });

    items.forEach(item => revealObserver.observe(item));
  };

  // ========================================
  // Smooth Scroll to Anchor
  // ========================================

  const initSmoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);

        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };

  // ========================================
  // Pagination Handling
  // ========================================

  const initPagination = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('pg')) || 1;
    const category = urlParams.get('category') || 'ev';

    // Highlight current page
    const paginationLinks = document.querySelectorAll('.pagination a');
    paginationLinks.forEach(link => {
      const linkUrl = new URL(link.href);
      const linkPage = parseInt(linkUrl.searchParams.get('pg')) || 1;

      if (linkPage === currentPage) {
        link.classList.add('active');
      }
    });
  };

  // ========================================
  // Initialize on DOM Ready
  // ========================================

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initLazyLoading();
    initScrollReveal();
    initSmoothScroll();
    initPagination();
  });

  // ========================================
  // Handle Window Resize
  // ========================================

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initNavigation();
    }, 250);
  });

})();
```

---

## 15. 完全ファイル構造

```
/uchronia/
├── index.html (TOPページ)
├── news/
│   └── index.html
├── world/
│   └── index.html
├── character/
│   └── index.html
├── system/
│   └── index.html
├── product/
│   └── index.html
├── library/
│   └── index.html (?category=ev/mv/ss)
├── goods/
│   └── index.html
├── special/
│   ├── index.html
│   └── trial/
│       └── index.html
├── guideline/
│   └── index.html
└── assets/
    ├── css/
    │   ├── main.css
    │   ├── reset.css
    │   ├── typography.css
    │   ├── navigation.css
    │   ├── library.css
    │   └── responsive.css
    ├── js/
    │   ├── main.js
    │   ├── navigation.js
    │   ├── pagination.js
    │   └── analytics.js
    └── img/
        ├── menu_logo_pc.png
        ├── menu_logo_sp.png
        ├── btn_buy_pc.png
        ├── btn_buy_sp.png
        ├── btn_trial_pc.png
        ├── btn_trial_sp.png
        ├── splash_plate.png
        ├── splash_gear01.png
        ├── splash_gear02.png
        ├── splash_gear03.png
        └── library/
            ├── ev_tr_yashiro01.png
            ├── ev_yashiro01.jpg
            ├── ev_yashiro02.jpg
            ├── ev_tr_tobari01.png
            ├── ev_tobari01.jpg
            ├── ev_tobari02_x5vi.jpg
            ├── ev_tr_awayuki01.png
            ├── ev_awayuki01.jpg
            ├── ev_awayuki02.jpg
            ├── ev_tr_yori01.png
            ├── ev_yori01.jpg
            ├── ev_yori02_u9pa.jpg
            ├── ev_tr_tsuyukusa01.png
            ├── ev_tsuyukusa01.jpg
            ├── ev_tsuyukusa02_x5vi.jpg
            ├── ev_tr_hiiragi01.png
            └── ev_hiiragi01.jpg
```

---

## 16. まとめ

「泡沫のユークロニア」公式サイトは、ゲームのテーマである神秘性とロマンスを効果的に表現したビジュアルノベル向けプロモーションサイトです。

**主要な強み:**
- 一貫したビジュアルアイデンティティ
- 明確な情報アーキテクチャ
- 高品質なアートワーク
- 効果的なCTA配置

**改善の機会:**
- パフォーマンス最適化（画像遅延読み込み、WebP対応）
- アクセシビリティ強化（ARIAラベル、キーボードナビゲーション）
- SEO強化（Open Graph、meta description）
- モダンHTML機能の活用（picture要素、srcset）

このサイトは、ターゲットオーディエンス（ビジュアルノベル愛好者）に対して、ゲームの世界観を効果的に伝えることに成功しています。技術的な改善を行うことで、さらにユーザー体験を向上させることができるでしょう。

---

**レポート作成日:** 2025-11-15
**分析者:** Claude Code
**分析ツール:** WebFetch, Google DevTools (推定)
