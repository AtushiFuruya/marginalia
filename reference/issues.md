# Karin_gamesite - Issue一覧（MVP / Walking Skeleton）

最小限のWalking Skeleton（MVP）を基準にしたIssue分割リストです。
本リストは `reference/production-docs/*` と `reference/development-guides/*` を参照して作成しています。

---

## 目的（短く）
本プロジェクトは成人向けリョナゲームの販売サイトをMVPとして構築します。
静的ページ（index/opening/main 等）をコアに、`pages/news.html` 階層のみ WordPress で運用し、最新情報は WordPress 側で管理します。

---

## 運用方針（WordPress連携）
- news（お知らせ/更新情報）は WordPress 管理（管理画面で投稿）。
- 静的サイト側は WP REST API（例: `/wp-json/wp/v2/posts`）によるフェッチで最新記事を取得して表示する方式を推奨。
  - 代替: RSS を定期パースして表示（簡易運用時）。
- 初期（MVP）は手動でWP記事を静的に反映しても可。将来的にヘッドレスWP化を検討。

---

## 参考（ローカルで収集したデザイン・分析）
- `reference/analyzed-sites/bug-system/ANALYSIS-SUMMARY.md` — 真愛の百合は赤く染まる（参考サイト分析）
  - ダークテーマ、高級感、モーダルギャラリー、扉アニメーション等が参考になる

---

## 優先度定義
- P0: 必須 - MVPで絶対必要
- P1: 高 - MVPに近接（早期に実装推奨）
- P2: 中 - 拡張フェーズで実装
- P3: 低 - 将来的な改善・オプション

---

## Issue一覧（MVP中心）

### Issue #001 (P0) — 年齢確認ページ (index.html) の HTML/CSS/JS 実装
- 目的: サイト入口で年齢確認を行う。18歳未満を弾く（退出は Google に遷移）。
- 詳細:
  - セマンティックな HTML5 構造
  - 背景画像/動画レイヤー + オーバーレイ
  - 2つのボタン (Enter / 退出する)
  - キーボード操作対応（tab/enter）と ARIA 属性
  - 日本語文言: 「１８歳以下は入場できません。」
- 受入基準 (DoD):
  - [ ] ボタンがキーボードで操作可能
  - [ ] 退出時に `https://www.google.com` へ遷移する
  - [ ] aria-label/role が主要 UI に付与されている
  - [ ] 画像に alt 属性がある
  - [ ] 表示がレスポンシブである
- 必要ファイル: `index.html`, `css/age-verification.css`, `js/age-verification.js`, `assets/images/age-verification/background.jpg`
- 依存関係: なし（最初に実装）
- 推定時間: 2時間
- テスト項目:
  - ボタン操作（マウス/キーボード）
  - スマホ表示（縦並び）
  - 退出の遷移先
- セキュリティ/プライバシー: 年齢確認はログ保存しない（MVP）。


### Issue #002 (P0) — オープニングページ (opening.html) の実装
- 目的: スライドショー/演出でユーザーを導入する
- 詳細:
  - 3〜5枚のスライド (PNG) を 2 秒間隔で切替
  - フェードイン/アウト、スキップボタン、プログレスバー
  - スキップで `main.html` へ即時遷移
- DoD:
  - [ ] 自動スライドが動作する
  - [ ] スキップボタンが機能する
  - [ ] 最後に `main.html` へ遷移する
- 必要ファイル: `opening.html`, `css/opening.css`, `js/opening.js`, `assets/images/opening/slide-01.png`〜
- 依存: Issue #001
- 推定時間: 3時間


### Issue #003 (P0) — メインページ (main.html) / ギャラリー
- 目的: ギャラリー表示とナビゲーションの提供
- 詳細:
  - Flexbox / CSS Grid でギャラリーを実装（6〜8枚）
  - サムネクリックでモーダル表示（Lightbox）
  - レスポンシブ: 3列→2列→1列
