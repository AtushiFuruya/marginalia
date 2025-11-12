# Figma Implementation Guide

## プロジェクト概要

このドキュメントは、FigmaデザインからHTMLへの完全実装の詳細を記録しています。

## ファイル構造

```
/Users/furuyaatsushi/Documents/Karin_gamesite/
│
├── boysbemaid-complete.html          ← メインファイル（完全実装版）
├── figma-boysbemaid.html             ← 初期実装版（Section 1のみ）
│
├── images/
│   └── figma-boysbemaid/             ← Figmaからエクスポートした全画像
│       ├── section1-hero.png         (3840x4364px, 4.2MB) - ヒーローセクション
│       ├── section2-introduction.png (3840x4060px, 556KB) - イントロダクション
│       ├── section3.png              (3840x1871px, 1.1MB) - コンテンツ1
│       ├── section4.png              (3840x2925px, 3.7MB) - コンテンツ2
│       ├── section5.png              (3840x3294px, 3.2MB) - フッター
│       ├── full-page-complete.png    (1920x8935px, 6.6MB) - 全体参照用
│       ├── main-visual.png           (2460x3480px, 3.1MB) - メインビジュアル単体
│       ├── logo.png                  (1640x342px, 228KB) - タイトルロゴ
│       ├── introduction-heading.png  (2186x206px, 43KB) - INTRODUCTION見出し
│       ├── bg-image-1.png            (3840x4362px, 339KB) - 背景画像1
│       ├── bg-image-2.png            (3840x4362px, 1.1MB) - 背景画像2
│       └── decorative-bg.png         (3840x200px, 24KB) - 装飾背景パターン
│
├── css/
│   ├── main.css                      ← 既存のメインスタイル
│   ├── opening.css                   ← オープニング用
│   └── age-verification.css          ← 年齢確認用
│
├── js/
│   ├── main.js                       ← メインJavaScript
│   └── age-verification.js           ← 年齢確認用
│
├── .claude/
│   ├── config.toml                   ← Claude Code設定（Figma MCP設定含む）
│   └── commands/
│       └── analyze-web-design.md     ← カスタムコマンド
│
└── reference/
    └── analyzed-sites/
        └── boysbemaid/               ← Boys be maid分析データ

```

## Figma実装の詳細

### Figmaデザイン情報

- **Figma File**: C7ZNIG6IxWbiItmlv3GXW3
- **File Name**: BLunch_Interim report_0917
- **Node ID**: 288-26 (Full Page: 1920w light)
- **Total Height**: 8935px
- **Base Width**: 1920px

### セクション構成

| セクション | Node ID | 高さ | Y位置 | 説明 |
|-----------|---------|------|-------|------|
| Section 1 | 288:28  | 2181px | 3196 | ヒーロー/メインビジュアル |
| Section 2 | 288:33  | 2030px | 5277 | イントロダクション |
| Section 3 | 288:417 | 935px  | 7307 | コンテンツセクション1 |
| Section 4 | 288:615 | 1462px | 8402 | コンテンツセクション2 |
| Section 5 | 288:736 | 1647px | 9804 | フッター |

### 画像エクスポート設定

- **スケール**: 2x (Retina対応)
- **フォーマット**: PNG
- **実際の画像サイズ**: Figmaデザインの2倍
  - 例: 1920px → 3840px

### カラーパレット（Figmaから抽出）

- **紫色テキスト**: `rgb(60, 50, 190)` / `#3C32BE`
- **ベージュ背景**: `rgb(238, 234, 226)` / `#EEEAE2`
- **白**: `rgb(255, 255, 255)` / `#FFFFFF`

## 実装ファイル

### boysbemaid-complete.html

完全なページ実装。全5セクションを含む。

**特徴:**
- Figmaデザインの忠実な再現
- レスポンシブ対応
- 遅延読み込み（Lazy Loading）
- スムーススクロール
- IntersectionObserver APIによる最適化

**使用方法:**
```bash
# ローカルサーバーを起動
cd /Users/furuyaatsushi/Documents/Karin_gamesite
python3 -m http.server 8000

# ブラウザでアクセス
open http://localhost:8000/boysbemaid-complete.html
```

### レスポンシブ対応

```css
/* デスクトップ（1920px以上） */
.page-container {
    max-width: 1920px;
    margin: 0 auto;
}

/* タブレット（1920px以下） */
@media (max-width: 1920px) {
    .section {
        height: auto; /* 高さを自動調整 */
    }
}

/* モバイル（768px以下） */
@media (max-width: 768px) {
    .section img {
        width: 100%;
        height: auto;
    }
}
```

