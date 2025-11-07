# Integration Notes — Karin_gamesite

作業日: 2025-11-07

このファイルは追加要求（トップページの8秒ムービー年齢確認・SNS連携・WordPress導入手順・GitHub導入手順）をまとめた実務向け統合ノートです。

---

## 1) トップページ表示フロー（年齢確認）
- トップページ (`index.html`) では背景に **8秒のイントロムービー** を自動再生します（ミュート推奨）。
- ムービー上に年齢確認オーバーレイを表示:
  - 文言: 「１８歳以下は入場できません。」
  - ボタン: `Enter`（18歳以上） / `退出する`（18歳未満）
- 動作:
  - `Enter` → `opening.html` に遷移（フェードなどの演出を実施）
  - `退出する` → `https://www.google.com` へ即時遷移
- 実装上の注意:
  - 年齢情報は保存しない（MVP）。
  - ユーザーが `Enter` をクリックしない場合のフォールバック（ムービー終了後にオーバーレイをフォーカスして操作可能にする）。
  - パフォーマンス対策: 動画は低ビットレートで 1080p 推奨、HTTP/2 や圧縮を利用。

---

## 2) SNS 連携
- 公式 X アカウントをサイト全ページ（ヘッダー／フッター）に設置。
  - アカウント: https://x.com/Marginalia_PR
- 各ページに Open Graph / Twitter Card を追加（OG:title, OG:description, OG:image, twitter:card など）。

---

## 3) WordPress の導入（news 用）
### 目的
- 管理画面からニュース／お知らせを更新できるようにする。

### 選択肢
- A: マネージドホスティング（推奨） — 管理が容易、SSL・バックアップが簡単
- B: 自前サーバ or Docker（開発・テスト用）

### A: マネージドホスティング手順（概略）
1. レンタルサーバを契約（ConoHa WING, さくらのレンタルサーバ等）
2. 管理パネルから WordPress インストールを実行
3. 管理者アカウントを作成し、パーマリンクを設定 (`/news/%postname%/` など)
4. SSL を有効化
5. 必要なプラグインを導入（セキュリティ/バックアップ/キャッシュなど）
6. 投稿を作成して公開

### B: Docker でのローカル構築（テスト用）
- 参考コマンド（プロジェクトルートに `docker-compose.yml` を用意）:

```bash
cat > docker-compose.yml <<'EOF'
version: '3.7'
services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: wordpress
  wordpress:
    image: wordpress:latest
    ports:
      - '8000:80'
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: example
      WORDPRESS_DB_NAME: wordpress
    depends_on:
      - db
EOF

docker-compose up -d
```

- ブラウザで `http://localhost:8000` にアクセスしてセットアップ
- 投稿の公開を確認し、REST API（`/wp-json/wp/v2/posts`）で記事が取得できることを確認

### 静的サイト側の実装（fetch例）
- `js/news-fetch.js` 例:

```javascript
async function fetchNews() {
  const res = await fetch('https://your-wp-site/wp-json/wp/v2/posts?per_page=5');
  const posts = await res.json();
  // DOM に描画する処理
}
fetchNews();
```

---

## 4) GitHub / デプロイ手順（簡易）
### 目的
- ソースを GitHub にホストし、CI/CD で自動デプロイする。

### リポジトリ初期設定（ローカル -> GitHub）

```bash
# 1. 既存プロジェクトで初回のみ
git init
git add .
git commit -m "Initial commit: Karin_gamesite"
git branch -M main
# 2. GitHub でリポジトリを作成後（SSH 例）
git remote add origin git@github.com:YOUR_USERNAME/karin-gamesite.git
git push -u origin main
```

### GitHub Pages で公開
- `Settings > Pages` で `main` ブランチの `/(root)` を公開先に設定

### Netlify / Vercel で自動デプロイ（推奨）
- GitHub と連携してプッシュで自動デプロイ。
- Netlify の場合はビルドコマンド不要（静的）。ビルド設定がある場合は指定。

### GitHub Actions の例（概要）
- Netlify/Vercel 連携を使う方が簡単だが、GitHub Actions で静的サイトビルド→デプロイも可能。
- 詳細ワークフローが必要ならテンプレートを作成します。

---

## 5) 次の推奨アクション
1. WordPress をどのホスティングで運用するか決定してください（マネージド推奨）。
2. GitHub リポジトリ名と公開方法（Pages/Netlify/Vercel）を決定してください。私がワークフロー/CI 設定（Actions/Netlify設定）を作成します。
3. 早期に Docker ローカルの WordPress を立てて動作確認することを推奨します（テスト環境確保）。

---

この統合ノートは必要に応じて `reference` 内の関連ドキュメントに分割して組み込みます。必要であれば、細かな手順（ホスティング別のスクリーンショット含む）を追加します。
