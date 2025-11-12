# Component Extractor - クイックスタート

**所要時間**: 5分

---

## 📦 1. インストール（初回のみ）

```bash
cd /Users/furuyaatsushi/Documents/Karin_gamesite/tools/component-extractor
npm install
npm link
```

**確認**:
```bash
component-extract --version
# => 1.0.0
```

---

## 🚀 2. 基本的な使い方

### 例1: Boys be maid の ScrollReveal 抽出

```bash
component-extract \
  --url https://boysbemaid.jp/ \
  --selector ".member_slide.js-scrollreveal"
```

**出力先**: `./extracted-components/<セレクタ名>_<タイムスタンプ>/`

**生成ファイル**:
- `component.html` - HTML構造
- `styles.css` - 適用CSSルール
- `scripts.js` - 使用JSコード
- `metadata.json` - メタデータ
- `screenshot.png` - スクリーンショット

---

### 例2: 設定ファイル使用（推奨）

**1. 設定ファイル作成** (`extract-config.json`):

```json
{
  "url": "https://boysbemaid.jp/",
  "selector": ".member_slide.js-scrollreveal",
  "outputDir": "./extracted-boysbemaid",
  "waitTime": 3000
}
```

**2. 実行**:

```bash
component-extract --config ./extract-config.json
```

---

## 📊 3. 抽出結果の確認

```bash
# 出力ディレクトリに移動
cd extracted-components/<セレクタ名>_<タイムスタンプ>/

# メタデータ確認
cat metadata.json

# HTML確認
cat component.html

# CSS確認
cat styles.css

# JS確認（使用範囲のみ）
cat scripts.js
```

---

## 💡 4. よくある使用例

### ケースA: アニメーション実装の参考にする

**目的**: ScrollRevealの実装パターンを学ぶ

```bash
component-extract \
  --url https://boysbemaid.jp/ \
  --selector ".js-scrollreveal" \
  --output ./analysis/scrollreveal
```

**確認ポイント**:
- `styles.css` → opacity, transform, transitionの値
- `metadata.json` → eventListeners（scrollイベント）
- `scripts.js` → ScrollReveal.jsの使用箇所

---

### ケースB: レスポンシブレイアウトの設計参考

**目的**: CSS GridやFlexboxの実装を学ぶ

```bash
component-extract \
  --url https://example.com \
  --selector ".responsive-container" \
  --output ./analysis/layout
```

**確認ポイント**:
- `styles.css` → @mediaクエリ、grid-template-columns
- `metadata.json` → 適用ルール数

---

### ケースC: ブラウザ表示で確認しながら抽出

**目的**: どの要素が抽出されるか目視確認

```bash
component-extract \
  --url https://example.com \
  --selector ".target-element" \
  --headless false
```

ブラウザが立ち上がり、抽出処理を目視確認できます。

---

## 🔧 5. オプション早見表

| よく使うオプション | 説明 | 使用例 |
|------------------|------|--------|
| `--url` | ターゲットURL | `--url https://example.com` |
| `--selector` | CSSセレクタ | `--selector ".my-class"` |
| `--output` | 出力先 | `--output ./my-extracts` |
| `--config` | 設定ファイル | `--config ./config.json` |
| `--wait` | 待機時間（ms） | `--wait 5000` |
| `--headless false` | ブラウザ表示 | `--headless false` |

---

## ⚠️ トラブルシューティング

### Q1: `セレクタに一致する要素が見つかりません`

**A**: 待機時間を延長してください

```bash
component-extract --url <URL> --selector <セレクタ> --wait 5000
```

---

### Q2: Coverage データが空

**A**: ページが完全に読み込まれていない可能性

```bash
# ヘッドレスモード無効化で確認
component-extract --url <URL> --selector <セレクタ> --headless false
```

---

### Q3: グローバルコマンドが使えない

**A**: npm link を再実行

```bash
cd tools/component-extractor
npm link
```

確認:
```bash
which component-extract
# => /usr/local/bin/component-extract (or similar)
```

---

## 📚 次のステップ

- [README.md](../README.md) - 完全なドキュメント
- [example-config.json](../config/example-config.json) - 設定例
- [index.js](../src/index.js) - ソースコード

---

**クイックスタート完了！**

`component-extract --help` でヘルプ表示
