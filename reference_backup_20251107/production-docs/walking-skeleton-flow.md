# Walking Skeleton フロー - エロゲサイト MVP

## 🎯 Walking Skeleton とは？
最小限の機能で「エンドツーエンド」の動作を確認できる骨組みです。
このプロジェクトでは、**3ページをシンプルに繋ぎ、基本的なユーザーフローを体験できる状態**を目指します。

---

## 🔄 ユーザーフロー全体像

```
┌─────────────────────────┐
│   ブラウザでアクセス      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  📄 index.html          │
│  (年齢確認ページ)         │
│  - 背景画像表示           │
│  - 2つのボタン            │
│  - ホバーエフェクト        │
└───────────┬─────────────┘
            │
            │ ユーザーがクリック
            │ 「18歳以上」ボタン
            ▼
┌─────────────────────────┐
│  📄 opening.html        │
│  (オープニング)           │
│  - スライドショー(3-5枚)   │
│  - フェード切り替え        │
│  - スキップボタン          │
│  - プログレスバー          │
└───────────┬─────────────┘
            │
            │ 自動遷移 or スキップ
            ▼
┌─────────────────────────┐
│  📄 main.html           │
│  (メインギャラリー)        │
│  - Flexboxギャラリー      │
│  - 画像6-8枚表示          │
│  - ホバー拡大エフェクト     │
│  - レスポンシブ対応        │
└─────────────────────────┘
            │
            │ (今後拡張予定)
            ▼
         各詳細ページ
```

---

## 📋 Walking Skeleton の構成要素

### 1️⃣ 年齢確認ページ（index.html）

#### 最小限の実装内容
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>年齢確認</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/age-verification.css">
</head>
<body>
  <div class="age-verification">
    <!-- 背景画像レイヤー -->
    <div class="background"></div>

    <!-- オーバーレイコンテンツ -->
    <div class="overlay">
      <h1>年齢確認</h1>
      <p>このサイトは18歳以上の方を対象としています</p>
      <div class="buttons">
        <button id="btn-over18" class="btn-primary">18歳以上</button>
        <button id="btn-under18" class="btn-secondary">18歳未満</button>
      </div>
    </div>
  </div>

  <script src="js/age-verification.js"></script>
</body>
</html>
```

#### 動作フロー
```
1. ページ読み込み
   ↓
2. 背景画像表示
   ↓
3. ユーザーがボタンにホバー
   → ボタンが拡大 + グロー効果
   ↓
4. ユーザーが「18歳以上」をクリック
   → フェードアウトアニメーション (500ms)
   ↓
5. opening.html へ遷移
```

#### JavaScript最小実装
```javascript
// js/age-verification.js
document.addEventListener('DOMContentLoaded', () => {
  const btnOver18 = document.getElementById('btn-over18');
  const btnUnder18 = document.getElementById('btn-under18');
  const overlay = document.querySelector('.overlay');

  btnOver18.addEventListener('click', () => {
    overlay.classList.add('fade-out');
    setTimeout(() => {
      window.location.href = 'opening.html';
    }, 500);
  });

  btnUnder18.addEventListener('click', () => {
    alert('18歳未満の方はご利用いただけません。');
    window.location.href = 'https://www.google.com';
  });
});
```

---

### 2️⃣ オープニングページ（opening.html）

#### 最小限の実装内容
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>オープニング</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/opening.css">
</head>
<body>
  <div class="opening">
    <!-- スライドショーコンテナ -->
    <div class="slideshow">
      <div class="slide active" style="background-image: url('assets/images/opening/slide-01.png')"></div>
      <div class="slide" style="background-image: url('assets/images/opening/slide-02.png')"></div>
      <div class="slide" style="background-image: url('assets/images/opening/slide-03.png')"></div>
      <div class="slide" style="background-image: url('assets/images/opening/slide-04.png')"></div>
      <div class="slide" style="background-image: url('assets/images/opening/slide-05.png')"></div>
    </div>

    <!-- スキップボタン -->
    <button id="skip-btn" class="skip-button">SKIP ≫</button>

    <!-- プログレスバー -->
    <div class="progress-bar">
      <div id="progress" class="progress-fill"></div>
    </div>
  </div>

  <script src="js/opening.js"></script>
</body>
</html>
```

