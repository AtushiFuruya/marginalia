# Boys be maid - ScrollReveal アニメーション分析

> **分析対象**: https://boysbemaid.jp/
> **ターゲット要素**: `<div class="member_slide js-scrollreveal" data-reveal="1">`
> **分析日**: 2025-11-08

---

## 📋 分析結果サマリー

### 使用ライブラリ
**ScrollReveal.js**
- バージョン: 4.x（推定）
- サイズ: 3KB（minified）
- CDN: https://unpkg.com/scrollreveal@4.0.9/dist/scrollreveal.min.js
- 依存関係: Rematrix（Transform行列計算）

### 検出方法
- スクロールイベントリスナー使用（Intersection Observerではない）
- AABB衝突検出でビューポート表示判定
- Transform行列計算でアニメーション生成

---

## 🎯 HTML構造

### 基本構造
```html
<div class="member_slide js-scrollreveal" data-reveal="1">
    <div class="member_slide__image">
        <img src="member-image.jpg" alt="キャラクター名">
    </div>
    <div class="member_slide__info">
        <h3>キャラクター名</h3>
        <p>説明文...</p>
    </div>
</div>
```

### クラス・属性の役割

#### `.js-scrollreveal`
- **目的**: ScrollReveal.jsのターゲット指定
- **動作**: このクラスを持つ要素がスクロールで表示されるとアニメーション発火
- **自動付与される属性**: `data-sr-id`（ScrollRevealが自動生成）

#### `data-reveal="1"`
- **目的**: アニメーションバリアント指定
- **使用例**:
  - `data-reveal="1"` → 下からフェードイン
  - `data-reveal="2"` → 左からスライド
  - `data-reveal="3"` → 右からスライド
  - `data-reveal="4"` → ズームイン

---

## 💻 JavaScript実装

### 基本初期化
```javascript
// CDN読み込み後、以下のコードで初期化
ScrollReveal().reveal('.js-scrollreveal', {
    // デフォルト設定
    origin: 'bottom',        // アニメーション開始位置
    distance: '60px',        // 移動距離
    duration: 800,           // アニメーション時間（ms）
    delay: 200,              // 開始遅延（ms）
    opacity: 0,              // 初期透明度
    easing: 'cubic-bezier(0.5, 0, 0, 1)',  // イージング
    interval: 150,           // 複数要素の遅延間隔（スタッガー効果）
    viewFactor: 0.2,         // 要素の20%が表示されたらトリガー
    reset: false             // スクロールで戻っても再アニメーションしない
});
```

### data-reveal属性による分岐実装
```javascript
// 各data-reveal値に応じて異なるアニメーションを適用
document.querySelectorAll('[data-reveal]').forEach(el => {
    const revealType = el.getAttribute('data-reveal');

    const animations = {
        '1': {
            origin: 'bottom',
            distance: '50px',
            opacity: 0,
            duration: 800,
            delay: 200
        },
        '2': {
            origin: 'left',
            distance: '100px',
            opacity: 0,
            duration: 1000,
            delay: 300
        },
        '3': {
            origin: 'right',
            distance: '100px',
            opacity: 0,
            duration: 1000,
            delay: 300
        },
        '4': {
            scale: 0.9,
            distance: '0px',
            opacity: 0,
            duration: 600,
            delay: 100
        }
    };

    if (animations[revealType]) {
        ScrollReveal().reveal(el, animations[revealType]);
    }
});
```

---

## 🎨 CSS実装

### 初期状態（アニメーション前）
```css
.js-scrollreveal {
    /* ScrollReveal.jsが自動で以下を適用 */
    opacity: 0;
    transform: translate3d(0, 50px, 0);  /* 下に50px移動 */
    transition: opacity 600ms cubic-bezier(0.5, 0, 0, 1) 0ms,
                transform 600ms cubic-bezier(0.5, 0, 0, 1) 0ms;
}
```

