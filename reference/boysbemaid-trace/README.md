# Boys be MAID - Aimery Cénoir Page - Complete Trace Package

**完全トレース実施日**: 2025-11-13
**ソースURL**: https://boysbemaid.jp/member/aimerycenoir/
**プロジェクト**: Karin_gamesite

---

## ディレクトリ構造

```
reference/boysbemaid-trace/
├── README.md                 # このファイル
├── ANALYSIS.md              # 詳細解析ドキュメント
├── source.html              # 完全なHTMLソースコード (30.9KB)
├── common.css               # 共通CSSスタイルシート (60.5KB)
├── member.css               # メンバーページ専用CSS (39.5KB)
├── common.js                # 共通JavaScript
├── member.js                # メンバーページ専用JavaScript
├── vendor.js                # ベンダーライブラリ
└── image-assets.txt         # 画像アセットURL一覧
```

---

## ファイル詳細

### 1. HTML (`source.html`)
**ファイルサイズ**: 30,888 bytes
**説明**: エメリ・スノワール キャラクターページの完全なHTMLソースコード

**主要セクション**:
- `<head>`: メタタグ、OGP設定、Google Analytics、外部リソース参照
- `<header>`: サイトロゴ、グローバルナビゲーション、ハンバーガーメニュー
- `<main>`: キャラクタープロフィール、ボイス再生UI、関係図
- `<footer>`: フッターナビゲーション、SNSリンク、著作権表示

**技術要素**:
- セマンティックHTML5
- データ属性 (`data-id`, `data-pos`, `data-src`)
- BEM命名規則のクラス構造
- アクセシビリティ対応 (`role`, `aria-*`)

---

### 2. CSS

#### `common.css` (60,490 bytes)
**説明**: サイト全体の共通スタイルシート

**主要セクション**:
1. **リセットCSS**: ブラウザのデフォルトスタイルをリセット
2. **ベーススタイル**: タイポグラフィ、カラー変数、レイアウト基盤
3. **ヘッダー/フッター**: `.l-header`, `.l-footer`, `.l-gnav` (グローバルナビ)
4. **ユーティリティクラス**: `.c-sans` (フォント), レスポンシブヘルパー
5. **アニメーション**: フェードイン、スライド、ナビゲーション展開

**CSS変数 (推測)**:
```css
:root {
  --color-primary: #6B4FA3;
  --color-accent: #D4AF37;
  --color-text: #333333;
  --color-bg: #FFFFFF;
  --font-sans: "Noto Sans JP", sans-serif;
}
```

**主要アニメーション**:
- ナビゲーション展開/収縮
- スクロールトリガーフェード
- ホバーエフェクト

#### `member.css` (39,472 bytes)
**説明**: メンバーページ専用スタイル

**主要セクション**:
1. **キャラクタービジュアル**: `.member_single__visual`
2. **プロフィールセクション**: `.member_single__profile`
3. **ボイスUI**: `.member_single__ui__sound`, `.member_single__ui__voicebtn`
4. **関係図**: `.member_single__relation`
5. **レスポンシブ設定**: スマートフォン/タブレット/デスクトップ

**レイアウト手法**:
- CSS Grid (メインレイアウト)
- Flexbox (ナビゲーション、UI要素)
- Position固定 (ヘッダー)

---

### 3. JavaScript

#### `common.js`
**説明**: サイト全体の共通JavaScript機能

**主要機能**:
1. **グローバルナビゲーション**
   - ハンバーガーメニュー開閉
   - スムーススクロール
   - メニュー外クリック検知

2. **スクロールアニメーション**
   - Intersection Observer API使用
   - 要素が画面内に入ったらフェードイン

3. **Google Analytics イベント**
   - ページビュー計測
   - リンククリックトラッキング

#### `member.js`
**説明**: メンバーページ専用JavaScript

**主要機能**:
1. **音声再生システム**
   - ボタンクリックで音声再生
   - 再生中の視覚フィードバック
   - 複数音声の管理

2. **画像ギャラリー** (推測)
   - モーダル表示
   - スワイプ対応

3. **キャラクター切り替え** (推測)
   - URLパラメータ処理
   - 動的コンテンツロード

#### `vendor.js`
**説明**: サードパーティライブラリ (バンドル)

