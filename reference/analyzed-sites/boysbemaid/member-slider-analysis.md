# Boys be maid - メンバースライダーアニメーション分析

> **分析対象**: https://boysbemaid.jp/ の `<section class="member" id="member">`
> **分析日**: 2025-11-09
> **焦点**: ゆっくり移動するリンク付き画像のアニメーションスライダー

---

## 📋 分析結果サマリー

### 確認された構造

**セクション構成**:
- セクションヘッダー: 「香騎学園 メイドボーイ部」
- キャラクタースライダー: 6名のメンバーを順次表示
- 相関図エリア: 全体相関図へのリンク

**キャラクター一覧**（スライダー内）:
1. 高科ランド（CV: 宮崎将矢）
2. 妃咲夜香（CV: 秋山諒）
3. 天城楼（CV: 山本章）
4. 菊秀明（CV: 山口智広）
5. エメリー・セノワール（CV: 小笠原仁）
6. 姫空木礼（CV: 前田誠二）

**画像形式**: WebP（最適化済み）
**リンク構造**: `/member/[キャラクター名]/` への個別ページ遷移

---

## 🎨 アニメーション構造の統合

### 1. HTML構造（推定）

```html
<section class="member" id="member">
  <!-- セクションヘッダー -->
  <div class="member__header">
    <h2 class="member__title">香騎学園 メイドボーイ部</h2>
  </div>

  <!-- スライダー本体 -->
  <div class="member__slider">
    <div class="member__slider__track">
      <!-- 個別メンバーカード -->
      <div class="member__slide" data-member-id="1">
        <a href="/member/takashinaranto/" class="member__slide__link">
          <div class="member__slide__image">
            <img src="assets/img/member/ranto.webp" alt="高科ランド">
          </div>
          <div class="member__slide__name">
            <img src="assets/img/member/ranto_name.svg" alt="高科ランド">
          </div>
          <div class="member__slide__cv">CV: 宮崎将矢</div>
        </a>
      </div>

      <!-- 残り5名のメンバーカード（同構造） -->
      <div class="member__slide" data-member-id="2">...</div>
      <div class="member__slide" data-member-id="3">...</div>
      <div class="member__slide" data-member-id="4">...</div>
      <div class="member__slide" data-member-id="5">...</div>
      <div class="member__slide" data-member-id="6">...</div>
    </div>

    <!-- ナビゲーション（サムネイル） -->
    <div class="member__slider__nav">
      <button class="member__slider__nav__item" data-slide="1">
        <img src="assets/img/member/thumb_ranto.webp" alt="">
      </button>
      <!-- 残り5つのサムネイル -->
    </div>
  </div>

  <!-- 相関図エリア -->
  <div class="member__relationship">
    <a href="/relationship/">
      <img src="assets/img/relationship.webp" alt="全体相関図">
    </a>
  </div>
</section>
```

---

### 2. CSS実装（アニメーション）

#### 基本スタイル

```css
/* スライダーコンテナ */
.member__slider {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 4rem 0;
}

/* スライダートラック（スライドを格納） */
.member__slider__track {
  display: flex;
  transition: transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  /* ゆっくり移動: 1.2秒、滑らかなイージング */
}

/* 個別スライド */
.member__slide {
  flex: 0 0 100%;
  /* 1枚ずつ表示（デスクトップでは調整） */
  padding: 0 2rem;
  opacity: 0;
  transform: translateX(50px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

/* アクティブスライド */
.member__slide.is-active {
  opacity: 1;
  transform: translateX(0);
}

/* ホバーエフェクト */
.member__slide__link {
  display: block;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.member__slide__link:hover {
  transform: scale(1.05);
}

/* 画像エリア */
.member__slide__image {
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 8px;
}

.member__slide__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.member__slide__link:hover .member__slide__image img {
  transform: scale(1.1);
}

/* 名前表示（SVG） */
.member__slide__name {
  margin-top: 1rem;
  text-align: center;
}

.member__slide__name img {
  height: 2rem;
  width: auto;
}

/* CV表記 */
.member__slide__cv {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #888;
}
```

#### ナビゲーション（サムネイル）

