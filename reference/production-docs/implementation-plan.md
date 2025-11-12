# 実装計画書 - エロゲサイト MVP

## 📋 プロジェクト概要
**目的**: Walking Skeleton（動作する最小限の骨組み）を構築し、3ページの基本フローを確立する

**開発期間**: 1-2週間（MVP版）

**成果物**:
- 年齢確認ページ（index.html）
- オープニングページ（opening.html）
- メインページ（main.html）

---

## 🎯 MVP スコープ定義

### ✅ MVP に含めるもの
- **年齢確認ページ**
  - 静的背景画像（動画は後フェーズ）
  - 年齢確認ボタン（2つ）
  - 基本的なホバーエフェクト
  - ページ遷移機能

- **オープニングページ**
  - 簡易版スライドショー（3-5枚のPNG画像）
  - ホワイトフラッシュエフェクト
  - 基本的なフェード切り替え
  - スキップボタン
  - プログレスバー（オプション）
  - 自動遷移機能

- **メインページ**
  - シンプルなFlexboxギャラリー（2-3列）
  - 基本的な画像表示（6-8枚）
  - ホバー時の拡大エフェクト
  - レスポンシブレイアウト

### ❌ MVP に含めないもの（後フェーズ）
- AI生成動画（年齢確認ページ）
- イントロ動画（オープニングページ）
- Intersection Observer によるスクロールアニメーション
- 複雑なオーバーレイエフェクト
- 詳細なプログレスバー
- 外部APIとの連携

---

## 🏗️ ディレクトリ構造

```
Karin_gamesite/
├── index.html              # 年齢確認ページ
├── opening.html            # オープニングページ
├── main.html               # メインギャラリーページ
├── css/
│   ├── reset.css          # CSSリセット
│   ├── variables.css      # CSS変数（カラーパレット等）
│   ├── common.css         # 共通スタイル
│   ├── age-verification.css  # 年齢確認ページ専用
│   ├── opening.css        # オープニングページ専用
│   └── main.css           # メインページ専用
├── js/
│   ├── age-verification.js   # 年齢確認ロジック
│   ├── opening.js         # スライドショーロジック
│   └── main.js            # ギャラリーロジック
├── assets/
│   ├── images/
│   │   ├── age-verification/
│   │   │   └── background.jpg  # 年齢確認背景（動画の代替）
│   │   ├── opening/
│   │   │   ├── slide-01.png
│   │   │   ├── slide-02.png
│   │   │   ├── slide-03.png
│   │   │   └── ...
│   │   └── gallery/
│   │       ├── thumb-01.jpg
│   │       ├── thumb-02.jpg
│   │       └── ...
│   └── videos/             # (後フェーズ用)
├── reference/              # 参考資料
│   ├── requirements.txt
│   ├── reference-site-sitemap.md
│   └── reference-site-sitemap.json
├── HP素材集/                # 既存アセット
└── README.md
```

---

## 📝 実装フェーズ

### Phase 1: プロジェクトセットアップ（1日目）
**タスク:**
- [x] ディレクトリ構造の作成
- [ ] HTMLテンプレートの作成（3ページ）
- [ ] CSSリセット・変数ファイルの作成
- [ ] 基本的な共通スタイルの定義

**成果物:**
- 空のHTMLファイル（構造のみ）
- CSS変数定義（カラーパレット、フォント）

---

### Phase 2: 年齢確認ページ（2日目）
**タスク:**
- [ ] HTML構造の実装
  - 背景レイヤー（<div>で画像表示）
  - オーバーレイレイヤー
  - タイトル・説明文・ボタン
- [ ] CSS実装
  - フルスクリーン背景
  - センタリングレイアウト
  - ボタンスタイル（ホバーエフェクト）
- [ ] JavaScript実装
  - 「18歳以上」クリック → opening.htmlへ遷移
  - 「18歳未満」クリック → 警告アラート表示
  - フェードアウトアニメーション

**成果物:**
- 完全に動作する年齢確認ページ

**検証項目:**
- [ ] ボタンが正しく動作するか
- [ ] ページ遷移が正常に機能するか
- [ ] レスポンシブ表示が正しいか

---

### Phase 3: オープニングページ（3-4日目）
**タスク:**
- [ ] HTML構造の実装
  - スライドショーコンテナ
  - 画像要素（3-5枚）
  - スキップボタン
  - プログレスバー（オプション）
- [ ] CSS実装
  - フルスクリーン画像表示
  - フェードイン/アウトアニメーション
  - スキップボタン配置（右上）
  - プログレスバー（下部）
- [ ] JavaScript実装
  - スライドショーロジック（2秒間隔）
  - フェード切り替えアニメーション
  - スキップボタン機能
  - 完了後の自動遷移（main.html）

**成果物:**
- 動作するスライドショーページ

**検証項目:**
- [ ] 画像が順番に切り替わるか
- [ ] スキップボタンが機能するか
- [ ] 完了後にmain.htmlへ遷移するか
- [ ] アニメーションが滑らかか

---

### Phase 4: メインページ（5-6日目）
**タスク:**
- [ ] HTML構造の実装
  - ヘッダー（タイトル/ロゴ）
  - ギャラリーコンテナ（Flexbox）
  - 画像カード（6-8枚）
- [ ] CSS実装
  - Flexboxレイアウト（flex-wrap: wrap）
  - 画像カードスタイル
  - ホバーエフェクト（拡大、グロー）
  - レスポンシブ対応（3列→2列→1列）
- [ ] JavaScript実装（最小限）
  - 画像クリック時のアクション（後フェーズで拡張）

**成果物:**
- 動作するギャラリーページ