#### 動作フロー
```
1. ページ読み込み
   ↓
2. 最初の画像（slide-01.png）表示
   ↓
3. 2秒待機
   ↓
4. フェードアウト → 次の画像にフェードイン
   ↓
5. 全5枚を繰り返し（合計10秒）
   ↓
6. 最後の画像表示後、2秒待機
   ↓
7. フェードアウト
   ↓
8. main.html へ自動遷移

[スキップボタンの動作]
- いつでもクリック可能
- クリック時は即座に main.html へ遷移
```

#### JavaScript最小実装
```javascript
// js/opening.js
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const skipBtn = document.getElementById('skip-btn');
  const progressBar = document.getElementById('progress');

  let currentSlide = 0;
  const totalSlides = slides.length;
  const slideInterval = 2000; // 2秒
  const totalDuration = slideInterval * totalSlides;

  // スライドショー開始
  function showNextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide++;

    if (currentSlide >= totalSlides) {
      // 全スライド終了 → main.html へ遷移
      setTimeout(() => {
        window.location.href = 'main.html';
      }, 500);
      return;
    }

    slides[currentSlide].classList.add('active');
  }

  // プログレスバー更新
  function updateProgress() {
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // 自動スライドショー
  const interval = setInterval(() => {
    showNextSlide();
    updateProgress();
  }, slideInterval);

  // スキップボタン
  skipBtn.addEventListener('click', () => {
    clearInterval(interval);
    window.location.href = 'main.html';
  });
});
```

---

### 3️⃣ メインページ（main.html）

#### 最小限の実装内容
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ギャラリー</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <!-- ヘッダー -->
  <header class="header">
    <h1 class="site-title">ゲームタイトル</h1>
  </header>

  <!-- ギャラリー -->
  <main class="gallery-container">
    <div class="gallery">
      <div class="gallery-item" data-link="#">
        <img src="assets/images/gallery/thumb-01.jpg" alt="Gallery 1">
        <div class="overlay-info">
          <h3>タイトル1</h3>
          <p>説明文</p>
        </div>
      </div>

      <div class="gallery-item" data-link="#">
        <img src="assets/images/gallery/thumb-02.jpg" alt="Gallery 2">
        <div class="overlay-info">
          <h3>タイトル2</h3>
          <p>説明文</p>
        </div>
      </div>

      <!-- 以下、thumb-03.jpg ~ thumb-08.jpg まで繰り返し -->
    </div>
  </main>

  <script src="js/main.js"></script>
</body>
</html>
```

#### 動作フロー
```
1. ページ読み込み
   ↓
2. ヘッダー表示
   ↓
3. ギャラリー画像が3列（デスクトップ）で表示
   ↓
4. ユーザーが画像にホバー
   → 画像が拡大 (scale: 1.05)
   → オーバーレイ情報表示（タイトル・説明文）
   ↓
5. ユーザーが画像をクリック
   → (MVP版では何もしない、または alert 表示)
   → (将来的には詳細ページへ遷移)
```

#### JavaScript最小実装
```javascript
// js/main.js (MVP版は最小限)
document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const link = item.getAttribute('data-link');
      if (link && link !== '#') {
        window.location.href = link;
      } else {
        alert('準備中です');
      }
    });
  });
});
```

---

## 🎨 CSS実装の骨組み

### 共通CSS変数（variables.css）
```css
:root {
  /* Colors */
  --primary-color: #8B00FF;
  --secondary-color: #FF1493;
  --bg-dark: #1a1a1a;
  --text-white: #ffffff;
  --overlay-dark: rgba(0, 0, 0, 0.7);

  /* Transitions */
  --transition-speed: 0.3s;
  --transition-slow: 0.5s;

  /* Effects */
  --hover-scale: 1.05;
  --glow-shadow: 0 0 20px rgba(139, 0, 255, 0.6);
}
```

### レスポンシブブレークポイント
```css
/* Desktop: 1024px以上 */
/* Tablet: 768px - 1023px */
/* Mobile: 767px以下 */

@media (max-width: 1023px) {
  /* タブレット用スタイル */
}