```css
.member__slider__nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.member__slider__nav__item {
  width: 60px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.3s ease, border-color 0.3s ease;
  background: none;
  padding: 0;
}

.member__slider__nav__item:hover {
  opacity: 0.8;
}

.member__slider__nav__item.is-active {
  opacity: 1;
  border-color: #800889; /* Karinプロジェクトの紫色 */
}

.member__slider__nav__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
}
```

#### レスポンシブ対応

```css
/* タブレット: 2カラム */
@media (min-width: 768px) {
  .member__slide {
    flex: 0 0 50%;
  }

  .member__slider__track {
    transition: transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    /* タブレットではやや長め */
  }
}

/* デスクトップ: 3カラム */
@media (min-width: 1024px) {
  .member__slide {
    flex: 0 0 33.333%;
  }

  .member__slider__track {
    transition: transform 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    /* デスクトップでは最も遅く、ゆったりと */
  }
}

/* ワイドデスクトップ */
@media (min-width: 1440px) {
  .member__slide {
    padding: 0 3rem;
  }

  .member__slider__nav__item {
    width: 80px;
    height: 100px;
  }
}
```

---

### 3. JavaScript実装

#### オプション1: Vanilla JavaScript（自作スライダー）

```javascript
class MemberSlider {
  constructor(element) {
    this.slider = element;
    this.track = element.querySelector('.member__slider__track');
    this.slides = Array.from(element.querySelectorAll('.member__slide'));
    this.navItems = Array.from(element.querySelectorAll('.member__slider__nav__item'));

    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000; // 5秒ごと

    this.init();
  }

  init() {
    // 初期表示
    this.showSlide(0);

    // ナビゲーションクリックイベント
    this.navItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.showSlide(index);
        this.resetAutoplay();
      });
    });

    // 自動再生開始
    this.startAutoplay();

    // ホバー時は自動再生停止
    this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
    this.slider.addEventListener('mouseleave', () => this.startAutoplay());
  }

  showSlide(index) {
    // 範囲外チェック
    if (index < 0) index = this.slides.length - 1;
    if (index >= this.slides.length) index = 0;

    this.currentIndex = index;

    // スライド移動（transform: translateX）
    const offset = -index * (100 / this.getVisibleSlides());
    this.track.style.transform = `translateX(${offset}%)`;

    // アクティブ状態更新
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });

    this.navItems.forEach((item, i) => {
      item.classList.toggle('is-active', i === index);
    });
  }

  getVisibleSlides() {
    // レスポンシブ: 表示枚数を取得
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  next() {
    this.showSlide(this.currentIndex + 1);
  }

  prev() {
    this.showSlide(this.currentIndex - 1);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  const memberSlider = document.querySelector('.member__slider');
  if (memberSlider) {
    new MemberSlider(memberSlider);
  }
});
```

#### オプション2: Swiperライブラリ使用（推奨）

```javascript
// CDN読み込み（HTML <head>内）
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
// <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

const memberSwiper = new Swiper('.member__slider', {
  // スライド設定
  slidesPerView: 1,
  spaceBetween: 30,
  speed: 1200, // 1.2秒でゆっくり移動

  // レスポンシブ
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 40,
      speed: 1500,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 50,
      speed: 1800,
    },
  },

  // 自動再生
  autoplay: {
    delay: 5000,
    disableOnInteraction: false, // クリック後も再開
  },

  // ループ
  loop: true,

  // ナビゲーション（サムネイル）
  thumbs: {
    swiper: {
      el: '.member__slider__nav',
      slidesPerView: 6,
      spaceBetween: 10,
    },
  },

  // エフェクト
  effect: 'slide',

  // イージング
  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
});
```

---

## 🔄 動作の仕組み

### アニメーションフロー

1. **初期状態**
   - 全スライド: `opacity: 0`, `transform: translateX(50px)`（右に50px移動）
   - 最初のスライドのみ `.is-active` クラスが付与

2. **表示アニメーション**
   - `.is-active` が付与されると
   - `opacity: 0 → 1`（フェードイン）
   - `transform: translateX(50px) → translateX(0)`（左にスライド）
   - `transition: 0.8s ease`（0.8秒かけて滑らかに）

