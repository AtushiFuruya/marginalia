# Component Extractor

**グローバルコマンド名**: `component-extract`

動的にアニメーションしているWebサイトの特定部分（DOM/CSS/JS構造）を自動抽出し、自分のコーディングに適用可能な形式で保存するCLIツール。

---

## 🎯 目的

Webサイトの特定コンポーネント（アニメーション、レイアウト、インタラクション）を分析し、以下を自動抽出：

1. **HTML構造** - DOMサブツリー（階層、属性、内容）
2. **CSS適用ルール** - 実際にマッチしたスタイル（メディアクエリ含む）
3. **JavaScript使用範囲** - 関与したJSコードの最小集合
4. **イベントリスナ** - 登録されたイベントハンドラ情報

**手作業コピペ不要** - CDP（Chrome DevTools Protocol）による機械的抽出

---

## 🔧 技術スタック

- **Playwright** - アニメーション無効化、安定した自動操作
- **Puppeteer** - CDP接続、Coverage収集
- **CDP (Chrome DevTools Protocol)** - DOM/CSS/JSの詳細情報取得
  - `DOMSnapshot.captureSnapshot` - DOM一括取得
  - `CSS.getMatchedStylesForNode` - 適用CSSルール
  - `DOMDebugger.getEventListeners` - イベントリスナ
  - `Coverage API` - JS/CSS使用範囲（Istanbul形式）

---

## 📦 インストール

### ローカルインストール（プロジェクト内）

```bash
cd tools/component-extractor
npm install
```

### グローバルインストール（どこからでも使用可能）

```bash
cd tools/component-extractor
npm link
```

グローバルインストール後、どのディレクトリからでも `component-extract` コマンドが使用可能になります。

### グローバルアンインストール

```bash
npm unlink -g @global/component-extractor
```

---

## 🚀 使用方法

### 基本コマンド

```bash
component-extract --url <URL> --selector <CSSセレクタ> [オプション]
```

### 例1: Boys be maid の ScrollReveal コンポーネント抽出

```bash
component-extract \
  --url https://boysbemaid.jp/ \
  --selector ".member_slide.js-scrollreveal" \
  --output ./extracted-boysbemaid
```

### 例2: ヘッダーナビゲーション抽出（アニメーション無効化）

```bash
component-extract \
  --url https://example.com \
  --selector "#header-nav" \
  --disable-animations \
  --output ./extracted-header
```

### 例3: 設定ファイル使用

```bash
component-extract --config ./config/extract-config.json
```

**設定ファイル例** (`extract-config.json`):

```json
{
  "url": "https://boysbemaid.jp/",
  "selector": ".member_slide.js-scrollreveal",
  "outputDir": "./extracted-components",
  "headless": true,
  "coverage": true,
  "events": true,
  "screenshot": true,
  "waitTime": 2000
}
```

---

## ⚙️ オプション一覧

| オプション | 短縮形 | デフォルト | 説明 |
|----------|-------|----------|------|
| `--url` | `-u` | **必須** | ターゲットURL |
| `--selector` | `-s` | **必須** | CSSセレクタ（抽出対象要素） |
| `--output` | `-o` | `./extracted-components` | 出力ディレクトリ |
| `--config` | `-c` | - | 設定ファイルパス（JSON） |
| `--headless` | - | `true` | ヘッドレスモード（`false`でブラウザ表示） |
| `--disable-animations` | - | `false` | Playwrightアニメーション無効化 |
| `--coverage` | - | `true` | Coverage収集（JS/CSS使用範囲） |
| `--events` | - | `true` | イベントリスナ抽出 |
| `--screenshot` | - | `true` | スクリーンショット保存 |
| `--wait` | - | `2000` | ページ読み込み後の待機時間（ms） |

---

## 📁 出力ファイル構成

抽出実行後、以下のファイルが生成されます：

```
extracted-components/
└── <セレクタ名>_<タイムスタンプ>/
    ├── component.html       # 抽出されたHTML構造
    ├── styles.css           # 適用されたCSSルール
    ├── scripts.js           # 使用されたJavaScriptコード
    ├── metadata.json        # 抽出メタデータ（要素数、ルール数等）
    └── screenshot.png       # ページのスクリーンショット
```

### metadata.json の内容例

```json
{
  "extractedAt": "2025-11-09T07:30:00.000Z",
  "url": "https://boysbemaid.jp/",
  "selector": ".member_slide.js-scrollreveal",
  "dom": {
    "elementCount": 12
  },
  "css": {
    "ruleCount": 8
  },
  "js": {
    "fileCount": 3
  },
  "events": {
    "listenerCount": 2,
    "listeners": [
      {
        "type": "scroll",
        "useCapture": false,
        "passive": true
      },
      {
        "type": "click",
        "useCapture": false,
        "passive": false
      }
    ]
  }
}
```

---

## 🎬 実行フロー

1. **ブラウザ起動** - Puppeteer（ヘッドレス or GUI）
2. **CDPセッション接続** - Chrome DevTools Protocol
3. **Coverage開始** - JS/CSSの使用範囲記録開始
4. **ページアクセス** - 指定URLを開く
5. **要素待機** - `waitTime`後、セレクタの存在確認
6. **スクリーンショット取得** - フルページ
7. **DOMSnapshot取得** - `DOMSnapshot.captureSnapshot`
8. **CSS適用ルール取得** - `CSS.getMatchedStylesForNode`
9. **イベントリスナ取得** - `DOMDebugger.getEventListeners`
10. **Coverage停止** - 使用されたJS/CSS範囲を確定
11. **結果保存** - HTML/CSS/JS/メタデータをファイル出力
12. **ブラウザクローズ**

---

## 🔍 抽出詳細

