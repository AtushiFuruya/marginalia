# 本番用サイトマップ - Karin Gamesite

## 📋 プロジェクト情報

- **プロジェクト名**: Karin Gamesite（エロゲサイト）
- **参考サイト**: 真愛の百合は赤く染まる
- **目的**: 18禁ゲーム紹介サイトの構築
- **技術**: HTML5, CSS3, Vanilla JavaScript

---

## 🗺️ サイト構造（ディレクトリ階層）

```
/
├── index.html                    # 年齢確認＋オープニング（エントリーポイント）
├── main.html                     # メインページ（トップ）
│
├── pages/                        # サブページ
│   ├── story.html               # ストーリー紹介
│   ├── characters.html          # キャラクター紹介
│   ├── gallery.html             # ギャラリー
│   ├── special.html             # 特典情報
│   ├── download.html            # ダウンロード
│   ├── spec.html                # 製品スペック
│   └── news.html                # ニュース/お知らせ
│
├── css/                          # スタイルシート
│   ├── reset.css                # CSSリセット
│   ├── variables.css            # CSS変数（カラーパレット等）
│   ├── common.css               # 共通スタイル
│   ├── age-verification.css     # 年齢確認ページ
│   ├── opening.css              # index内オープニング演出
│   ├── main.css                 # メインページ
│   └── pages/                   # ページ別スタイル
│       ├── story.css
│       ├── characters.css
│       ├── gallery.css
│       ├── special.css
│       ├── download.css
│       └── spec.css
│
├── js/                           # JavaScript
│   ├── age-verification.js      # 年齢確認＋オープニング
│   ├── main.js                  # メインページロジック
│   ├── navigation.js            # グローバルナビゲーション
│   ├── modal.js                 # モーダルウィンドウ
│   └── pages/                   # ページ別スクリプト
│       ├── gallery.js           # ギャラリー機能
│       └── characters.js        # キャラクター切り替え
│
├── assets/                       # アセット
│   ├── images/                  # 画像
│   │   ├── age-verification/    # 年齢確認用
│   │   │   └── background.jpg
│   │   ├── opening/             # （将来）追加演出用
│   │   ├── common/              # 共通画像
│   │   │   ├── logo.png
│   │   │   ├── loading.gif
│   │   │   └── favicon.ico
│   │   ├── gallery/             # ギャラリー画像
│   │   │   ├── thumb-01.jpg
│   │   │   ├── thumb-02.jpg
│   │   │   └── ...
│   │   ├── characters/          # キャラクター画像
│   │   │   ├── character-01.png
│   │   │   ├── character-02.png
│   │   │   └── ...
│   │   └── banners/             # バナー・特典画像
│   │       ├── masterup.jpg
│   │       └── tokuten.jpg
│   │
│   ├── videos/                   # 動画（後フェーズ）
│   │   ├── intro.mp4
│   │   └── door-animation.mp4
│   │
│   └── fonts/                    # Webフォント（必要に応じて）
│
├── lib/                          # 外部ライブラリ
│   └── (jQuery等、CDN使用推奨)
│
└── reference/                    # 参考資料（本番環境では除外）
    ├── requirements.md
    ├── implementation-plan.md
    └── ...
```

---

## 📄 ページ一覧と説明

### 1. ルートレベル（必須ページ）

#### 1.1 index.html - 年齢確認＋オープニング
- **役割**: サイトのエントリーポイント。18歳以上確認後、そのままフルスクリーンスライドを再生し `main.html` へ遷移。
- **機能**:
  - 年齢確認ダイアログ（Enter/Exit）
  - 背景ムービー／静止画切替
  - 5枚のスライドショー（モバイル/タブレット対応、スキップボタン、プログレスバー）
- **必要リソース**:
  - CSS: `css/age-verification.css`, `css/opening.css`
  - JS: `js/age-verification.js`
  - 画像/動画: `assets/images/age-verification/background.jpg`, `assets/videos/intro.mp4`, `images/gallery/*.jpg`

#### 1.2 main.html - メインページ（トップ）
- **役割**: サイトのハブ、ナビゲーション起点
- **コンテンツ**:
  - ヘッダー（ロゴ、タイトル）
  - グローバルナビゲーション（下記セクションへのリンク）
  - ギャラリープレビュー
  - 最新情報
  - 外部購入リンク
- **必要リソース**:
  - CSS: `css/main.css`
  - JS: `js/main.js`, `js/navigation.js`
  - 画像: `assets/images/common/logo.png`

---

### 2. サブページ（pages/ ディレクトリ）

#### 2.1 pages/story.html - ストーリー紹介
- **コンテンツ**:
  - ゲームのあらすじ
  - 世界観説明
  - キーワード（ルビ付き）