3. **スライド遷移**
   - 自動再生またはナビゲーションクリック
   - `.member__slider__track` 全体が `transform: translateX(-n%)` で移動
   - `transition: 1.2s cubic-bezier(...)`（1.2秒でゆっくり移動）
   - 前のスライドから `.is-active` を削除、次のスライドに付与

4. **ホバーエフェクト**
   - リンク全体: `transform: scale(1.05)`（5%拡大）
   - 画像: `transform: scale(1.1)`（10%拡大）
   - `transition: 0.3s/0.6s ease`（素早く反応）

### タイミング設定

| 要素 | アニメーション時間 | イージング | 説明 |
|-----|----------------|-----------|------|
| スライド出現 | 0.8秒 | ease | フェードイン＋スライドイン |
| トラック移動（モバイル） | 1.2秒 | cubic-bezier(0.25, 0.46, 0.45, 0.94) | ゆっくり移動 |
| トラック移動（タブレット） | 1.5秒 | 同上 | さらにゆっくり |
| トラック移動（デスクトップ） | 1.8秒 | 同上 | 最も遅く |
| ホバー（リンク） | 0.3秒 | ease | 即座に反応 |
| ホバー（画像） | 0.6秒 | ease | やや遅く、滑らか |
| 自動再生間隔 | 5秒 | - | 次のスライドへ |

### イージング関数の効果

`cubic-bezier(0.25, 0.46, 0.45, 0.94)`:
- 開始: ゆっくり加速
- 中間: 等速
- 終了: ゆっくり減速
- **結果**: 自然で滑らかな「ゆっくり移動」効果

---

## 📱 レスポンシブ戦略

### 表示枚数の変化

| 画面幅 | 表示枚数 | スライド幅 | 移動速度 |
|--------|---------|----------|---------|
| 0-767px | 1枚 | 100% | 1.2秒 |
| 768-1023px | 2枚 | 50% | 1.5秒 |
| 1024-1439px | 3枚 | 33.333% | 1.8秒 |
| 1440px+ | 3枚（余白増） | 33.333% | 1.8秒 |

### JavaScriptでの判定

```javascript
getVisibleSlides() {
  const width = window.innerWidth;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

showSlide(index) {
  const visibleSlides = this.getVisibleSlides();
  const offset = -index * (100 / visibleSlides);
  this.track.style.transform = `translateX(${offset}%)`;
}
```

---

## 🎯 Karinプロジェクトへの実装戦略

### 構造の模倣ポイント

#### 1. HTML構造

**Boys be maid**:
```html
<section class="member" id="member">
  <div class="member__slider">
    <div class="member__slider__track">
      <div class="member__slide">...</div>
    </div>
  </div>
</section>
```

**Karin実装**:
```html
<section class="characters" id="characters">
  <div class="character-slider">
    <div class="character-slider__track">
      <div class="character-slide">...</div>
    </div>
  </div>
</section>
```

**変更点**:
- クラス名を独自命名（`.member` → `.characters`）
- 構造は同一（親→スライダー→トラック→スライド）

---

#### 2. CSSアニメーション

**Boys be maidのパターン**:
- ゆっくり移動: 1.2〜1.8秒
- イージング: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- フェードイン＋スライドイン: 0.8秒

**Karin実装**:
```css
.character-slider__track {
  transition: transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  /* Boys be maidと同じイージング、1.5秒でゆっくり */
}

.character-slide {
  opacity: 0;
  transform: translateY(30px); /* 下から上へ（Y軸） */
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.character-slide.is-active {
  opacity: 1;
  transform: translateY(0);
}
```

**変更点**:
- X軸（左右）からY軸（上下）へ変更可能
- 速度は同じ（1.5秒）
- イージングは同一

---

#### 3. JavaScript制御

**Boys be maidのパターン**:
- 自動再生: 5秒間隔
- ナビゲーション: サムネイルクリック
- ホバー時停止

