# レスポンシブデザインとメディアクエリ 2025年版 完全ガイド

> **最終更新**: 2025-01-07
> **対象プロジェクト**: Karin_gamesite
> **参照**: 最新のWeb標準（2024-2025年）

---

## 📊 調査結果サマリー

1. **モバイルファーストが標準** - 全Webトラフィックの60%以上がモバイル、Googleのモバイルファーストインデックス対応必須
2. **Container Queriesが本格利用可能** - 主要ブラウザで82%のサポート率、プロダクション環境推奨
3. **現代的CSSによる省コード化** - `clamp()`, `dvh`, 新しいビューポート単位でメディアクエリ削減
4. **CLS対策が重要度増加** - Core Web VitalsでCLS 0.1以下が推奨、検索順位に影響
5. **CSS Gridの優位性** - 複雑なレスポンシブレイアウトでFlexboxより30%高速

---

## 🎯 推奨メディアクエリのブレークポイント

### 2025年標準ブレークポイント（モバイルファースト）

```css
/* ===========================
   モバイルファースト推奨設定
   =========================== */

/* ベース: モバイル (320px~) */
/* デフォルトスタイルをここに記述 */

/* スモールモバイル (375px~) */
@media (min-width: 375px) {
  /* iPhone SE等の小型デバイス最適化 */
}

/* ラージモバイル / スモールタブレット (481px~) */
@media (min-width: 481px) {
  /* 大型スマートフォン、折りたたみデバイス */
}

/* タブレット (768px~) */
@media (min-width: 768px) {
  /* iPad、Androidタブレット */
}

/* ラージタブレット / スモールデスクトップ (1024px~) */
@media (min-width: 1024px) {
  /* iPad Pro、小型ラップトップ */
}

/* デスクトップ (1280px~) */
@media (min-width: 1280px) {
  /* 標準デスクトップモニター */
}

/* ラージデスクトップ (1440px~) */
@media (min-width: 1440px) {
  /* フルHDディスプレイ */
}

/* エクストララージデスクトップ (1920px~) */
@media (min-width: 1920px) {
  /* 4K、ウルトラワイドディスプレイ */
}
```

### コンテンツドリブンなブレークポイント設定

```css
/* 2025年推奨: デバイスではなくコンテンツに基づく設定 */

:root {
  /* 可変ブレークポイント変数 */
  --bp-xs: 20rem;    /* 320px */
  --bp-sm: 30rem;    /* 480px */
  --bp-md: 48rem;    /* 768px */
  --bp-lg: 64rem;    /* 1024px */
  --bp-xl: 80rem;    /* 1280px */
  --bp-2xl: 96rem;   /* 1536px */
}

/* デザインが崩れる箇所で柔軟に追加 */
@media (min-width: 42rem) {
  /* コンテンツ固有のブレークポイント */
}
```

---

## 📦 Container Queries（コンテナクエリ）

### ブラウザサポート状況（2025年1月）

**総合サポート率: 82%** ✅

#### デスクトップブラウザ
- **Chrome 107+**: 完全サポート ✓
- **Edge 107+**: 完全サポート ✓
- **Firefox 110+**: 完全サポート ✓
- **Safari 16.5+**: 完全サポート ✓

#### モバイルブラウザ
- **iOS Safari 16.2+**: 完全サポート ✓
- **Chrome for Android 106+**: 完全サポート ✓
- **Firefox for Android 110+**: 完全サポート ✓
- **Samsung Internet 20+**: 完全サポート ✓

### 使用判断: **プロダクション環境で推奨** ✅

```css
/* Container Queriesの基本実装 */

.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: grid;
  grid-template-columns: 1fr;
}

/* コンテナ幅に応じたレイアウト変更 */
@container card (min-width: 400px) {
  .card {
    grid-template-columns: 1fr 2fr;
  }
}

@container card (min-width: 600px) {
  .card {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

/* フォールバック対応（古いブラウザ向け） */
@supports not (container-type: inline-size) {
  .card {
    /* 従来のメディアクエリでフォールバック */
  }

  @media (min-width: 768px) {
    .card {
      grid-template-columns: 1fr 2fr;
    }
  }
}
```

---

## 🛠️ 実装推奨テクニック（7選）

### 1. clamp()による流動的タイポグラフィ