**含まれるライブラリ (推測)**:
- Intersection Observer polyfill
- Smooth scroll polyfill
- その他ユーティリティライブラリ

---

### 4. 画像アセット (`image-assets.txt`)

**合計**: 20個の画像ファイル

**カテゴリ**:
1. **サイト共通画像** (3個)
   - ロゴ: `/wp/wp-content/themes/boysbemaid/assets/img/common/ph_logo.webp`
   - ファビコン: `/wp/wp-content/themes/boysbemaid/assets/siteinfo/favicon.ico`
   - OGP画像: `/wp/wp-content/themes/boysbemaid/assets/siteinfo/og_image.jpg`

2. **キャラクター画像** (エメリ専用, 約15個)
   - メインビジュアル
   - プロフィール写真
   - 表情差分
   - 関係図

3. **UI要素**
   - ボタンアイコン
   - 装飾パーツ

**画像フォーマット**:
- **WebP**: 主要画像 (最適化済み)
- **PNG**: 透過が必要な画像
- **JPG**: OGP画像

---

## 技術スタック詳細

### HTML5
- セマンティックタグ使用 (`<header>`, `<main>`, `<nav>`, `<section>`)
- メタタグ完備 (SEO, OGP, Twitter Card)
- アクセシビリティ対応 (ARIA属性)

### CSS3
- **レイアウト**: CSS Grid, Flexbox
- **レスポンシブ**: Media Queries
- **アニメーション**: `@keyframes`, `transition`
- **カスタムプロパティ**: CSS変数使用 (推測)
- **命名規則**: BEM (Block Element Modifier)

### JavaScript (ES6+)
- **モダン構文**: アロー関数、テンプレートリテラル、分割代入
- **API使用**: Intersection Observer, Web Audio API
- **イベント処理**: `addEventListener`, イベント委譲
- **モジュール化**: 機能ごとに分離

### パフォーマンス最適化
- **画像**: WebP形式、遅延ロード
- **CSS**: 外部ファイル参照、圧縮
- **JavaScript**: ファイル分割、非同期読み込み
- **フォント**: Google Fonts, Adobe Fonts (Typekit)

---

## レスポンシブデザイン

### ブレークポイント

```css
/* スマートフォン (デフォルト) */
@media (max-width: 767px) {
  /* ハンバーガーメニュー表示 */
  /* 1カラムレイアウト */
}

/* タブレット */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 2カラムレイアウト */
}

/* デスクトップ */
@media (min-width: 1024px) {
  /* フルナビゲーション表示 */
  /* グリッドレイアウト */
}
```

---

## カラーパレット

### プライマリカラー (推測)
```css
--color-brand-purple: #6B4FA3;    /* Boys be MAID ブランドカラー */
--color-accent-gold: #D4AF37;     /* アクセント (ゴールド) */
--color-bg-cream: #F5F5F0;        /* 背景 (クリーム) */
--color-text-dark: #333333;       /* テキスト (ダーク) */
--color-text-light: #FFFFFF;      /* テキスト (ライト) */
```

### グラデーション
- ヘッダー背景グラデーション
- ボタンホバーグラデーション

---

## フォント構成

### 日本語フォント
```css
font-family: "Noto Sans JP", "Hiragino Kaku Gothic ProN", "メイリオ", sans-serif;
```
- **ウェイト**: 100, 300, 400, 500, 700, 900
- **ソース**: Google Fonts

### 英数字フォント
```css
font-family: "Adobe Fonts (Typekit)", sans-serif;
```
- **ソース**: https://use.typekit.net/rrv1sjt.css

---

## アニメーション定義

### 1. フェードイン
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 2. スライドイン (左)
```css
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### 3. ナビゲーション展開
```css
@keyframes navExpand {
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}
```

### 4. ボタンホバー
```css
.button {
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button:hover {
  background-color: var(--color-accent);
  transform: scale(1.05);
}
```

---

## JavaScript 主要機能詳細

### 1. グローバルナビゲーション

```javascript
// ハンバーガーメニュー開閉
const navToggle = document.querySelector('.js-gnav_open');
const nav = document.querySelector('.js-gnav');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('is-active');
  document.body.setAttribute('data-gnavactive',
    nav.classList.contains('is-active') ? '1' : '0'
  );
});