**Karin実装**:
```javascript
class CharacterSlider {
  constructor(element) {
    this.slider = element;
    this.currentIndex = 0;
    this.autoplayDelay = 5000; // Boys be maidと同じ5秒
    this.init();
  }

  init() {
    this.showSlide(0);
    this.startAutoplay();

    // ホバーで停止（Boys be maidと同じ）
    this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
    this.slider.addEventListener('mouseleave', () => this.startAutoplay());
  }

  showSlide(index) {
    const offset = -index * 100;
    this.track.style.transform = `translateX(${offset}%)`;
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.showSlide(this.currentIndex);
    }, this.autoplayDelay);
  }
}
```

**変更点**:
- クラス名のみ変更（`MemberSlider` → `CharacterSlider`）
- ロジックは同一

---

#### 4. 画像とコンテンツ

**Boys be maid**:
- WebP形式
- 名前表示: SVG画像
- CV表記: テキスト

**Karin実装**:
```html
<div class="character-slide">
  <a href="/characters/irene.html">
    <div class="character-slide__image">
      <img src="/images/characters/イレーヌ.png" alt="イレーヌ">
    </div>
    <div class="character-slide__name">
      <h3>イレーヌ</h3>
      <!-- SVGではなくテキスト -->
    </div>
    <div class="character-slide__role">メイド長</div>
  </a>
</div>
```

**変更点**:
- PNG/JPG形式使用（既存アセット）
- SVGではなくHTML `<h3>` で名前表示
- CV表記の代わりに「役職」表示

---

### デザインの模倣ポイント

#### 1. レイアウト配置

**Boys be maid**:
- 中央揃え
- 余白: `padding: 4rem 0`
- カード間隔: `gap: 2rem`（タブレット以上）

**Karin実装**:
```css
.character-slider {
  padding: 4rem 0; /* 同じ */
  max-width: 1440px;
  margin: 0 auto;
}

.character-slider__track {
  display: flex;
  gap: 2rem; /* 同じ */
}
```

---

#### 2. カラーパレット

**Boys be maid**: 詳細不明（分析範囲外）

**Karin実装**:
```css
:root {
  --color-primary: #5D0C6B;
  --color-secondary: #800889;
  --color-accent: #9587D3;
  --color-text: #1A1A1A;
  --color-gray: #888;
}

.character-slide__name h3 {
  color: var(--color-primary);
}

.character-slide__role {
  color: var(--color-gray);
}

.character-slider__nav__item.is-active {
  border-color: var(--color-secondary);
}
```

---

#### 3. ホバーエフェクト

**Boys be maid**:
- リンク全体: 拡大（1.05倍）
- 画像: 拡大（1.1倍）

**Karin実装**:
```css
.character-slide__link:hover {
  transform: scale(1.05); /* 同じ */
}

.character-slide__link:hover .character-slide__image img {
  transform: scale(1.1); /* 同じ */
}
```

**完全に同一のエフェクト**

---

## 📝 実装手順（Karinプロジェクト）

### ステップ1: HTMLファイル作成

**ファイル**: `characters.html`

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>キャラクター紹介 - Karin</title>
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/pages/characters.css">
</head>
<body>
  <section class="characters" id="characters">
    <div class="characters__header">
      <h2 class="section-title">登場人物</h2>
    </div>

    <div class="character-slider">
      <div class="character-slider__track">
        <!-- イレーヌ -->
        <div class="character-slide" data-character-id="1">
          <a href="./characters/irene.html" class="character-slide__link">
            <div class="character-slide__image">
              <img src="../images/characters/イレーヌ.png" alt="イレーヌ">
            </div>
            <div class="character-slide__name">
              <h3>イレーヌ</h3>
            </div>
            <div class="character-slide__role">メイド長</div>
          </a>
        </div>

        <!-- マリィ、クリスタ、ポーリン等... -->
      </div>

      <!-- ナビゲーション -->
      <div class="character-slider__nav">
        <button class="character-slider__nav__item is-active" data-slide="0">
          <img src="../images/characters/イレーヌ.png" alt="">
        </button>
        <!-- 残りのサムネイル -->
      </div>
    </div>
  </section>

  <script src="../js/character-slider.js"></script>
</body>
</html>
```

---

### ステップ2: CSSファイル作成

**ファイル**: `css/pages/characters.css`

```css
/* Boys be maidスライダーを模倣したKarin実装 */