```css
/* メディアクエリ不要の自動スケーリング */

h1 {
  /* min(16px), preferred(2.5vw + 1rem), max(48px) */
  font-size: clamp(1rem, 2.5vw + 1rem, 3rem);
  line-height: 1.2;
}

h2 {
  font-size: clamp(0.875rem, 2vw + 0.5rem, 2rem);
}

p {
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1.125rem);
}

/* 余白のスケーリング */
.section {
  padding: clamp(1rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem);
  margin-block: clamp(2rem, 5vh, 5rem);
}

/* 幅の制限 */
.container {
  width: min(100% - 2rem, 75rem);
  margin-inline: auto;
}
```

### 2. 新しいビューポート単位（dvh, lvh, svh）

```css
/* 動的ビューポートハイト（モバイルブラウザUIに対応） */

.hero {
  /* 従来の問題: モバイルでアドレスバー分の高さ考慮不足 */
  height: 100vh; /* フォールバック */

  /* 2025年推奨: 動的に調整 */
  height: 100dvh; /* Dynamic Viewport Height */
}

/* 各種ビューポート単位の使い分け */
.fullscreen-section {
  /* スクロール時にブラウザUIが隠れても常に画面全体 */
  min-height: 100svh; /* Small Viewport Height */
}

.sticky-footer {
  /* ブラウザUIが表示された状態での高さ */
  min-height: 100lvh; /* Large Viewport Height */
}

/* フォールバック付き実装 */
.modal {
  height: 100vh;
  height: 100dvh;
  max-height: 100dvh;
  overflow-y: auto;
}
```

### 3. aspect-ratioによるレイアウト安定性

```css
/* CLS対策としてのアスペクト比指定 */

.video-wrapper {
  aspect-ratio: 16 / 9;
  width: 100%;
  background: #000;
}

.video-wrapper iframe {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 画像カードの統一 */
.card-image {
  aspect-ratio: 4 / 3;
  width: 100%;
  object-fit: cover;
  background: var(--placeholder-color);
}

/* ポートレート画像 */
.character-portrait {
  aspect-ratio: 3 / 4;
  width: 100%;
  object-fit: cover;
}

/* 正方形サムネイル */
.thumbnail {
  aspect-ratio: 1;
  width: 100%;
  object-fit: cover;
}

/* フォールバック対応 */
@supports not (aspect-ratio: 1) {
  .thumbnail {
    height: 0;
    padding-bottom: 100%; /* 正方形 */
  }
}
```

### 4. CSS GridとFlexboxの併用パターン

```css
/* 自動レスポンシブグリッド（メディアクエリ不要） */

.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}

/* 柔軟なカードレイアウト */
.card-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* Flexboxとの併用: ナビゲーション */
.navbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.nav-links {
  display: flex;
  gap: clamp(0.5rem, 2vw, 2rem);
  flex-wrap: wrap;
}

/* Grid内でFlexboxを使用 */
.page-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .page-layout {
    grid-template-columns: 1fr;
  }
}
```

### 5. ネイティブ遅延読み込み

```html
<!-- 最適化された画像読み込み -->
<img
  src="character.jpg"
  alt="キャラクター画像"
  width="800"
  height="600"
  loading="lazy"
  decoding="async"
>

<!-- ファーストビュー画像は即時読み込み -->
<img
  src="hero-image.jpg"
  alt="メインビジュアル"
  width="1920"
  height="1080"
  loading="eager"
  fetchpriority="high"
>

<!-- レスポンシブ画像セット -->
<img
  src="image-800.jpg"
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w,
    image-1600.jpg 1600w
  "
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="レスポンシブ画像"
  width="800"
  height="600"
  loading="lazy"
>
```

```css
/* CSSでのサポート */
img {
  /* 画像のアスペクト比を維持 */
  height: auto;
  max-width: 100%;

  /* レイアウトシフト防止 */
  aspect-ratio: attr(width) / attr(height);
}

/* content-visibilityによる高度な最適化 */
.image-section {
  content-visibility: auto;
  contain-intrinsic-size: 800px 600px;
}
```

### 6. テキストオーバーフロー対策

```css
/* ユーザー生成コンテンツ向け */
.user-content {
  /* 長いURL等を自動改行 */
  overflow-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}

/* 見出しのバランス調整（2025年新機能） */
h1, h2, h3 {
  text-wrap: balance;
  max-width: 50ch; /* 読みやすい行長 */
}

/* 本文の最適化 */
p {
  text-wrap: pretty;
  max-width: 65ch;
}

/* 改行を防ぐ要素 */
.no-break {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 複数行での省略 */
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* コンテナからはみ出さない */
.constrained-text {
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
}
```

### 7. フォント読み込み最適化