- DoD:
  - [ ] ギャラリーが正しくレイアウトされる
  - [ ] モーダルで拡大表示される
  - [ ] 画像に alt がある
- 必要ファイル: `main.html`, `css/main.css`, `js/main.js`, `assets/images/gallery/*`
- 依存: Issue #002
- 推定時間: 3時間


### Issue #004 (P1) — pages/characters.html（キャラクター紹介）
- 目的: 背景透過PNGを使ったキャラクター紹介
- 詳細:
  - 背景透過 PNG を利用してキャラクターカード表示
  - 各キャラにプロフィール、CV、簡単な説明
  - クリックでモーダル詳細（将来的に個別ページ）
- DoD:
  - [ ] 透過PNGが崩れず表示される
  - [ ] alt 属性、aria ラベルがある
- 必要ファイル: `pages/characters.html`, `css/pages/characters.css`, `js/pages/characters.js`, `assets/images/characters/*`
- 依存: Issue #003
- 推定時間: 4時間


### Issue #005 (P1) — pages/story.html（ストーリー紹介）
- 目的: ゲームのシナリオ紹介・世界観説明
- DoD:
  - [ ] テキストが読みやすいレイアウト（読みやすさ、行間）
- 必要ファイル: `pages/story.html`, `css/pages/story.css`
- 依存: none
- 推定時間: 2時間


### Issue #006 (P1) — pages/special.html / download / spec（特典・ダウンロード）
- 目的: 特典情報、ダウンロード案内、製品スペック
- DoD: 各セクションが表示され、外部リンクが正しい
- 必要ファイル: `pages/special.html`, `pages/download.html`, `pages/spec.html`
- 推定時間: 3時間


### Issue #007 (P0) — pages/news.html の WordPress 接続設計
- 目的: News（お知らせ）を WordPress で管理し、静的サイトで表示する
- 詳細:
  - WP 管理画面で投稿を作成
  - 静的サイトは WP REST API を利用して最新記事を取得
  - API キャッシュ戦略（短期キャッシュ）を設計
- DoD:
  - [ ] WP 側で投稿が作成できる
  - [ ] 静的サイトが API から記事を取得して表示する（ステージングで確認）
- 必要ファイル: `pages/news.html`, `js/news-fetch.js`
- 依存: WordPress サーバの用意
- 推定時間: 3時間


### Issue #008 (P2) — SEO / meta / OG 対応
- 目的: 最低限の SEO と SNS シェア用の OG タグを追加
- DoD: 各ページに title/description/og タグ、canonical を配置
- 推定時間: 2時間


### Issue #009 (P1) — 画像最適化ワークフロー
- 目的: 画像を WebP に変換、srcset を用意してレスポンシブ対応
- 推定ツール: imagemagick / sharp / Squoosh
- DoD: 主要画像が WebP と元フォーマットで用意され、srcset が設定されている
- 推定時間: 2時間


### Issue #010 (P1) — テスト / E2E 環境
- 目的: 年齢確認・遷移・表示を自動で検証する E2E テストを準備
- 推定ツール: Playwright または Cypress
- DoD: 主要フロー（index→opening→main）を自動で確認できる
- 推定時間: 3時間


---

## 付録: Issue 作成ルール（テンプレート）
- タイトル: Issue #NNN: [短いタスク名]
- 目的: 何を達成するか
- 詳細: 実装の要点・制約
- 受入基準 (DoD): チェックリスト形式
- 必要ファイル: 新規作成 / 変更ファイルを列挙
- 依存関係: 前提タスク・後続タスク
- 推定時間: 工数見積り
- 優先度: P0/P1/P2/P3
- 備考: セキュリティ・アクセシビリティ注意点

---

## 注記
- 年齢確認の保存ポリシー: MVP は保存しない。将来的に保存する場合は暗号化・保持期間を必ず決めること。
- WP 連携は REST API を推奨。RSS は簡易互換として利用可。

---

*生成日: 2025-11-07*