**検証項目:**
- [ ] ギャラリーが正しくレイアウトされているか
- [ ] ホバーエフェクトが動作するか
- [ ] レスポンシブ表示が正しいか（デスクトップ/タブレット/スマホ）

---

### Phase 5: 統合テスト・調整（7日目）
**タスク:**
- [ ] 全ページのフロー確認
- [ ] ページ遷移のテスト
- [ ] レスポンシブテスト（各デバイス）
- [ ] ブラウザ互換性テスト（Chrome, Firefox, Safari, Edge）
- [ ] パフォーマンステスト（読み込み速度）
- [ ] バグ修正

**検証項目:**
- [ ] index.html → opening.html → main.html のフローが正常
- [ ] 全デバイスで表示が崩れていないか
- [ ] アニメーションが滑らかか
- [ ] 読み込み速度が3秒以内か

---

## 🎨 デザイン実装の詳細

### カラーパレット（CSS変数）
```css
:root {
  --primary-color: #8B00FF;      /* 紫 */
  --secondary-color: #FF1493;    /* ピンク */
  --bg-dark: #1a1a1a;            /* ダークグレー */
  --text-white: #ffffff;         /* ホワイト */
  --overlay-dark: rgba(0, 0, 0, 0.7); /* 半透明黒 */

  --transition-speed: 0.3s;
  --hover-scale: 1.05;
}
```

### フォント設定
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');

body {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: clamp(14px, 2vw, 16px);
}
```

---

## 🚀 技術実装のポイント

### 年齢確認ページ
```html
<!-- index.html 構造 -->
<div class="age-verification">
  <div class="background"></div>
  <div class="overlay">
    <h1>年齢確認</h1>
    <p>このサイトは18歳以上の方を対象としています</p>
    <div class="buttons">
      <button id="btn-over18">18歳以上</button>
      <button id="btn-under18">18歳未満</button>
    </div>
  </div>
</div>
```

### オープニングページ
```javascript
// opening.js - スライドショーロジック（簡易版）
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showNextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');

  if (currentSlide === slides.length - 1) {
    setTimeout(() => {
      window.location.href = 'main.html';
    }, 2000);
  }
}

setInterval(showNextSlide, 2000);
```

### メインページ
```css
/* main.css - Flexboxギャラリー */
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.gallery-item {
  flex: 1 1 calc(33.333% - 20px);
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .gallery-item {
    flex: 1 1 calc(50% - 20px);
  }
}

@media (max-width: 480px) {
  .gallery-item {
    flex: 1 1 100%;
  }
}
```

---

## 📊 テストチェックリスト

### 機能テスト
- [ ] 年齢確認ボタンが正しく動作する
- [ ] ページ遷移が正常に行われる
- [ ] スライドショーが自動で進む
- [ ] スキップボタンが機能する
- [ ] ギャラリー画像が正しく表示される

### レスポンシブテスト
- [ ] デスクトップ（1920x1080）
- [ ] デスクトップ（1366x768）
- [ ] タブレット（768x1024）
- [ ] スマートフォン（375x667）
- [ ] スマートフォン（360x640）

### ブラウザテスト
- [ ] Google Chrome（最新版）
- [ ] Firefox（最新版）
- [ ] Safari（最新版）
- [ ] Microsoft Edge（最新版）

---

## 🔄 今後の拡張予定（Post-MVP）

### Phase 6: 高度なアニメーション
- AI生成動画の統合（年齢確認ページ）
- イントロ動画の追加（オープニングページ）
- ホワイトフラッシュエフェクト
- Intersection Observer によるスクロールアニメーション

### Phase 7: UX向上
- 詳細なプログレスバー
- オーバーレイ情報の追加
- 画像モーダル表示機能
- ローディングアニメーション

### Phase 8: パフォーマンス最適化
- 画像の遅延読み込み（Lazy Loading）
- WebP形式への変換
- CSS/JSの最小化
- キャッシュ戦略の実装

---

## 📁 ファイルパス一覧

### HTMLファイル
- `/index.html` - 年齢確認ページ
- `/opening.html` - オープニングページ
- `/main.html` - メインギャラリーページ

### CSSファイル
- `/css/reset.css` - CSSリセット
- `/css/variables.css` - CSS変数定義
- `/css/common.css` - 共通スタイル
- `/css/age-verification.css` - 年齢確認ページスタイル
- `/css/opening.css` - オープニングページスタイル
- `/css/main.css` - メインページスタイル

### JavaScriptファイル
- `/js/age-verification.js` - 年齢確認ロジック
- `/js/opening.js` - スライドショーロジック
- `/js/main.js` - ギャラリーロジック

### アセットファイル
- `/assets/images/age-verification/background.jpg`
- `/assets/images/opening/slide-01.png` ~ `slide-05.png`
- `/assets/images/gallery/thumb-01.jpg` ~ `thumb-08.jpg`

### 参考資料
- `/reference/requirements.txt` - 要件定義書
- `/reference/implementation-plan.md` - 実装計画書（このファイル）
- `/reference/reference-site-sitemap.md` - 参考サイトのサイトマップ
- `/reference/reference-site-sitemap.json` - 参考サイトのサイトマップ（JSON）

---

## 🎯 成功基準

### MVP完成の定義
1. ✅ 3ページすべてが動作している
2. ✅ ページ間の遷移が正常に機能している
3. ✅ 基本的なアニメーションが実装されている
4. ✅ レスポンシブ対応が完了している
5. ✅ 主要ブラウザで動作確認が取れている
6. ✅ 読み込み速度が3秒以内

### 品質基準
- コードの可読性（適切なコメント）
- 再利用可能なコンポーネント設計
- パフォーマンス（60fps維持）
- アクセシビリティ（基本的なセマンティックHTML）