```css
/* 最適化されたフォント定義 */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2'); /* WOFF2のみ推奨 */
  font-display: optional; /* CLS対策 */
  font-weight: 400;
  font-style: normal;
  unicode-range: U+0020-007F; /* 必要な文字範囲のみ */
}

/* システムフォントフォールバック */
body {
  font-family:
    'CustomFont',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    'Noto Sans JP',
    sans-serif;
}

/* フォントサイズ調整でCLS軽減 */
@font-face {
  font-family: 'Fallback';
  src: local('Arial');
  size-adjust: 95%; /* カスタムフォントに合わせる */
  ascent-override: 105%;
  descent-override: 35%;
}
```

```html
<!-- HTMLでのフォントプリロード -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

---

## ✅ レイアウト崩れ防止チェックリスト

### 画像・メディア関連

- [ ] **画像に明示的なwidth/height属性を指定**
  ```html
  <img src="image.jpg" width="800" height="600" alt="説明">
  ```

- [ ] **aspect-ratioプロパティで比率を維持**
  ```css
  img { aspect-ratio: 16 / 9; width: 100%; height: auto; }
  ```

- [ ] **object-fitで画像の表示方法を制御**
  ```css
  img { object-fit: cover; }
  ```

- [ ] **ファーストビュー外の画像はloading="lazy"を使用**
  ```html
  <img src="image.jpg" loading="lazy">
  ```

### テキスト・タイポグラフィ関連

- [ ] **フォント読み込みでfont-display: optionalを使用**
  ```css
  @font-face { font-display: optional; }
  ```

- [ ] **長いテキストにoverflow-wrap: break-wordを適用**
  ```css
  .text { overflow-wrap: break-word; }
  ```

### 動的コンテンツ関連

- [ ] **広告・埋め込みコンテンツに最小高さを設定**
  ```css
  .ad-slot { min-height: 250px; }
  ```

- [ ] **動的コンテンツ用のプレースホルダーを用意**
  ```css
  .skeleton { background: #e0e0e0; animation: pulse 1.5s infinite; }
  ```

### レイアウト・スペーシング関連

- [ ] **CSS Transformsでアニメーション実装**
  ```css
  .animated { transform: translateX(100px); /* width変更ではなく */ }
  ```

- [ ] **content-visibilityで画面外要素の描画を最適化**
  ```css
  .section { content-visibility: auto; }
  ```

---

## 🎮 Karin_gamesiteプロジェクトへの適用

### プロジェクト特性

- **種類**: ビジュアルノベル/ゲーム系ウェブサイト
- **ビジュアル要素**: キャラクター画像、背景、動画アセット
- **テーマ**: ダークテーマ（大聖堂、宗教的モチーフ）
- **ターゲット**: ゲームプレイヤー（モバイル・デスクトップ両対応必須）

### 1. キャラクター画像の最適化

```css
/* キャラクターポートレート */
.character-portrait {
  aspect-ratio: 3 / 4; /* 縦長キャラクター画像 */
  width: 100%;
  max-width: 400px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
}

/* レスポンシブグリッド */
.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
  gap: clamp(1rem, 3vw, 2.5rem);
  padding: clamp(1rem, 4vw, 3rem);
}
```

```html
<!-- 実装例 -->
<img
  src="assets/images/characters/イレーヌ.png"
  alt="イレーヌ"
  width="400"
  height="533"
  loading="lazy"
  class="character-portrait"
>
```

### 2. 背景画像（大聖堂シーン）の処理

```css
/* ヒーローセクション */
.hero-cathedral {
  position: relative;
  min-height: 100dvh; /* モバイル対応 */
  background-image: url('assets/images/backgrounds/大聖堂.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;

  /* ダークオーバーレイ */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
  }
}

/* パフォーマンス改善 */
@media (max-width: 768px) {
  .hero-cathedral {
    background-attachment: scroll; /* モバイルでfixed無効化 */
  }
}
```

### 3. 動画アセット（扉動き）の統合

```html
<!-- 最適化された動画埋め込み -->
<div class="door-animation-wrapper">
  <video
    class="door-animation"
    autoplay
    loop
    muted
    playsinline
    preload="metadata"
    width="1920"
    height="1080"
  >
    <source src="assets/videos/扉動き.mp4" type="video/mp4">
  </video>
</div>
```

```css
.door-animation-wrapper {
  aspect-ratio: 16 / 9;
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  overflow: hidden;
  border-radius: 12px;
}