### 最終状態（アニメーション後）
```css
.js-scrollreveal.sr-is-visible {
    /* ScrollReveal.jsが自動で以下に変更 */
    opacity: 1;
    transform: translate3d(0, 0, 0);  /* 元の位置 */
}
```

### カスタムスタイル（オプション）
```css
/* member_slideクラス固有のスタイル */
.member_slide {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    overflow: hidden;
}

.member_slide__image {
    width: 100%;
    margin-bottom: 1rem;
}

.member_slide__image img {
    width: 100%;
    height: auto;
    border-radius: 4px;
}

.member_slide__info h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-accent);
}
```

---

## ⚙️ ScrollReveal設定オプション詳細

### デフォルト設定
```javascript
{
    delay: 0,                    // アニメーション開始遅延（ms）
    distance: '0',               // 移動距離（px/%/em/rem）
    duration: 600,               // アニメーション時間（ms）
    easing: 'cubic-bezier(0.5, 0, 0, 1)',  // イージング関数
    interval: 0,                 // 複数要素の間隔（スタッガー）
    opacity: 0,                  // 初期透明度（0-1）
    origin: 'bottom',            // 開始位置（top/right/bottom/left）
    rotate: { x: 0, y: 0, z: 0 },  // 回転（度）
    scale: 1,                    // スケール（0-1以上）
    viewFactor: 0.0,             // トリガー閾値（0-1）
    reset: false,                // スクロールバックで再アニメーション
    mobile: true,                // モバイルで有効化
    desktop: true,               // デスクトップで有効化
    cleanup: false               // アニメーション後にインラインスタイル削除
}
```

### 主要オプション解説

#### `origin` - アニメーション開始位置
```javascript
// 下から上へ（最も一般的）
{ origin: 'bottom', distance: '50px' }

// 左から右へ
{ origin: 'left', distance: '100px' }

// 上から下へ
{ origin: 'top', distance: '60px' }

// 右から左へ
{ origin: 'right', distance: '80px' }
```

#### `viewFactor` - トリガー閾値
```javascript
// 要素の20%が表示されたらアニメーション開始
{ viewFactor: 0.2 }

// 要素の50%が表示されたらアニメーション開始
{ viewFactor: 0.5 }

// 要素が完全に表示されたらアニメーション開始
{ viewFactor: 1.0 }
```

#### `interval` - スタッガー効果
```javascript
// 複数要素を150msずつ遅延して表示
ScrollReveal().reveal('.member_slide', {
    interval: 150  // 1つ目: 0ms、2つ目: 150ms、3つ目: 300ms...
});
```

---

## 🎬 アニメーションバリエーション

### 1. フェードイン（基本）
```javascript
ScrollReveal().reveal('.fade-in', {
    distance: '0px',
    opacity: 0,
    duration: 600,
    easing: 'ease-in-out'
});
```

### 2. 下からスライドイン
```javascript
ScrollReveal().reveal('.slide-up', {
    origin: 'bottom',
    distance: '60px',
    opacity: 0,
    duration: 800,
    easing: 'cubic-bezier(0.5, 0, 0, 1)'
});
```

### 3. 左からスライドイン
```javascript
ScrollReveal().reveal('.slide-right', {
    origin: 'left',
    distance: '100px',
    opacity: 0,
    duration: 1000,
    easing: 'ease-out'
});
```

### 4. ズームイン
```javascript
ScrollReveal().reveal('.zoom-in', {
    scale: 0.85,
    distance: '0px',
    opacity: 0,
    duration: 800
});
```

### 5. 回転しながらフェードイン
```javascript
ScrollReveal().reveal('.rotate-fade', {
    rotate: { z: 15 },
    opacity: 0,
    duration: 1000,
    easing: 'ease-in-out'
});
```

### 6. スタッガー（順次表示）
```javascript
ScrollReveal().reveal('.stagger-item', {
    origin: 'bottom',
    distance: '50px',
    opacity: 0,
    duration: 600,
    interval: 200  // 200msずつ遅延
});
```

