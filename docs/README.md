# Karin Game Site

アダルトゲームの販売サイトのMVPプロジェクトです。

## プロジェクト構成

- `index.html` - 年齢確認・オープニング・メインビュー
- `css/` - スタイルシート
- `js/` - JavaScript
- `assets/` - 画像・動画素材
- `reference/` - プロジェクト関連ドキュメント

## 開発環境のセットアップ

1. リポジトリのクローン:
```bash
git clone [repository-url]
cd Karin_gamesite
```

2. 仮想環境の作成と有効化:
```bash
python -m venv venv
source venv/bin/activate  # Unix系
.\venv\Scripts\activate   # Windows
```

3. 開発サーバーの起動:
```bash
python -m http.server 8000
```

## 技術スタック

- HTML5
- CSS3
- JavaScript (ES6+)
- Python (開発サーバー用)

## ブランチ戦略

- `main` - プロダクション用
- `develop` - 開発用
- `feature/*` - 機能開発用

## ライセンス

All rights reserved.