### 1. DOMSnapshot

- **API**: `DOMSnapshot.captureSnapshot`
- **取得内容**:
  - ノード階層（親子関係）
  - 属性（class, id, data-*等）
  - 計算済みスタイル（width, height, display, position, opacity, transform, transition, animation）
  - レイアウト情報

### 2. CSS適用ルール

- **API**: `CSS.getMatchedStylesForNode`
- **取得内容**:
  - マッチしたCSSルール（セレクタ + プロパティ）
  - インラインスタイル
  - 継承されたスタイル
  - メディアクエリ（適用条件付き）

### 3. JavaScript Coverage

- **API**: `Coverage.startJSCoverage` / `Coverage.stopJSCoverage`
- **取得内容**:
  - 実際に実行されたJSコードの範囲（バイト単位）
  - 使用率（使用バイト / 総バイト）
  - ファイル別の使用状況

### 4. イベントリスナ

- **API**: `DOMDebugger.getEventListeners`
- **取得内容**:
  - イベントタイプ（click, scroll, resize等）
  - ハンドラ関数の所在
  - useCapture, passive等のオプション

---

## 💡 活用例

### ケース1: アニメーションライブラリの実装パターン抽出

```bash
component-extract \
  --url https://boysbemaid.jp/ \
  --selector ".js-scrollreveal" \
  --output ./analysis/scrollreveal
```

**出力**:
- ScrollReveal.jsの適用方法
- data-reveal属性の使用パターン
- アニメーションCSS（opacity, transform, transition）
- スクロールイベントリスナの登録方法

### ケース2: レスポンシブレイアウトの設計抽出

```bash
component-extract \
  --url https://example.com \
  --selector ".responsive-grid" \
  --output ./analysis/grid-layout
```

**出力**:
- CSS Grid / Flexbox設定
- メディアクエリのブレークポイント
- 計算済みのwidth, padding, margin値

### ケース3: インタラクティブUIの構造抽出

```bash
component-extract \
  --url https://example.com \
  --selector ".dropdown-menu" \
  --events \
  --output ./analysis/dropdown
```

**出力**:
- ドロップダウンのDOM構造
- ホバー/クリック時のCSSクラス変化
- イベントハンドラの種類と登録先

---

## 📊 出力データの活用方法

### 1. 構造・遷移・依存の抽象化

抽出結果を**そのままコピペせず**、以下の観点で自分の実装に反映：

- **構造** - HTML階層、クラス命名規則
- **遷移** - CSS状態変化（初期 → アニメーション中 → 完了）
- **依存** - 必要なJSライブラリ、イベント、タイミング

### 2. 設計ドキュメント作成

`metadata.json` + 抽出ファイルを基に：

- アニメーション仕様書
- レスポンシブ設計書
- インタラクション設計書

### 3. 自分のプロジェクトへの統合

```javascript
// 抽出結果から学んだパターンを自分の実装に適用

// 例: ScrollReveal風のアニメーション実装
const revealElements = document.querySelectorAll('.my-reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 抽出したCSS適用ルールを参考に実装
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.2 });

revealElements.forEach(el => observer.observe(el));
```

---

## ⚠️ 法的配慮・倫理的使用

このツールは**学習・分析目的**での使用を前提としています：

- ✅ **OK**: 構造・パターンの学習、設計参考
- ✅ **OK**: 自分の実装への抽象的な応用
- ❌ **NG**: コードの無断複製・再配布
- ❌ **NG**: 他サイトの完全コピー

**推奨**: 抽出結果を参考に、独自の命名規則・構造で再実装する

---

## 🛠️ トラブルシューティング

### エラー: `セレクタに一致する要素が見つかりません`

**原因**: 指定したCSSセレクタが存在しない、または動的読み込み前

**解決**:
```bash
# 待機時間を延長
component-extract --url <URL> --selector <セレクタ> --wait 5000
```

### エラー: `Coverage取得失敗`

**原因**: ページが完全に読み込まれていない

**解決**:
```bash
# ヘッドレスモードを無効化して確認
component-extract --url <URL> --selector <セレクタ> --headless false
```

### Puppeteerバージョン警告

```
npm warn deprecated puppeteer@21.11.0: < 24.15.0 is no longer supported
```

**解決**:
```bash
cd tools/component-extractor
npm install puppeteer@latest
```

---

## 📚 参考リンク

### Chrome DevTools Protocol

- [DOMSnapshot.captureSnapshot](https://chromedevtools.github.io/devtools-protocol/tot/DOMSnapshot/#method-captureSnapshot)
- [CSS.getMatchedStylesForNode](https://chromedevtools.github.io/devtools-protocol/tot/CSS/#method-getMatchedStylesForNode)
- [DOMDebugger.getEventListeners](https://chromedevtools.github.io/devtools-protocol/tot/DOMDebugger/#method-getEventListeners)
- [Coverage API](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/)

### ライブラリ

- [Playwright](https://playwright.dev/)
- [Puppeteer](https://pptr.dev/)
- [@puppeteer/replay](https://github.com/puppeteer/replay)

---

## 📝 更新履歴

### v1.0.0 (2025-11-09)

- ✅ 初回リリース
- ✅ CDP統合（DOMSnapshot, CSS, EventListeners）
- ✅ Coverage収集（JS/CSS）
- ✅ CLIインターフェース実装
- ✅ グローバルコマンド対応（npm link）
- ✅ 設定ファイル対応

---

## 👤 作者

Karin_gamesite プロジェクト

---

## 📄 ライセンス

MIT License

---

**グローバルコマンド名**: `component-extract`
**ローカルパス**: `tools/component-extractor/`
**用途**: Webコンポーネント構造の自動抽出・学習・設計参考