---

## 🚀 Karin_gamesiteへの統合方法

### ステップ1: CDN読み込み
```html
<!-- HTMLのbody閉じタグ直前に追加 -->
<script src="https://unpkg.com/scrollreveal@4.0.9/dist/scrollreveal.min.js"></script>
```

### ステップ2: HTML要素にクラス追加
```html
<!-- キャラクタースライド（boys be maid風） -->
<section id="character" class="character-section">
    <div class="member_slide js-scrollreveal" data-reveal="1">
        <img src="/images/characters/イレーヌ.png" alt="イレーヌ">
        <h3>イレーヌ</h3>
    </div>

    <div class="member_slide js-scrollreveal" data-reveal="1">
        <img src="/images/characters/マリィ.png" alt="マリィ">
        <h3>マリィ</h3>
    </div>

    <div class="member_slide js-scrollreveal" data-reveal="1">
        <img src="/images/characters/クリスタ.png" alt="クリスタ">
        <h3>クリスタ</h3>
    </div>
</section>

<!-- ギャラリー画像 -->
<section id="gallery" class="gallery-section">
    <div class="gallery-item js-scrollreveal" data-reveal="2">
        <img src="/images/gallery/scene_daily.jpg" alt="Scene 1">
    </div>

    <div class="gallery-item js-scrollreveal" data-reveal="3">
        <img src="/images/gallery/scene_caning.jpg" alt="Scene 2">
    </div>

    <div class="gallery-item js-scrollreveal" data-reveal="2">
        <img src="/images/gallery/scene_blowjob.jpg" alt="Scene 3">
    </div>
</section>
```

### ステップ3: JavaScript初期化
```javascript
// js/main.js または <script>タグ内
document.addEventListener('DOMContentLoaded', () => {
    // data-reveal属性に応じたアニメーション設定
    const animations = {
        '1': {
            origin: 'bottom',
            distance: '60px',
            opacity: 0,
            duration: 800,
            delay: 200,
            interval: 150,  // スタッガー効果
            easing: 'cubic-bezier(0.5, 0, 0, 1)',
            viewFactor: 0.2
        },
        '2': {
            origin: 'left',
            distance: '100px',
            opacity: 0,
            duration: 1000,
            delay: 300,
            easing: 'ease-out'
        },
        '3': {
            origin: 'right',
            distance: '100px',
            opacity: 0,
            duration: 1000,
            delay: 300,
            easing: 'ease-out'
        },
        '4': {
            scale: 0.9,
            distance: '0px',
            opacity: 0,
            duration: 600,
            delay: 100
        }
    };

    // data-reveal属性を持つ要素に適用
    document.querySelectorAll('[data-reveal]').forEach(el => {
        const revealType = el.getAttribute('data-reveal');
        if (animations[revealType]) {
            ScrollReveal().reveal(el, animations[revealType]);
        }
    });

    // data-reveal属性がない.js-scrollreveal要素にはデフォルト適用
    ScrollReveal().reveal('.js-scrollreveal:not([data-reveal])', {
        origin: 'bottom',
        distance: '50px',
        opacity: 0,
        duration: 800,
        interval: 150
    });
});
```

---

## 📱 レスポンシブ対応

### モバイルでアニメーションを無効化（オプション）
```javascript
ScrollReveal().reveal('.js-scrollreveal', {
    origin: 'bottom',
    distance: '60px',
    duration: 800,
    mobile: false  // モバイルでは無効化（パフォーマンス向上）
});
```

### ブレークポイント別設定
```javascript
const isMobile = window.innerWidth <= 767;
const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1023;

ScrollReveal().reveal('.member_slide', {
    origin: 'bottom',
    distance: isMobile ? '30px' : '60px',  // モバイルは移動距離を短く
    duration: isMobile ? 600 : 800,        // モバイルは短時間
    interval: isMobile ? 100 : 150,        // モバイルは間隔を短く
    viewFactor: isMobile ? 0.1 : 0.2       // モバイルは早めに発火
});
```