- **デザイン**: テキスト中心、雰囲気のある背景

#### 2.2 pages/characters.html - キャラクター紹介
- **コンテンツ**:
  - キャラクター一覧（4名）
  - キャラクター選択UI
  - 各キャラの説明文、立ち絵、CV情報
- **機能**:
  - タブ切り替え
  - ボイスサンプル再生（オプション）
- **必要リソース**:
  - JS: `js/pages/characters.js`
  - 画像: `assets/images/characters/`

#### 2.3 pages/gallery.html - ギャラリー
- **コンテンツ**:
  - CG画像サムネイル（6-8枚）
  - モーダルで拡大表示
- **機能**:
  - Lightbox/Colorbox風のモーダル
  - 画像スライド
- **必要リソース**:
  - JS: `js/pages/gallery.js`, `js/modal.js`
  - 画像: `assets/images/gallery/`

#### 2.4 pages/special.html - 特典情報
- **コンテンツ**:
  - 購入特典（タペストリー等）
  - 店舗別特典情報
  - 購入リンク（外部ショップ）
- **必要リソース**:
  - 画像: `assets/images/banners/tokuten.jpg`

#### 2.5 pages/download.html - ダウンロード
- **コンテンツ**:
  - 体験版ダウンロード
  - 壁紙ダウンロード（オプション）
  - システム要件
- **機能**:
  - ダウンロードボタン
  - ファイルサイズ表示

#### 2.6 pages/spec.html - 製品スペック
- **コンテンツ**:
  - タイトル、発売日、価格
  - 対応OS、動作環境
  - ジャンル、プレイ時間
  - スタッフ情報（原画、シナリオ、CV）
- **デザイン**: 定義リスト（dl/dt/dd）

#### 2.7 pages/news.html - ニュース/お知らせ
- **コンテンツ**:
  - 更新履歴
  - 発売日、マスターアップ情報
  - イベント告知
- **デザイン**: タイムライン形式

---

## 🧭 ナビゲーション構造

### グローバルナビゲーション（全ページ共通）

```
┌─────────────────────────────────────────────┐
│  [ロゴ] ゲームタイトル                         │
├─────────────────────────────────────────────┤
│  Home | Story | Characters | Gallery |      │
│  Special | Download | Spec | News           │
└─────────────────────────────────────────────┘
```

**リンク先**:
- **Home**: `main.html` または `#` （単一ページ版の場合）
- **Story**: `pages/story.html` または `#story`
- **Characters**: `pages/characters.html` または `#characters`
- **Gallery**: `pages/gallery.html` または `#gallery`
- **Special**: `pages/special.html` または `#special`
- **Download**: `pages/download.html` または `#download`
- **Spec**: `pages/spec.html` または `#spec`
- **News**: `pages/news.html` または `#news`

### 実装方式の選択

#### パターンA: マルチページ方式（推奨）
- 各セクションが独立したHTMLファイル
- SEOに有利
- ページ遷移がシンプル
- 初期読み込みが軽い

#### パターンB: シングルページアプリケーション（SPA）
- 全コンテンツを `main.html` に集約
- セクション切り替えはJavaScriptで制御
- スムーズなアニメーション
- 初期読み込みは重い

**MVP版ではパターンAを推奨**

---

## 🔄 ユーザーフロー

```
[ブラウザでアクセス]
         ↓
┌──────────────────┐
│  index.html      │  年齢確認 + オープニング
│  (Entry)          │  ・YES/NOボタン
│                  │  ・背景動画/静止画
│                  │  ・スライドショー(5枚)
│                  │  ・スキップボタン
└────────┬─────────┘
         │ YES/自動遷移
         ↓
┌──────────────────┐
│  main.html       │  メインページ
│  (トップ)         │  ・ナビゲーション
└────────┬─────────┘  ・コンテンツプレビュー
         │
         ├─→ pages/story.html        (ストーリー)
         ├─→ pages/characters.html   (キャラクター)
         ├─→ pages/gallery.html      (ギャラリー)
         ├─→ pages/special.html      (特典)
         ├─→ pages/download.html     (ダウンロード)
         ├─→ pages/spec.html         (スペック)
         └─→ pages/news.html         (ニュース)
```

---

## 📊 参考サイト vs 本番サイト 対応表

| 参考サイトの要素 | 本番サイトでの実装 | ファイルパス |
|---------------|------------------|------------|
| モーダル年齢確認+演出 | `index.html` 内に集約 | `index.html` |
| 単一ページ（SPA） | マルチページ構成 | `main.html` + `pages/*.html` |
| #win0 (Home) | メインページ | `main.html` |
| #win2 (Story) | ストーリーページ | `pages/story.html` |
| #win3 (Character) | キャラクターページ | `pages/characters.html` |
| #win4 (Gallery) | ギャラリーページ | `pages/gallery.html` |
| #win5 (Special) | 特典ページ | `pages/special.html` |
| #win6 (Spec) | スペックページ | `pages/spec.html` |
| #win7 (Download) | ダウンロードページ | `pages/download.html` |
| Topics（お知らせ） | ニュースページ | `pages/news.html` |

