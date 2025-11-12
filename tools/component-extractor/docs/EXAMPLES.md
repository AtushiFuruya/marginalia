# Component Extractor - 使用例集

---

## 📚 目次

1. [Boys be maid - ScrollReveal抽出](#1-boys-be-maid---scrollreveal抽出)
2. [レスポンシブグリッドレイアウト抽出](#2-レスポンシブグリッドレイアウト抽出)
3. [ドロップダウンメニュー抽出](#3-ドロップダウンメニュー抽出)
4. [ヘッダーナビゲーション抽出](#4-ヘッダーナビゲーション抽出)
5. [カルーセル/スライダー抽出](#5-カルーセルスライダー抽出)
6. [モーダルダイアログ抽出](#6-モーダルダイアログ抽出)
7. [設定ファイル使用パターン](#7-設定ファイル使用パターン)

---

## 1. Boys be maid - ScrollReveal抽出

### 目的
ScrollReveal.jsのアニメーション実装パターンを学習

### コマンド

```bash
component-extract \
  --url https://boysbemaid.jp/ \
  --selector ".member_slide.js-scrollreveal" \
  --output ./extracted-components/boysbemaid-scrollreveal \
  --wait 3000
```

### 抽出される情報

**HTML**:
- `.member_slide`のDOM構造
- `data-reveal`属性の使用パターン
- 画像、テキスト要素の配置

**CSS**:
- 初期状態（`opacity: 0`, `transform: translateY(30px)`）
- アニメーション後（`.is-visible`クラス）
- `transition`プロパティ（duration, easing）

**JavaScript**:
- ScrollReveal.jsライブラリの読み込み
- 初期化コード
- スクロールイベントリスナ

**イベント**:
- `scroll`イベント
- Intersection Observer（使用している場合）

### 活用方法

```javascript
// 抽出結果から学んだパターンを自分のプロジェクトに適用

// styles.css から学んだこと
.my-reveal {
  opacity: 0;
  transform: translateY(60px);
  transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
}

.my-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

// scripts.js から学んだこと
ScrollReveal().reveal('.my-reveal', {
  origin: 'bottom',
  distance: '60px',
  duration: 800,
  delay: 200,
  interval: 150
});
```

---

## 2. レスポンシブグリッドレイアウト抽出

### 目的
CSS Grid + メディアクエリの実装パターンを学習

### コマンド

```bash
component-extract \
  --url https://example.com \
  --selector ".product-grid" \
  --output ./extracted-components/responsive-grid \
  --screenshot
```

### 抽出される情報

**CSS**:
- `display: grid`
- `grid-template-columns`（ブレークポイント別）
- `gap`, `grid-auto-flow`
- メディアクエリのブレークポイント値

**例**:

```css
/* styles.css から抽出される情報 */

.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }
}
```

### 活用方法

自分のプロジェクトで同様のブレークポイントとグリッド構造を採用：

```css
.my-character-grid {
  display: grid;
  grid-template-columns: 1fr; /* モバイル */
  gap: 2rem;
}

@media (min-width: 768px) {
  .my-character-grid {
    grid-template-columns: repeat(2, 1fr); /* タブレット */
  }
}

@media (min-width: 1024px) {
  .my-character-grid {
    grid-template-columns: repeat(3, 1fr); /* デスクトップ */
  }
}
```

---

## 3. ドロップダウンメニュー抽出

### 目的
ホバー/クリックで開閉するメニューの実装を学習

### コマンド

```bash
component-extract \
  --url https://example.com \
  --selector ".dropdown-menu" \
  --events \
  --output ./extracted-components/dropdown
```

### 抽出される情報

**HTML**:
- メニューの親子構造
- `data-*`属性の使用

**CSS**:
- 初期状態（`display: none` または `opacity: 0`）
- 開いた状態（`.is-open`クラス等）
- ホバー時のスタイル（`:hover`）

**JavaScript**:
- クリックイベントリスナ
- クラストグル処理
- 外側クリックで閉じる処理

**イベント**:
- `click`イベント
- `mouseenter` / `mouseleave`

### 活用方法

```javascript
// 抽出したパターンを参考に実装

const dropdownTrigger = document.querySelector('.dropdown-trigger');
const dropdownMenu = document.querySelector('.dropdown-menu');

dropdownTrigger.addEventListener('click', () => {
  dropdownMenu.classList.toggle('is-open');
});

// 外側クリックで閉じる
document.addEventListener('click', (e) => {
  if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove('is-open');
  }
});
```

---

## 4. ヘッダーナビゲーション抽出

### 目的
スティッキーヘッダーやハンバーガーメニューの実装を学習

### コマンド

```bash
component-extract \
  --url https://example.com \
  --selector "header.site-header" \
  --events \
  --output ./extracted-components/header
```

### 抽出される情報

**CSS**:
- `position: sticky` または `position: fixed`
- スクロール時の状態変化（`.scrolled`クラス等）
- ハンバーガーメニューのアニメーション（`transform`, `transition`）

**JavaScript**:
- スクロールイベントリスナ
- ハンバーガーメニューのトグル
- スムーズスクロール

**イベント**:
- `scroll`イベント
- `click`イベント（メニューアイテム）

### 活用方法

```css
/* スティッキーヘッダー */
header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  transition: background 0.3s;
}

header.scrolled {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
```

```javascript
// スクロール検出
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  const header = document.querySelector('header');

  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});
```

---

## 5. カルーセル/スライダー抽出

### 目的
画像スライダーの実装パターンを学習

### コマンド

```bash
component-extract \
  --url https://example.com \
  --selector ".carousel-container" \
  --events \
  --wait 3000 \
  --output ./extracted-components/carousel
```

### 抽出される情報

**HTML**:
- スライドアイテムの構造
- ナビゲーションボタン（prev/next）
- インジケータ（ドット）

**CSS**:
- `transform: translateX()` によるスライド
- `transition`プロパティ
- アクティブスライドのスタイル

**JavaScript**:
- スライド切り替えロジック
- 自動再生（`setInterval`）
- タッチイベント（スワイプ）

**イベント**:
- `click`イベント（prev/nextボタン）
- `touchstart`, `touchmove`, `touchend`（スワイプ）

### 活用方法

```javascript
// シンプルなカルーセル実装

class Carousel {
  constructor(element) {
    this.element = element;
    this.slides = element.querySelectorAll('.carousel-item');
    this.currentIndex = 0;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlide();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlide();
  }

  updateSlide() {
    const offset = -this.currentIndex * 100;
    this.element.querySelector('.carousel-track').style.transform = `translateX(${offset}%)`;
  }
}

const carousel = new Carousel(document.querySelector('.carousel'));
document.querySelector('.carousel-next').addEventListener('click', () => carousel.next());
document.querySelector('.carousel-prev').addEventListener('click', () => carousel.prev());
```

---

## 6. モーダルダイアログ抽出

### 目的
モーダルの開閉アニメーションと背景オーバーレイの実装を学習

### コマンド

```bash
component-extract \
  --url https://example.com \
  --selector ".modal-container" \
  --events \
  --output ./extracted-components/modal
```

### 抽出される情報

**HTML**:
- モーダル本体（`.modal`）
- オーバーレイ（`.modal-overlay`）
- 閉じるボタン（`.modal-close`）

**CSS**:
- 初期状態（`display: none` または `opacity: 0`）
- 開いた状態（`.is-open`クラス）
- フェードイン/スライドインアニメーション
- オーバーレイのスタイル（`position: fixed`, `background: rgba(0,0,0,0.5)`）

**JavaScript**:
- モーダル開閉処理
- Escapeキーで閉じる
- オーバーレイクリックで閉じる
- body スクロール無効化（`overflow: hidden`）

**イベント**:
- `click`イベント（開く/閉じるボタン）
- `keydown`イベント（Escape）

### 活用方法

```css
/* モーダルスタイル */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  z-index: 1001;
  pointer-events: none;
}

.modal.is-open {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  pointer-events: auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 1000;
}

.modal-overlay.is-open {
  opacity: 1;
  pointer-events: auto;
}
```

```javascript
// モーダル開閉処理

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.querySelector('.modal-overlay');

  modal.classList.add('is-open');
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden'; // スクロール無効化
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.querySelector('.modal-overlay');

  modal.classList.remove('is-open');
  overlay.classList.remove('is-open');
  document.body.style.overflow = ''; // スクロール復元
}

// Escapeキーで閉じる
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.is-open').forEach(modal => {
      closeModal(modal.id);
    });
  }
});

// オーバーレイクリックで閉じる
document.querySelector('.modal-overlay').addEventListener('click', () => {
  document.querySelectorAll('.modal.is-open').forEach(modal => {
    closeModal(modal.id);
  });
});
```

---

## 7. 設定ファイル使用パターン

### パターンA: プロジェクト別設定

**boys be maid 抽出用** (`config/boysbemaid-extract.json`):

```json
{
  "url": "https://boysbemaid.jp/",
  "selector": ".member_slide.js-scrollreveal",
  "outputDir": "./extracted-components/boysbemaid",
  "waitTime": 3000,
  "coverage": true,
  "events": true,
  "screenshot": true
}
```

**実行**:

```bash
component-extract --config ./config/boysbemaid-extract.json
```

---

### パターンB: 複数ターゲット一括抽出

**batch-extract.sh**:

```bash
#!/bin/bash

# Boys be maid - ScrollReveal
component-extract --config ./config/boysbemaid-scrollreveal.json

# Boys be maid - ナビゲーション
component-extract --config ./config/boysbemaid-nav.json

# BUG SYSTEM - プロダクト詳細
component-extract --config ./config/bug-system-product.json

echo "✅ 一括抽出完了"
```

**実行**:

```bash
chmod +x batch-extract.sh
./batch-extract.sh
```

---

### パターンC: ヘッドレスモード無効化（デバッグ用）

**debug-extract.json**:

```json
{
  "url": "https://example.com",
  "selector": ".target-component",
  "headless": false,
  "waitTime": 5000,
  "outputDir": "./debug-extract"
}
```

ブラウザが表示され、抽出処理を目視確認できます。

---

## 📊 抽出結果の比較分析

### 複数サイトのアニメーションパターン比較

```bash
# Site A
component-extract --url https://site-a.com --selector ".animate" --output ./compare/site-a

# Site B
component-extract --url https://site-b.com --selector ".animate" --output ./compare/site-b

# Site C
component-extract --url https://site-c.com --selector ".animate" --output ./compare/site-c
```

**比較ポイント**:

| サイト | アニメーションライブラリ | duration | easing | トリガー |
|--------|----------------------|----------|--------|---------|
| Site A | ScrollReveal.js | 800ms | cubic-bezier | Intersection Observer |
| Site B | GSAP | 600ms | Power2.easeOut | scroll event |
| Site C | 自作 | 1000ms | ease-in-out | IntersectionObserver |

**結論**: 自分のプロジェクトには Site A のパターンが最適（シンプル、パフォーマンス良好）

---

## 🎯 まとめ

Component Extractorを使用することで：

- ✅ 手作業コピペ不要
- ✅ 構造・遷移・依存を機械的に抽出
- ✅ 複数サイトのパターン比較が容易
- ✅ 自分の実装への抽象的応用が可能

**次のステップ**: 抽出結果を `reference/analyzed-sites/` に統合し、Karin_gamesiteの実装に活用