---

## ⚡ パフォーマンス最適化

### 1. GPU アクセラレーション
ScrollReveal.jsは自動的に`translate3d()`を使用してGPU加速を有効化します。

```css
/* ScrollReveal.jsが自動生成するスタイル */
.js-scrollreveal {
    transform: translate3d(0, 50px, 0);  /* GPU加速 */
    will-change: transform, opacity;      /* ブラウザ最適化ヒント */
}
```

### 2. クリーンアップ（オプション）
```javascript
// アニメーション完了後にインラインスタイルを削除
ScrollReveal().reveal('.js-scrollreveal', {
    cleanup: true  // メモリ使用量削減
});
```

### 3. リセット無効化
```javascript
// スクロールバック時の再アニメーションを無効化（パフォーマンス向上）
ScrollReveal().reveal('.js-scrollreveal', {
    reset: false  // 一度だけアニメーション
});
```

---

## 🎨 Karinプロジェクト推奨設定

### キャラクタースライド（member_slide）
```javascript
ScrollReveal().reveal('.member_slide', {
    origin: 'bottom',
    distance: '60px',
    opacity: 0,
    duration: 800,
    delay: 200,
    interval: 150,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    viewFactor: 0.2,
    reset: false,
    mobile: true
});
```

### ギャラリー画像（交互スライド）
```javascript
// 左からスライド
ScrollReveal().reveal('.gallery-item:nth-child(odd)', {
    origin: 'left',
    distance: '100px',
    opacity: 0,
    duration: 1000,
    easing: 'ease-out'
});

// 右からスライド
ScrollReveal().reveal('.gallery-item:nth-child(even)', {
    origin: 'right',
    distance: '100px',
    opacity: 0,
    duration: 1000,
    easing: 'ease-out'
});
```

### セクションタイトル
```javascript
ScrollReveal().reveal('.section-title', {
    distance: '0px',
    opacity: 0,
    scale: 0.9,
    duration: 600,
    easing: 'ease-out'
});
```

---

## 🔧 トラブルシューティング

### アニメーションが発火しない
**原因**: 要素の高さが0、または `display: none`
**解決**: 要素に適切な高さを設定、または `visibility: hidden`を使用

### アニメーションがカクつく
**原因**: GPU加速が効いていない
**解決**: `transform: translate3d()`を使用（ScrollReveal.jsは自動的に使用）

### モバイルで動作が重い
**解決**: `mobile: false`でモバイルを無効化、または`interval`と`duration`を短縮

---

## 📚 関連ドキュメント

### このディレクトリ内
- [README.md](README.md) - boys be maid概要
- [ANALYSIS-SUMMARY.md](ANALYSIS-SUMMARY.md) - 詳細分析
- [manual-inspection-guide.md](manual-inspection-guide.md) - DevTools手順

### Karin_gamesite関連
- [main.html再作成プロンプト](../../prompts/main-html-prompt.md) - 実装指示
- [responsive-design-2025.md](../../production-docs/responsive-design-2025.md) - レスポンシブ仕様

---

## ✅ 実装チェックリスト

- [ ] ScrollReveal.js CDN読み込み
- [ ] `.js-scrollreveal`クラスを要素に追加
- [ ] `data-reveal`属性でバリアント指定
- [ ] JavaScript初期化コード作成
- [ ] アニメーション設定（origin, distance, duration等）
- [ ] スタッガー効果設定（interval）
- [ ] レスポンシブ対応（mobile設定）
- [ ] パフォーマンス最適化（cleanup, reset）
- [ ] ブラウザテスト（全サイズ確認）

---

**分析完了日**: 2025-11-08
**次のアクション**: main.htmlへのScrollReveal統合

---

**この分析により、boys be maidと同等のスクロールアニメーションをKarinプロジェクトに実装できます** 🎬