@media (max-width: 767px) {
  /* スマートフォン用スタイル */
}
```

---

## 📊 Walking Skeleton チェックリスト

### ✅ Phase 1: 年齢確認ページ
- [ ] HTML構造が完成している
- [ ] 背景画像が表示される
- [ ] 2つのボタンが配置されている
- [ ] ボタンホバー時にエフェクトが発生する
- [ ] 「18歳以上」ボタンで opening.html へ遷移する
- [ ] 「18歳未満」ボタンで警告が表示される
- [ ] レスポンシブ対応（デスクトップ/スマホ）

### ✅ Phase 2: オープニングページ
- [ ] HTML構造が完成している
- [ ] スライドショーが自動で開始する
- [ ] 2秒ごとに画像が切り替わる
- [ ] フェードイン/アウトが滑らかに動作する
- [ ] スキップボタンが表示される
- [ ] スキップボタンで main.html へ即座に遷移する
- [ ] プログレスバーが進行状況を表示する（オプション）
- [ ] 全スライド終了後、自動で main.html へ遷移する
- [ ] レスポンシブ対応

### ✅ Phase 3: メインページ
- [ ] HTML構造が完成している
- [ ] ヘッダーが表示される
- [ ] ギャラリーが Flexbox で配置される
- [ ] 画像が 3列（デスクトップ）で表示される
- [ ] 画像ホバー時に拡大エフェクトが発生する
- [ ] オーバーレイ情報が表示される
- [ ] レスポンシブ対応（3列→2列→1列）

### ✅ Phase 4: 統合テスト
- [ ] index.html → opening.html → main.html のフローが正常
- [ ] 全ページでアニメーションが滑らかに動作する
- [ ] 各デバイスで表示が崩れていない
- [ ] 主要ブラウザで動作する（Chrome, Firefox, Safari, Edge）
- [ ] 読み込み速度が許容範囲内（3秒以内）

---

## 🚀 次のステップ（Post-Walking Skeleton）

Walking Skeleton が完成したら、以下の機能を段階的に追加していきます：

### 🎬 動画・高度なアニメーション
- AI生成動画の統合（年齢確認ページ）
- イントロ動画の追加（オープニングページ）
- ホワイトフラッシュエフェクト
- Intersection Observer によるスクロールアニメーション

### 🎨 UX向上
- 詳細なプログレスバー
- モーダル表示機能
- ローディングアニメーション
- 画像の遅延読み込み（Lazy Loading）

### ⚡ パフォーマンス最適化
- 画像の WebP 変換
- CSS/JS の最小化
- キャッシュ戦略
- GPU アクセラレーション最適化

---

## 📁 Walking Skeleton ファイル構成

### 必須ファイル
```
Karin_gamesite/
├── index.html                    # 年齢確認ページ
├── opening.html                  # オープニングページ
├── main.html                     # メインギャラリーページ
├── css/
│   ├── reset.css                # CSSリセット
│   ├── variables.css            # CSS変数
│   ├── common.css               # 共通スタイル
│   ├── age-verification.css     # 年齢確認ページ専用
│   ├── opening.css              # オープニングページ専用
│   └── main.css                 # メインページ専用
├── js/
│   ├── age-verification.js      # 年齢確認ロジック
│   ├── opening.js               # スライドショーロジック
│   └── main.js                  # ギャラリーロジック
└── assets/
    └── images/
        ├── age-verification/
        │   └── background.jpg   # 背景画像
        ├── opening/
        │   ├── slide-01.png     # スライドショー画像
        │   ├── slide-02.png
        │   ├── slide-03.png
        │   ├── slide-04.png
        │   └── slide-05.png
        └── gallery/
            ├── thumb-01.jpg     # ギャラリー画像
            ├── thumb-02.jpg
            ├── thumb-03.jpg
            ├── thumb-04.jpg
            ├── thumb-05.jpg
            ├── thumb-06.jpg
            ├── thumb-07.jpg
            └── thumb-08.jpg
```

### 参考資料（既存）
```
reference/
├── requirements.txt                  # 要件定義書
├── implementation-plan.md            # 実装計画書
├── walking-skeleton-flow.md          # このファイル
├── reference-site-sitemap.md         # 参考サイト構造
└── reference-site-sitemap.json       # 参考サイト構造（JSON）
```

---

## 🎯 Walking Skeleton 完成の定義

以下の条件をすべて満たすことで、Walking Skeleton が完成とみなします：

1. ✅ **3ページが存在し、すべて表示できる**
2. ✅ **ページ間の遷移が正常に機能する**
3. ✅ **基本的なアニメーションが実装されている**
4. ✅ **レスポンシブ対応が完了している**
5. ✅ **エンドツーエンドでユーザーフローを体験できる**

この状態になれば、**拡張可能な土台**が完成します！
