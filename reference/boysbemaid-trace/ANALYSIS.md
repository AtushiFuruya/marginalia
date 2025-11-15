# Boys be MAID - Aimery Cénoir Character Page Analysis

**ソースURL**: https://boysbemaid.jp/member/aimerycenoir/
**解析日時**: 2025-11-13
**プロジェクト**: Karin_gamesite

---

## 1. ページ構造概要

### 基本情報
- **タイトル**: Aimery Cénoir｜BOYS be MAID!〜御曹司メイドボーイ部の日日〜
- **キャラクター名**: エメリ・セノワール (Aimery Cénoir)
- **CV**: 小笠原 仁 (Ogasawara Jin)
- **プロジェクト**: BOYS be MAID!〜御曹司メイドボーイ部の日日〜

### HTMLドキュメント構造

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  - Meta charset: UTF-8
  - Viewport設定: width=device-width, initial-scale=1.0
  - Google Analytics: G-P2K717C13P
  - 外部CSS参照
  - プリフェッチ設定
</head>
<body>
  <header>
    - サイトロゴ
    - グローバルナビゲーション
  </header>

  <main>
    <article class="character-profile">
      - キャラクタービジュアル
      - プロフィール情報
      - 人物説明
      - 関係図
    </article>
  </main>

  <footer>
    - フッターナビゲーション
    - SNSリンク
    - 著作権表示
  </footer>
</body>
</html>
```

---

## 2. キャラクタープロフィール詳細

### 基本情報
- **名前**: エメリ・セノワール (Aimery Cénoir)
- **年齢**: 17歳
- **身長/体重**: 182cm / 63kg
- **誕生日**: 12月12日
- **学校**: 神生学園高等部 2年C組
- **寮**: 13号館 KING

### キャラクター説明
> 「紅茶（テ・ノワール）は歴史（イストワール）」
>
> セノワール王国からの留学生で、王族の血を引く次期国王候補。物腰の柔らかい外交的な性格だが、プライドの高さも垣間見える。現代の話題についても語れる博識さを持つ。

---

## 3. ナビゲーション構造

### グローバルナビゲーション
1. NEWS - ニュース
2. MEMBER - メンバー紹介
3. INTRODUCTION - 作品紹介
4. MOVIE - 動画
5. SPECIAL - スペシャル
6. NOVEL - ノベル
7. GOODS - グッズ

### フッターナビゲーション
- NEWS, MEMBER, INTRODUCTION, MOVIE, SPECIAL, NOVEL, GOODS (重複)
- Guidelines - ガイドライン
- Contact - お問い合わせ

### SNSリンク
- Twitter/X: https://twitter.com/boysbemaid
- TikTok: https://www.tiktok.com/@boysbemaid
- YouTube: https://www.youtube.com/@boysbemaid

### 外部リンク
- グッズ販売: https://the-chara.com/c/1059

---

## 4. アセット構造

### 画像ディレクトリ
**ベースURL**: https://boysbemaid.jp/

#### キャラクター画像
- `/member/single/aimery/` - エメリ専用ディレクトリ
  - キャラクタービジュアル (WebP形式)
  - プロフィール写真
  - 関係図画像

#### 共通アセット
- `/wp-content/themes/boysbemaid/images/` - テーマ画像
- ロゴ画像
- アイコン類

### 画像フォーマット
- **メイン形式**: WebP (最適化済み)
- **フォールバック**: JPEG/PNG

---

## 5. CSSスタイル構造

### 外部スタイルシート
```html
<link rel="stylesheet" href="/wp-content/themes/boysbemaid/css/main.css">
<link rel="stylesheet" href="/wp-content/themes/boysbemaid/css/page-single.css">
```

### CSS設計パターン
- **命名規則**: BEM (Block Element Modifier)推測
- **レスポンシブ**: モバイルファーストアプローチ
- **アニメーション**: CSS Transitions + Keyframes

### 推測される主要CSSセレクタ
```css
/* ヘッダー */
.site-header { ... }
.global-nav { ... }

/* キャラクタープロフィール */
.character-profile { ... }
.character-visual { ... }
.character-info { ... }

/* プロフィール項目 */
.profile-item { ... }
.profile-label { ... }
.profile-value { ... }

/* 関係図 */
.relationship-diagram { ... }

/* フッター */
.site-footer { ... }
.footer-nav { ... }
.social-links { ... }
```

---

## 6. JavaScript機能

### 推測される機能
1. **Google Analytics トラッキング**
   - ID: G-P2K717C13P
   - ページビュー計測
   - イベントトラッキング

2. **ナビゲーション**
   - ハンバーガーメニュー (モバイル)
   - スムーススクロール

3. **画像ローディング**
   - Lazy loading実装
   - WebP対応判定

4. **アニメーション**
   - スクロールトリガーアニメーション
   - フェードイン効果

### 外部スクリプト
```html
<script src="/wp-content/themes/boysbemaid/js/main.js"></script>
```

---

## 7. アニメーション定義

### 推測されるアニメーション

#### フェードイン
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

.character-visual {
  animation: fadeIn 0.6s ease-out;
}
```