---

## 🎨 デザインシステム

### カラーパレット
```css
:root {
  --primary-color: #8B00FF;      /* メインカラー（紫） */
  --secondary-color: #FF1493;    /* アクセント（ピンク） */
  --bg-dark: #1a1a1a;            /* 背景（ダーク） */
  --text-white: #ffffff;         /* テキスト（白） */
  --overlay-dark: rgba(0, 0, 0, 0.7); /* オーバーレイ */
}
```

### タイポグラフィ
- **日本語**: Noto Sans JP（Google Fonts）
- **英語**: Roboto または Open Sans
- **サイズ**: `clamp()` でレスポンシブ

### コンポーネント
- **ボタン**: ホバー時拡大 + グロー効果
- **カード**: ギャラリー画像、キャラクター
- **モーダル**: 画像拡大表示
- **ローディング**: スピナー or GIF

---

## 📱 レスポンシブ対応

### ブレークポイント
```css
/* デスクトップ: 1024px以上 */
@media (min-width: 1024px) {
  .gallery { grid-template-columns: repeat(3, 1fr); }
}

/* タブレット: 768px - 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  .gallery { grid-template-columns: repeat(2, 1fr); }
}

/* スマートフォン: 767px以下 */
@media (max-width: 767px) {
  .gallery { grid-template-columns: 1fr; }
  .navigation { flex-direction: column; }
}
```

---

## 🔗 外部リンク

### 購入サイト
- ソフマップ
- メロンブックス
- げっちゅ屋
- トレーダー
- Amazon

### SNS・公式
- Twitter: `@info_bugsystem`
- 公式サイト: `clearrave.co.jp`

---

## ⚙️ 技術仕様

### 必須ライブラリ（最小構成）
- **なし**（Vanilla JavaScriptで実装）

### 推奨ライブラリ（機能拡張時）
- jQuery 3.x（DOM操作）
- Colorbox（画像モーダル）
- AOS（スクロールアニメーション）

### パフォーマンス目標
- **初回表示**: 3秒以内
- **ページ遷移**: 1秒以内
- **画像最適化**: 500KB以下/枚
- **アニメーション**: 60fps維持

---

## 📝 実装優先順位

### Phase 1: Walking Skeleton（Week 1）
1. `index.html` - 年齢確認＋オープニング
2. `main.html` - 基本レイアウト

### Phase 2: コア機能（Week 2）
4. `pages/gallery.html` - ギャラリー
5. `pages/characters.html` - キャラクター
6. グローバルナビゲーション

### Phase 3: コンテンツ充実（Week 3）
7. `pages/story.html`
8. `pages/special.html`
9. `pages/spec.html`

### Phase 4: 補完機能（Week 4）
10. `pages/download.html`
11. `pages/news.html`
12. パフォーマンス最適化

---

## 🎯 成功基準

### 必須項目（Must Have）
- [ ] 年齢確認が正しく機能する
- [ ] オープニングが自動再生される
- [ ] 全ページにアクセスできる
- [ ] ギャラリー画像が表示される
- [ ] レスポンシブ対応している

### 推奨項目（Should Have）
- [ ] スムーズなアニメーション
- [ ] モーダル画像拡大
- [ ] ローディング画面
- [ ] SEOメタタグ

### オプション項目（Nice to Have）
- [ ] ボイスサンプル再生
- [ ] 動画背景（年齢確認）
- [ ] パララックス効果
- [ ] SNSシェアボタン

---

## 📂 ファイル管理

### Git管理対象
- すべての `.html`, `.css`, `.js` ファイル
- `assets/images/` （最終版のみ）
- ドキュメント（`reference/`）

### Git管理外（.gitignore）
- `node_modules/`
- `venv/`
- `.DS_Store`
- `.memory-config.json`
- 作業中の大容量ファイル

---

## 🔄 次のステップ

このサイトマップを基に、以下を実行してください：

1. **Issue分割**: 各ページを個別タスクに分解
2. **アセット準備**: `HP素材集/` から画像を選定・配置
3. **HTML実装**: Walking Skeletonから順次構築
4. **CSS実装**: `variables.css` から始める
5. **JS実装**: 各ページの機能を追加
6. **テスト**: 全ページ・全デバイスで動作確認

---

**このサイトマップは、あなたのプロジェクトの完全な設計図です。**
**実装時はこのドキュメントを常に参照してください。** 📘