.door-animation {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 4. ダークテーマ最適化レイアウト

```css
:root {
  /* ダークテーマカラー */
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --accent: #8b7355; /* 古風な金色 */
  --shadow: rgba(0, 0, 0, 0.8);
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family:
    'Noto Serif JP',
    '游明朝', 'Yu Mincho',
    'ヒラギノ明朝 ProN', 'Hiragino Mincho ProN',
    serif;
  font-size: clamp(1rem, 2vw + 0.5rem, 1.125rem);
  line-height: 1.8;
}

/* カードレイアウト */
.content-card {
  background: var(--bg-secondary);
  border: 1px solid rgba(139, 115, 85, 0.3);
  border-radius: 8px;
  padding: clamp(1rem, 3vw, 2rem);
  box-shadow: 0 4px 24px var(--shadow);
}
```

### 5. モバイル・デスクトップ共通ナビゲーション

```css
/* Container Queriesを活用したナビゲーション */
.navbar-container {
  container-type: inline-size;
  background: var(--bg-secondary);
  border-bottom: 1px solid rgba(139, 115, 85, 0.3);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(0.5rem, 2vw, 1rem) clamp(1rem, 4vw, 3rem);
  max-width: 1400px;
  margin-inline: auto;
}

.nav-links {
  display: flex;
  gap: clamp(0.5rem, 2vw, 2rem);
  flex-wrap: wrap;
}

/* Container Queryでレイアウト変更 */
@container (max-width: 600px) {
  .nav-links {
    flex-direction: column;
    width: 100%;
  }
}
```

### 6. パフォーマンス最適化設定

```css
/* 画面外要素の描画最適化 */
.character-section,
.scene-section,
.story-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}

/* スムーススクロール */
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

/* フォント最適化 */
@font-face {
  font-family: 'GameFont';
  src: url('assets/fonts/game-font.woff2') format('woff2');
  font-display: optional;
  font-weight: 400;
  unicode-range: U+3000-9FFF, U+FF00-FFEF; /* 日本語範囲 */
}
```

### 7. プロジェクト専用ブレークポイント

```css
/* Karin_gamesite向けカスタムブレークポイント */

/* ベース: モバイル（縦持ち） */
@media (min-width: 320px) {
  .container { padding-inline: 1rem; }
}

/* 大型スマホ・折りたたみデバイス */
@media (min-width: 480px) {
  .character-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* タブレット（ゲームプレイに最適） */
@media (min-width: 768px) {
  .character-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .story-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }
}

/* デスクトップ（没入体験） */
@media (min-width: 1024px) {
  .character-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .hero-cathedral {
    min-height: 100vh;
  }
}

/* 大型ディスプレイ（最高品質表示） */
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }

  .character-portrait {
    max-width: 500px;
  }
}
```

---

## 🎯 実装優先順位

### Phase 1: 最優先（CLS対策）
1. ✅ 画像にwidth/height属性とaspect-ratioを追加
2. ✅ dvhを使用した全画面セクションの実装
3. ✅ clamp()による流動的タイポグラフィ

### Phase 2: 高優先（パフォーマンス）
4. ✅ 遅延読み込みの実装（loading="lazy"）
5. ✅ フォント最適化（font-display: optional）

### Phase 3: 中優先（モダン化）
6. ⏳ Container Queriesの段階的導入
7. ⏳ CSS Grid自動レイアウトの活用

### Phase 4: 低優先（高度な最適化）
8. ⏳ content-visibilityによる描画最適化
9. ⏳ srcsetによるレスポンシブ画像

---

## 📚 関連ドキュメント

- [requirements.md](requirements.md) - プロジェクト要件定義
- [production-sitemap.md](production-sitemap.md) - サイト構造
- [walking-skeleton-flow.md](walking-skeleton-flow.md) - MVP実装計画

---

## 📝 まとめ

2025年のレスポンシブデザインは、**Container Queries**、**clamp()関数**、**dvh等の新しいビューポート単位**、**aspect-ratio**といった現代的なCSSテクノロジーを活用することで、よりメンテナンス性が高く、パフォーマンスに優れたウェブサイトを構築できます。

特にKarin_gamesiteのようなビジュアル重視のゲームサイトでは、**CLS対策**と**画像最適化**が成功の鍵となります。上記の推奨事項を段階的に実装することで、モバイル・デスクトップの両環境で優れたユーザー体験を提供できるでしょう。

---

**最終更新**: 2025-01-07
**次のアクション**: Walking Skeleton実装時にこのガイドを参照してください