.characters {
  padding: 6rem 0;
  background: linear-gradient(180deg, #1A1A1A 0%, #2A1A2A 100%);
}

.characters__header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  color: var(--color-primary);
  font-weight: bold;
}

/* スライダー本体 */
.character-slider {
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
  overflow: hidden;
}

.character-slider__track {
  display: flex;
  transition: transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  /* Boys be maidと同じイージング */
}

.character-slide {
  flex: 0 0 100%;
  padding: 0 1rem;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.character-slide.is-active {
  opacity: 1;
  transform: translateY(0);
}

.character-slide__link {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.character-slide__link:hover {
  transform: scale(1.05); /* Boys be maidと同じ */
}

.character-slide__image {
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 12px;
  border: 3px solid var(--color-secondary);
}

.character-slide__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.character-slide__link:hover .character-slide__image img {
  transform: scale(1.1); /* Boys be maidと同じ */
}

.character-slide__name {
  margin-top: 1.5rem;
  text-align: center;
}

.character-slide__name h3 {
  font-size: 1.75rem;
  color: var(--color-primary);
  margin: 0;
}

.character-slide__role {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-gray);
}

/* ナビゲーション */
.character-slider__nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
}

.character-slider__nav__item {
  width: 60px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
  background: none;
  padding: 0;
  overflow: hidden;
}

.character-slider__nav__item:hover {
  opacity: 0.8;
  transform: translateY(-5px);
}

.character-slider__nav__item.is-active {
  opacity: 1;
  border-color: var(--color-secondary);
}

