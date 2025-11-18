# Integration Notes — Karin_gamesite

作業日: 2025-11-07

このファイルは追加要求（トップページの8秒ムービー年齢確認・SNS連携・ニュース更新フロー・GitHub導入手順）をまとめた実務向け統合ノートです。

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

## 3) ニュース更新フロー（静的）
### 方針
- `news.html` を静的HTMLで実装し、手動で記事ブロックを追加・差し替えます。
- 更新頻度が高くなった場合だけCMS（WordPress等）を再検討します。

### 推奨セクション構成
1. ヒーロー: ページ説明と「最新のお知らせ」見出し
2. 最新3〜5件: `article` or `li` で日付・タイトル・本文・外部リンクを表示
3. アーカイブ: `news/archive.html` など過去ログページへのリンク
4. CTA: 「お問い合わせ」「公式X」等への導線

### 運用手順
1. 更新時は `news.html` の記事ブロックを複製し、`datetime` 属性とテキストを差し替える
2. 古い記事は別ページ（`news/archive.html`、`news/2024.html` 等）に移動
3. 更新日を `main.html` の「最新情報」カードにも反映（必要なら）
4. デプロイ前に必ず日付順とリンク先の動作を確認する

### 自動化の余地
- Markdown など別ソースから `news.html` を生成したい場合は `tools/` にスクリプトを置き、`npm run build-news` などでHTML化する。
- 将来的にCMS化する際はこのフローを置き換える（フェッチ処理やREST API は現時点では不要）。

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
1. `news.html` のワイヤーフレームを固め、必要なダミー記事を3件以上用意する。
2. GitHub リポジトリ名と公開方法（Pages/Netlify/Vercel）を決定してください。私がワークフロー/CI 設定（Actions/Netlify設定）を作成します。
3. 将来CMS化する場合に備え、ニュース記事のマークアップ規則（クラス名・microdata等）をドキュメント化しておく。

---

この統合ノートは必要に応じて `reference` 内の関連ドキュメントに分割して組み込みます。必要であれば、細かな手順（ホスティング別のスクリーンショット含む）を追加します。