## Figma API使用方法

### 認証設定

Figmaアクセストークンは以下のファイルに設定済み:

**~/.codex/config.toml**
```toml
[mcp_servers.figma-dev-mode-mcp-server]
command = "npx"
args = ["-y", "mcp-remote", "http://127.0.0.1:3845/mcp"]

[mcp_servers.figma-dev-mode-mcp-server.env]
FIGMA_ACCESS_TOKEN = "figd_nlvk5rMCg40SD91kMnlQu0ybJXp5SI4izAl2uGNc"
```

### API呼び出し例

```bash
# ノード情報取得
curl -H "X-Figma-Token: YOUR_TOKEN" \
  "https://api.figma.com/v1/files/FILE_KEY/nodes?ids=NODE_ID"

# 画像エクスポート
curl -H "X-Figma-Token: YOUR_TOKEN" \
  "https://api.figma.com/v1/images/FILE_KEY?ids=NODE_ID&format=png&scale=2"
```

## パフォーマンス最適化

### 実装済み最適化

1. **遅延読み込み**
   - `loading="lazy"` 属性
   - IntersectionObserver API

2. **画像最適化**
   - 2x Retina対応
   - 適切なフォーマット（PNG）

3. **スムーススクロール**
   - CSS: `scroll-behavior: smooth`
   - JavaScript: 追加の最適化

### 画像サイズ一覧

| ファイル名 | サイズ | 用途 |
|-----------|--------|------|
| section1-hero.png | 4.2MB | ヒーローセクション（高解像度必須） |
| section2-introduction.png | 556KB | イントロダクション |
| section3.png | 1.1MB | コンテンツ1 |
| section4.png | 3.7MB | コンテンツ2（詳細画像多数） |
| section5.png | 3.2MB | フッター（詳細画像多数） |
| **合計** | **約13MB** | 全セクション |

## 開発履歴

### 2025-11-10

1. **Figma MCP Server設定**
   - アクセストークン設定
   - MCP server接続確認

2. **初期実装（figma-boysbemaid.html）**
   - Section 1のみ実装
   - 個別要素（main-visual, logo, heading）配置

3. **完全実装（boysbemaid-complete.html）**
   - 全5セクション実装
   - 各セクション画像をエクスポート
   - レスポンシブ対応追加
   - 遅延読み込み実装

4. **幅調整修正**
   - `.page-container`の幅を`width: 100%`に変更
   - `max-width: 1920px`で最大幅制限
   - レスポンシブメディアクエリ最適化

## トラブルシューティング

### 画像が表示されない場合

1. **パスの確認**
   ```html
   <!-- 正しいパス -->
   <img src="images/figma-boysbemaid/section1-hero.png">
   ```

2. **ファイルの存在確認**
   ```bash
   ls -lh images/figma-boysbemaid/
   ```

3. **サーバー起動確認**
   ```bash
   # サーバーが起動しているか確認
   lsof -i :8000
   ```

### 幅がずれる場合

- ブラウザのDevToolsで要素の幅を確認
- `max-width: 1920px`が適用されているか確認
- `width: 100%`と`overflow-x: hidden`の組み合わせを確認

### 画像が重い場合

- 将来的にWebP形式への変換を検討
- 画像圧縮ツールの使用を検討
- Progressive JPEGの使用を検討（背景画像用）

## 今後の改善案

1. **画像最適化**
   - WebP形式への変換
   - 画像圧縮
   - レスポンシブ画像（srcset）

2. **インタラクション追加**
   - スクロールアニメーション
   - パララックス効果
   - ホバーエフェクト

3. **アクセシビリティ**
   - alt属性の充実
   - ARIAラベルの追加
   - キーボードナビゲーション

4. **SEO対策**
   - メタタグの追加
   - 構造化データ
   - Open Graph設定

## 参考リンク

- [Figma File](https://www.figma.com/design/C7ZNIG6IxWbiItmlv3GXW3/BLunch_Interim-report_0917?node-id=288-26&m=dev)
- [Figma API Documentation](https://www.figma.com/developers/api)
- [Boys be maid Original Site](https://boysbemaid.jp/)

---

**作成日**: 2025-11-10
**最終更新**: 2025-11-10
**作成者**: Claude Code + Figma API