// メニュー外クリックで閉じる
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
    nav.classList.remove('is-active');
    document.body.setAttribute('data-gnavactive', '0');
  }
});
```

### 2. スクロールアニメーション

```javascript
// Intersection Observer でフェードイン
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// 監視対象要素を登録
document.querySelectorAll('.js-fadein').forEach(el => {
  observer.observe(el);
});
```

### 3. 音声再生システム

```javascript
// 音声再生ボタン
const soundButtons = document.querySelectorAll('.js-soundelm');

soundButtons.forEach(button => {
  button.addEventListener('click', function() {
    const audioSrc = this.getAttribute('data-src');
    const audioId = this.getAttribute('data-id');

    // 既存の再生を停止
    const currentAudio = document.querySelector('audio[data-id="' + audioId + '"]');
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // 新しい音声を再生
    const audio = new Audio(audioSrc);
    audio.setAttribute('data-id', audioId);
    audio.play();

    // 再生中の視覚フィードバック
    this.classList.add('is-playing');
    audio.addEventListener('ended', () => {
      this.classList.remove('is-playing');
    });
  });
});
```

---

## Karin_gamesiteへの適用推奨

### 1. HTML構造
- **採用**: セマンティック構造、データ属性活用
- **カスタマイズ**: メタタグ内容をKarinプロジェクト用に変更

### 2. CSSスタイリング
- **採用**: BEM命名規則、CSS Grid/Flexbox、レスポンシブ設計
- **カスタマイズ**: カラーパレットを深紅/ゴールドに変更

### 3. JavaScript機能
- **採用**: スクロールアニメーション、ナビゲーション制御、音声再生システム
- **カスタマイズ**: キャラクター固有の機能を追加

### 4. パフォーマンス
- **採用**: WebP画像、遅延ロード、非同期スクリプト
- **追加**: さらなる最適化 (Critical CSS, Code Splitting)

---

## 実装チェックリスト

### Phase 1: ファイル準備
- [x] HTMLソースコード取得
- [x] CSSファイル取得 (common.css, member.css)
- [x] JavaScriptファイル取得 (common.js, member.js, vendor.js)
- [x] 画像アセットリスト作成

### Phase 2: 解析
- [x] HTML構造解析
- [x] CSSスタイル解析
- [x] JavaScript機能解析
- [x] レスポンシブデザイン確認

### Phase 3: Karinプロジェクトへの適用
- [ ] キャラクタープロフィールページテンプレート作成
- [ ] CSS移植とカスタマイズ
- [ ] JavaScript機能実装
- [ ] 画像アセット準備
- [ ] レスポンシブテスト
- [ ] パフォーマンステスト

---

## ファイルサイズ一覧

```
source.html    30,888 bytes (30.2 KB)
common.css     60,490 bytes (59.1 KB)
member.css     39,472 bytes (38.5 KB)
common.js      (サイズ未計測)
member.js      (サイズ未計測)
vendor.js      (サイズ未計測)
```

**合計CSS**: 約100 KB
**合計HTML+CSS**: 約130 KB

---

## 外部リソース

### Google Fonts
- Noto Sans JP: https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900

### Adobe Fonts (Typekit)
- https://use.typekit.net/rrv1sjt.css

### Google Analytics
- Measurement ID: G-P2K717C13P

### SNS
- Twitter: @boysbemaid_koki
- TikTok: @boysbemaid
- YouTube: @boysbemaid

---

## 著作権・ライセンス

**注意**: このトレースパッケージは学習・参考目的で作成されています。

- **オリジナルサイト**: Boys be MAID! 公式サイト (https://boysbemaid.jp/)
- **著作権**: すべてのコンテンツは原著作権者に帰属します
- **用途**: Karin_gamesiteプロジェクトの参考資料として使用

---

## 更新履歴

- **2025-11-13**: 完全トレースパッケージ作成
  - HTMLソースコード取得
  - CSS/JavaScript取得
  - 画像アセットリスト作成
  - 詳細解析ドキュメント作成

---

**トレース実施者**: Claude Code
**プロジェクト**: Karin_gamesite
**目的**: 高品質なキャラクタープロフィールページ実装の参考資料