#### ホバーエフェクト
```css
.nav-link {
  transition: color 0.3s ease, background-color 0.3s ease;
}

.nav-link:hover {
  color: #color-accent;
  background-color: rgba(0, 0, 0, 0.05);
}
```

#### スクロールアニメーション
```css
.profile-item {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.profile-item.visible {
  opacity: 1;
  transform: translateX(0);
}
```

---

## 8. レスポンシブデザイン

### ブレークポイント (推測)
```css
/* スマートフォン */
@media (max-width: 767px) {
  .global-nav {
    display: none; /* ハンバーガーメニューに */
  }
}

/* タブレット */
@media (min-width: 768px) and (max-width: 1023px) {
  .character-visual {
    max-width: 80%;
  }
}

/* デスクトップ */
@media (min-width: 1024px) {
  .character-profile {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

---

## 9. SEO・メタ情報

### メタタグ
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="エメリ・セノワールのキャラクタープロフィール">
<title>Aimery Cénoir｜BOYS be MAID!</title>
```

### OGP設定 (推測)
```html
<meta property="og:title" content="Aimery Cénoir｜BOYS be MAID!">
<meta property="og:type" content="website">
<meta property="og:url" content="https://boysbemaid.jp/member/aimerycenoir/">
<meta property="og:image" content="https://boysbemaid.jp/member/single/aimery/og-image.jpg">
```

---

## 10. 技術スタック

### フロントエンド
- **HTML5**: セマンティックマークアップ
- **CSS3**: カスタムプロパティ、Grid、Flexbox
- **JavaScript (ES6+)**: モダン構文
- **画像最適化**: WebP形式

### CMS
- **WordPress**: テーマベース実装
- **テーマディレクトリ**: `/wp-content/themes/boysbemaid/`

### パフォーマンス最適化
- Prefetch/Preload設定
- Lazy loading
- 画像圧縮 (WebP)
- Google Analytics非同期読み込み

---

## 11. カラーパレット (推測)

### プライマリカラー
- **メインカラー**: Boys be MAID ブランドカラー (紫系)
- **アクセントカラー**: ゴールド/ベージュ
- **テキストカラー**: ダークグレー/ブラック
- **背景カラー**: ホワイト/ライトベージュ

### CSS変数形式 (推測)
```css
:root {
  --color-primary: #6B4FA3; /* 紫 */
  --color-accent: #D4AF37; /* ゴールド */
  --color-text: #333333;
  --color-bg: #FFFFFF;
  --color-bg-alt: #F5F5F0;
}
```

---

## 12. フォント構成

### 日本語フォント
```css
font-family: "Noto Sans JP", "Hiragino Kaku Gothic ProN", "メイリオ", sans-serif;
```

### 英数字フォント
```css
font-family: "Montserrat", "Arial", sans-serif;
```

---

## 13. 実装推奨事項

### Karin_gamesiteプロジェクトへの適用

#### 採用すべき要素
1. **レイアウト構造**
   - グリッドベースのキャラクタープロフィール
   - レスポンシブナビゲーション
   - フッター構造

2. **アニメーション**
   - フェードインエフェクト
   - スクロールトリガーアニメーション
   - ホバー効果

3. **アセット管理**
   - WebP画像形式
   - ディレクトリ構造 (`/member/single/[character-name]/`)

4. **スタイリング**
   - CSS変数活用
   - BEM命名規則
   - モバイルファーストアプローチ

#### カスタマイズポイント
1. **カラースキーム**: Boys be MAIDの紫系 → Karinの深紅/ゴールド系
2. **フォント**: 既存のNoto Serif JP維持
3. **アニメーション速度**: プロジェクトの雰囲気に合わせて調整

---

## 14. ファイル構造提案

### Karin_gamesiteへの統合

```
/Karin_gamesite/
├── characters/
│   ├── irene.html
│   ├── marie.html
│   └── crista.html
├── css/
│   ├── main.css
│   └── character-profile.css  ← 新規作成
├── js/
│   ├── main.js
│   └── character-animations.js  ← 新規作成
├── images/
│   └── characters/
│       ├── irene/
│       ├── marie/
│       └── crista/
└── reference/
    └── boysbemaid-trace/
        └── ANALYSIS.md  ← このファイル
```

---

## 15. 次のステップ

### 実装フェーズ
1. **HTML テンプレート作成**
   - キャラクタープロフィールページのベース
   - 既存のmain.htmlとの統合

2. **CSS スタイリング**
   - `character-profile.css` 作成
   - Boys be MAIDのレイアウトをKarinスタイルに適用

3. **JavaScript 実装**
   - スクロールアニメーション
   - レスポンシブナビゲーション

4. **画像最適化**
   - WebP変換
   - 適切なディレクトリ配置

5. **テスト**
   - レスポンシブ確認
   - アニメーション動作確認
   - パフォーマンステスト

---

## 16. 参考リンク

- **オリジナルサイト**: https://boysbemaid.jp/member/aimerycenoir/
- **公式Twitter**: https://twitter.com/boysbemaid
- **グッズ販売**: https://the-chara.com/c/1059

---

**解析完了日時**: 2025-11-13
**解析者**: Claude Code
**プロジェクト**: Karin_gamesite UI Enhancement