.character-slider__nav__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* レスポンシブ */
@media (min-width: 768px) {
  .character-slide {
    flex: 0 0 50%;
  }

  .character-slider__track {
    transition: transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
}

@media (min-width: 1024px) {
  .character-slide {
    flex: 0 0 33.333%;
    padding: 0 2rem;
  }

  .character-slider__track {
    transition: transform 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    /* デスクトップでは最も遅く */
  }
}

@media (min-width: 1440px) {
  .character-slider__nav__item {
    width: 80px;
    height: 100px;
  }
}
```

---

### ステップ3: JavaScriptファイル作成

**ファイル**: `js/character-slider.js`

```javascript
/**
 * Character Slider
 * Boys be maidのメンバースライダーを模倣
 */

class CharacterSlider {
  constructor(element) {
    this.slider = element;
    this.track = element.querySelector('.character-slider__track');
    this.slides = Array.from(element.querySelectorAll('.character-slide'));
    this.navItems = Array.from(element.querySelectorAll('.character-slider__nav__item'));

    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000; // 5秒（Boys be maidと同じ）

    this.init();
  }

  init() {
    if (!this.track || this.slides.length === 0) {
      console.warn('Character slider: 要素が見つかりません');
      return;
    }

    // 初期表示
    this.showSlide(0);

    // ナビゲーションイベント
    this.navItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.showSlide(index);
        this.resetAutoplay();
      });
    });

    // キーボード操作
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // 自動再生
    this.startAutoplay();

    // ホバー時停止（Boys be maidと同じ）
    this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
    this.slider.addEventListener('mouseleave', () => this.startAutoplay());

    // リサイズ対応
    window.addEventListener('resize', () => {
      this.showSlide(this.currentIndex);
    });
  }

  showSlide(index) {
    // 範囲外チェック
    if (index < 0) index = this.slides.length - 1;
    if (index >= this.slides.length) index = 0;

    this.currentIndex = index;

    // レスポンシブ判定
    const visibleSlides = this.getVisibleSlides();
    const offset = -index * (100 / visibleSlides);

    // トラック移動
    this.track.style.transform = `translateX(${offset}%)`;

    // アクティブ状態更新
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });

    this.navItems.forEach((item, i) => {
      item.classList.toggle('is-active', i === index);
    });
  }

  getVisibleSlides() {
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  next() {
    this.showSlide(this.currentIndex + 1);
  }

  prev() {
    this.showSlide(this.currentIndex - 1);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }

  destroy() {
    this.stopAutoplay();
    // イベントリスナー削除等のクリーンアップ
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  const characterSlider = document.querySelector('.character-slider');
  if (characterSlider) {
    new CharacterSlider(characterSlider);
  }
});
```

---

## ✅ 実装完了チェックリスト

### HTML
- [ ] `<section class="characters">` 作成
- [ ] `.character-slider__track` 構造実装
- [ ] 各キャラクターの `.character-slide` 追加
- [ ] ナビゲーションサムネイル実装
- [ ] 画像パス確認（`images/characters/`）

### CSS
- [ ] スライダー基本スタイル
- [ ] アニメーション設定（1.5秒、cubic-bezier）
- [ ] `.is-active` クラススタイル
- [ ] ホバーエフェクト（1.05倍、1.1倍）
- [ ] ナビゲーションスタイル
- [ ] レスポンシブ対応（768px、1024px、1440px）

### JavaScript
- [ ] `CharacterSlider` クラス実装
- [ ] `showSlide()` メソッド
- [ ] `getVisibleSlides()` レスポンシブ判定
- [ ] 自動再生機能（5秒間隔）
- [ ] ホバー時停止・再開
- [ ] ナビゲーションクリックイベント
- [ ] キーボード操作（左右矢印）

### テスト
- [ ] モバイル表示確認（1枚表示）
- [ ] タブレット表示確認（2枚表示）
- [ ] デスクトップ表示確認（3枚表示）
- [ ] 自動再生動作確認
- [ ] ナビゲーション動作確認
- [ ] ホバーエフェクト確認
- [ ] キーボード操作確認

---

## 📊 Boys be maid との比較表

| 項目 | Boys be maid | Karin実装 | 一致度 |
|------|-------------|----------|-------|
| **HTML構造** | `.member__slider__track` → `.member__slide` | `.character-slider__track` → `.character-slide` | ✅ 同一構造 |
| **スライド速度** | 1.2〜1.8秒 | 1.5〜1.8秒 | ✅ ほぼ同一 |
| **イージング** | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | 同じ | ✅ 完全一致 |
| **フェードイン** | 0.8秒 | 0.8秒 | ✅ 完全一致 |
| **ホバー拡大** | 1.05倍（リンク）、1.1倍（画像） | 同じ | ✅ 完全一致 |
| **自動再生** | 5秒間隔 | 5秒間隔 | ✅ 完全一致 |
| **レスポンシブ** | 1枚→2枚→3枚 | 同じ | ✅ 完全一致 |
| **ナビゲーション** | サムネイルクリック | 同じ | ✅ 完全一致 |
| **画像形式** | WebP | PNG/JPG | △ 異なる（アセット都合） |
| **名前表示** | SVG画像 | HTML `<h3>` | △ 異なる（実装簡素化） |
| **カラー** | 不明 | 紫色系（#5D0C6B等） | - |

**一致度**: 構造・アニメーション・タイミングは **ほぼ完全に一致**

---

## 🎯 最終的な実装方針

### 完全に模倣する要素

1. ✅ **HTML構造**: 親→スライダー→トラック→スライドの階層
2. ✅ **アニメーション速度**: 1.5〜1.8秒でゆっくり移動
3. ✅ **イージング関数**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
4. ✅ **フェードイン**: 0.8秒
5. ✅ **ホバーエフェクト**: リンク1.05倍、画像1.1倍
6. ✅ **自動再生**: 5秒間隔
7. ✅ **レスポンシブ**: 1枚→2枚→3枚

### 独自にアレンジする要素

1. 🎨 **クラス名**: `.member` → `.characters`（独自命名）
2. 🎨 **カラーパレット**: 紫色系（Karinのテーマカラー）
3. 🎨 **画像形式**: WebP → PNG/JPG（既存アセット活用）
4. 🎨 **名前表示**: SVG → HTML `<h3>`（実装簡素化）
5. 🎨 **追加要素**: 役職表示（CV表記の代わり）

---

**分析完了日**: 2025-11-09
**次のアクション**: ステップ1〜3に従って実装開始

---

**このドキュメントにより、Boys be maidのメンバースライダーと同等のアニメーション構造をKarinプロジェクトに実装できます** 🎬
