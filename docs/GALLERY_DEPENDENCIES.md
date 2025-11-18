# gallery.html 依存関係調査レポート

**調査日:** 2025-11-15
**ファイルパス:** `/Users/furuyaatsushi/Documents/Karin_gamesite/gallery.html`

---

## 📋 概要

gallery.htmlは、イベントイラストのギャラリーページで、モーダル表示機能を持つインタラクティブなページです。

---

## 🔗 直接的な依存ファイル

### 1. CSSファイル

#### ✅ `css/main.css` (15,072 bytes)
**役割:** サイト全体の共通スタイル
**重要なクラス:**
- `.page-container`
- `.site-header`
- `.brand`, `.brand__logo`
- `.hamburger`
- `.main-nav`
- `.site-footer`
- `.section-heading`
- `.eyebrow`

**状態:** ✅ 存在確認済み

#### ✅ `css/pages/gallery.css` (3,200 bytes)
**役割:** ギャラリーページ専用スタイル
**重要なクラス:**
- `.gallery-page` - ページ全体の背景とテキスト色
- `.library` - セクションコンテナ
- `.library__inner` - 内部コンテナ（max-width: 1200px）
- `.library-grid` - 3カラムグリッドレイアウト
- `.library-card` - カード要素
- `.library-card__label` - カードラベル
- `.library-modal` - モーダルコンテナ
- `.library-modal__scrim` - モーダル背景オーバーレイ
- `.library-modal__shell` - モーダルシェル
- `.library-modal__panel` - モーダルパネル
- `.library-modal__figure` - モーダル画像
- `.library-modal__story` - ストーリーテキスト
- `.library-modal__close` - 閉じるボタン

**レスポンシブ:**
- `@media (max-width: 1023px)` - 2カラムグリッド
- `@media (max-width: 599px)` - モバイル最適化

**状態:** ✅ 存在確認済み

---

### 2. JavaScriptファイル

#### ✅ 外部ライブラリ: ScrollReveal
```html
<script src="https://unpkg.com/scrollreveal@4.0.9/dist/scrollreveal.min.js" defer></script>
```
**役割:** スクロールアニメーション効果
**状態:** ✅ CDNから読み込み

#### ✅ `js/main.js` (13,813 bytes)
**役割:** サイト全体のJavaScript + ギャラリーモーダル機能

**重要な機能:**
- `initLibraryModal()` - ライブラリモーダルの初期化
  - カードクリックでモーダル表示
  - `data-image` 属性から画像パスを取得
  - `data-story` 属性からストーリーテキストを取得
  - `data-label` 属性からラベルテキストを取得
  - パイプ（|）区切りのストーリーを段落に変換
  - モーダルクローズ機能
  - body要素に `.modal-open` クラス追加（スクロール防止）

**使用されるdata属性:**
- `[data-library-modal]` - モーダルコンテナ
- `[data-modal-image]` - モーダル内の画像要素
- `[data-modal-label]` - モーダル内のラベル要素
- `[data-modal-story]` - モーダル内のストーリー要素
- `[data-modal-close]` - 閉じるボタン

**状態:** ✅ 存在確認済み

---

### 3. 画像ファイル

#### ✅ ロゴ画像
- `images/logo/Logo.png` (3,495,251 bytes)

**状態:** ✅ 存在確認済み

#### ✅ ギャラリー画像（9ファイル）

| ファイル名 | サイズ | 状態 |
|-----------|--------|------|
| `images/gallery/scene_blowjob.jpg` | 473,092 bytes | ✅ |
| `images/gallery/scene_caning.jpg` | 764,706 bytes | ✅ |
| `images/gallery/scene_daily.jpg` | 788,796 bytes | ✅ |
| `images/gallery/scene_mary_onTop.jpg` | 500,340 bytes | ✅ |
| `images/gallery/scene_mary_smile.jpg` | 472,758 bytes | ✅ |
| `images/gallery/scene_orgy.jpg` | 851,073 bytes | ✅ |
| `images/gallery/scene_pear of anguish.jpg` | 638,663 bytes | ✅ |
| `images/gallery/scene_sex_Elaine.jpg` | 536,709 bytes | ✅ |
| `images/gallery/scene_tits.jpg` | 512,952 bytes | ✅ |

**合計サイズ:** 約5.4MB

**状態:** ✅ すべて存在確認済み

---

### 4. リンク先HTMLファイル

#### ナビゲーションリンク:
- `index.html` - トップページ（ロゴクリック時）
- `main.html#story` - ストーリーセクション
- `main.html#character` - キャラクターセクション
- `gallery.html` - ギャラリーページ（現在のページ）
- `main.html#news` - ニュースセクション
- `special.html` - スペシャルページ
- `download.html` - ダウンロードページ
- `spec.html` - スペックページ

**状態確認が必要:**
- ❓ `special.html`
- ❓ `download.html`
- ❓ `spec.html`

---

## 📐 ファイルパス構造

```
/Users/furuyaatsushi/Documents/Karin_gamesite/
├── gallery.html                    ← メインファイル
├── index.html
├── main.html
├── css/
│   ├── main.css                    ← 共通CSS
│   └── pages/
│       └── gallery.css             ← ギャラリー専用CSS
├── js/
│   └── main.js                     ← メインJavaScript
├── images/
│   ├── logo/
│   │   └── Logo.png                ← ロゴ画像
│   └── gallery/
│       ├── scene_blowjob.jpg       ← ギャラリー画像 1
│       ├── scene_caning.jpg        ← ギャラリー画像 2
│       ├── scene_daily.jpg         ← ギャラリー画像 3
│       ├── scene_mary_onTop.jpg    ← ギャラリー画像 4
│       ├── scene_mary_smile.jpg    ← ギャラリー画像 5
│       ├── scene_orgy.jpg          ← ギャラリー画像 6
│       ├── scene_pear of anguish.jpg ← ギャラリー画像 7
│       ├── scene_sex_Elaine.jpg    ← ギャラリー画像 8
│       └── scene_tits.jpg          ← ギャラリー画像 9
├── special.html (未確認)
├── download.html (未確認)
└── spec.html (未確認)
```

---

## ⚙️ 機能的な依存関係

### モーダル機能の動作フロー

1. **カードクリック時:**
   ```javascript
   // js/main.js の initLibraryModal() 内
   card.addEventListener('click', () => {
     const imageSrc = card.dataset.image;      // data-image 属性
     const storyText = card.dataset.story;     // data-story 属性
     const labelText = card.dataset.label;     // data-label 属性

     // モーダルに情報を設定
     modalImage.src = imageSrc;
     modalLabel.textContent = labelText;
     // ストーリーをパイプ（|）で分割して段落に変換
     renderStory(storyText);

     // モーダル表示
     modal.classList.add('is-open');
     body.classList.add('modal-open');
   });
   ```

2. **モーダルクローズ時:**
   ```javascript
   closeBtn.addEventListener('click', () => {
     modal.classList.remove('is-open');
     body.classList.remove('modal-open');
   });
   ```

3. **CSSアニメーション:**
   - `.library-modal.is-open` でモーダル表示
   - `.library-card:hover` でカードホバー効果
   - backdrop-filter でぼかし効果

---

## 🚨 潜在的な問題点

### 1. ファイル名にスペースが含まれる画像
```
images/gallery/scene_pear of anguish.jpg
```
**リスク:**
- URLエンコーディングの問題が発生する可能性
- 一部のサーバーやブラウザで読み込みエラーの可能性

**対策:**
- ファイル名を `scene_pear_of_anguish.jpg` に変更
- または、HTMLで適切にエンコード

### 2. 追加HTMLファイルの未確認
```
special.html
download.html
spec.html
```
**リスク:**
- これらのファイルが存在しない場合、404エラー

**対策:**
- ファイルの存在確認が必要

### 3. 外部CDNへの依存
```html
<script src="https://unpkg.com/scrollreveal@4.0.9/dist/scrollreveal.min.js">
```
**リスク:**
- ネットワーク接続がない場合に動作しない
- unpkg.comがダウンした場合に影響

**対策:**
- ローカルにコピーを保存することを推奨

---

## ✅ デプロイ前チェックリスト

### 必須ファイル
- [x] `gallery.html`
- [x] `css/main.css`
- [x] `css/pages/gallery.css`
- [x] `js/main.js`
- [x] `images/logo/Logo.png`
- [x] `images/gallery/` 内の全9画像

### 推奨確認事項
- [ ] `special.html` の存在確認
- [ ] `download.html` の存在確認
- [ ] `spec.html` の存在確認
- [ ] スペース含むファイル名の修正
- [ ] ScrollRevealのローカルコピー作成

### 動作確認
- [ ] ページが正しく表示されるか
- [ ] CSSが正しく適用されるか
- [ ] カードクリックでモーダルが開くか
- [ ] モーダル内に画像が表示されるか
- [ ] ストーリーテキストが正しく表示されるか
- [ ] 閉じるボタンが動作するか
- [ ] レスポンシブデザインが正しく動作するか

---

## 📊 依存関係グラフ

```
gallery.html
├── CSS
│   ├── css/main.css (共通スタイル)
│   └── css/pages/gallery.css (ギャラリー専用)
├── JavaScript
│   ├── https://unpkg.com/scrollreveal@4.0.9/dist/scrollreveal.min.js (外部)
│   └── js/main.js (モーダル機能)
├── 画像
│   ├── images/logo/Logo.png
│   └── images/gallery/*.jpg (9ファイル)
└── リンク
    ├── index.html
    ├── main.html
    ├── special.html (未確認)
    ├── download.html (未確認)
    └── spec.html (未確認)
```

---

## 🎯 推奨アクション

### 即座の対応
1. ✅ **すべての必須ファイルが存在することを確認** - 完了
2. ⚠️ **特典/ダウンロード/スペックHTMLの存在確認** - 未完了
3. ⚠️ **スペース含むファイル名の修正** - 未完了

### デプロイ前
1. ローカルでブラウザテスト
2. モーダル機能の動作確認
3. レスポンシブデザインの確認
4. 全画像の読み込み確認

### デプロイ後
1. GitHub Pagesでの動作確認
2. 各デバイスでの表示確認
3. ネットワーク速度による画像読み込みテスト

---

**調査完了日時:** 2025-11-15 11:00
**調査担当:** Claude Code
