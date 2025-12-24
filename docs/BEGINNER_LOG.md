# ビギナーログ

## 2025-12-24 16:34 (JST)
- 変更内容: `public/index.html` の OP ムービー HUD 左上テキストを「AIZO GAME PROJECT」に変更。
- 手順メモ:
  1. 該当箇所を検索: `rg -n "opening__tagline" public/index.html`
  2. 該当行を更新: `<p class="opening__tagline">AIZO GAME PROJECT</p>`
  3. 置換後、検索で元文言が残っていないことを確認: `rg -n "Karin Game Project" public/index.html`
- 確認ポイント: ブラウザキャッシュが効く場合はハードリロードで反映を確認。

## 2025-12-24 16:45 (JST)
- 変更内容: `public/css/pages/gallery.css` のライブラリモーダル（ギャラリーポップアップ）で、スマホ幅時のテキストが収まるようタイポグラフィと余白を調整。
- 手順メモ:
  1. モバイル専用メディアクエリで `.library-modal__panel` の高さ上限を `100vh` から `calc(100vh - … - 3.5rem)` に変更し、画像高さを `max-height:42vh` で抑制。
  2. `.library-modal__story` のフォントサイズ/行間/パディングを縮め、段落間マージンも詰めて可読性を維持しつつオーバーフローを緩和。
- 確認ポイント: スマホ実機/デベロッパーツールでモーダルを開き、テキスト末尾までスクロールできるか確認。ハードリロード推奨。

## 2025-12-24 16:55 (JST)
- 変更内容: アルタールリンク（`public/css/main.css` の `.sacrament-link`）に背景画像を適用。外部ファイル `/Users/furuyaatsushi/Downloads/banner_sns.png` を `public/images/main/altar-frame.png` に配置し、カバー表示 + 暗めのグラデーションで可読性を確保。
- 手順メモ:
  1. 画像をコピー: `cp /Users/furuyaatsushi/Downloads/banner_sns.png public/images/main/altar-frame.png`
  2. `.sacrament-link` の `background` を画像 + オーバーレイの多層指定に変更し、`background-size: cover` ほかを設定。
- 確認ポイント: `public/main.html` の「公式アカウント」「Spec」カードが新背景で表示され、文字が読めるかを PC/スマホ幅双方で確認。

## 2025-12-24 16:58 (JST)
- 変更内容: ギャラリーモーダルのスマホ時テキスト見切れ対策を再調整（`public/css/pages/gallery.css`）。パネル高さ上限をさらに縮め、画像高さ・本文フォント/行間/余白を小さめにして収まり改善。
- 手順メモ:
  1. `.library-modal__panel` の `max-height` を `calc(100vh - … - 5rem)` に変更。
  2. 画像 `max-height` を 38vh に縮小、キャプションや本文のフォントサイズ・行間・パディング・段落間隔を軽く圧縮。
- 確認ポイント: スマホ幅（例: 375px）で任意カードを開き、テキスト末尾までスクロールできるか再確認。見切れが残る場合はさらにフォント/行間/余白を詰める余地あり。

## 2025-12-24 17:03 (JST)
- 変更内容: ギャラリーモーダル内のスクロールを廃止し、全文を表示する設計に変更（`public/css/pages/gallery.css`）。パネルの高さ上限とオーバーフロー指定を除去し、本文の flex/overflow を外してモーダル全体で自然に流れるようにした。モバイル画像も高さ制限を外し、contain で全体表示。
- 手順メモ:
  1. `.library-modal__panel` の `max-height` と `overflow` を削除。`.library-modal__story` の flex と overflow を削除。
  2. モバイルのパネル max-height を撤廃し、画像を `object-fit: contain` で全体表示に変更。
- 確認ポイント: PC/スマホいずれもモーダル内で全文が途切れず表示されることを確認（スクロールバーが出ず、ページ全体のスクロールで読了できること）。

## 2025-12-24 17:10 (JST)
- 変更内容: モーダルコンテナ側でオーバーフローを許可し、中央寄せ固定による切れを防止（`public/css/pages/gallery.css`）。`.library-modal` に `overflow:auto`・`align-items:flex-start` を設定し、`.library-modal__shell` の高さを `auto`/`min-height:100vh` にして内部スクロールなしでページ全体スクロールを有効化。
- 確認ポイント: PC/スマホで `gallery.html` を開き、任意カードを表示 → ページ全体スクロールで本文末尾まで読めること。切れやスクロール不可が解消されているか確認。

## 2025-12-24 17:07 (JST)
- 変更内容: スクロール誘導のヒントを追加（`public/gallery.html`, `public/css/pages/gallery.css`, `public/js/main.js`）。モーダル内に点滅する下向き矢印ボタンを表示し、クリック/タップでモーダルをスムーズに下スクロール。コンテンツが収まりきっている場合や最下部では自動で非表示。
- 手順メモ:
  1. HTMLにスクロールヒントボタン（`data-scroll-hint`）を追加。
  2. CSSで円形ボタン・点滅アニメを設定、モバイルサイズも調整。
  3. JSでオーバーフロー検出と表示/非表示、クリック時に約0.8画面分スクロールする処理を追加。スクロールイベントで動的に更新。
- 確認ポイント: モーダルを開くと矢印が表示され、押下で下方向にスクロールすること。内容が短い場合は矢印が非表示になること。

## 2025-12-24 17:18 (JST)
- 変更内容: ギャラリーモーダルを開いた際に必ずトップから表示されるようスクロール位置をリセット（`public/js/main.js`）。モーダル全体とパネル、ウィンドウを `scrollTo(0)` で初期化。
- 確認ポイント: 任意カードを開いた直後にファーストビューがカード先頭になることを確認。

## 2025-12-24 17:24 (JST)
- 変更内容: モーダル表示後のレイアウト確定を待ってから二段階の `requestAnimationFrame` でスクロール位置をリセットするよう修正（`public/js/main.js`）。表示切替直後にボトム付近が見える問題の再対処。
- 確認ポイント: カードを開いた直後に先頭行が表示されるかを再確認。

## 2025-12-24 17:35 (JST)
- 変更内容: ギャラリーモーダル表示中のみ背後のページを 0.1s でブラーさせる演出を追加（`public/css/pages/gallery.css`）。`body.modal-open .page-container` に `filter: blur(6px)` とトランジションを適用。
- 確認ポイント: モーダルを開くと背後が軽くぼけて、閉じると元に戻ること。

## 2025-12-24 17:45 (JST)
- 変更内容: 直接URLアクセス時のトップページ強制リダイレクトを廃止（`public/main.html`, `public/gallery.html`, `public/product.html`, `public/news.html`, `public/characters/*.html`）。`age-gate-state` のチェックによる `window.location.replace` を削除。
- 確認ポイント: `main.html`/`gallery.html`/`product.html`/各キャラページへ直アクセスしてもトップへリダイレクトされないこと。

## 2025-12-24 17:55 (JST)
- 変更内容: スマホ幅（max-width:767px）でメンバースライダーのビューポート左右に 2rem のマージンを付与（`public/css/main.css`）。モバイル表示時に左右余白を確保。
- 確認ポイント: スマホ幅でキャラクターセクションを確認し、スライダーの左右に均等な余白が入っていること。

## 2025-12-24 18:02 (JST)
- 変更内容: ギャラリーモーダルのスクリムをビューポート全体に固定し、高さ抜けを防止（`public/css/pages/gallery.css`）。`position: fixed` + `width/height: 100vw/100vh`、スクリムを z-index:0、シェルを z-index:1 に設定。
- 確認ポイント: モーダル表示時、背景スクリムが画面全体を覆い欠けがないこと。

## 2025-12-24 18:18 (JST)
- 変更内容: ギャラリーモーダル開時に複数階層（モーダル/パネル/ドキュメント/ウィンドウ）のスクロール位置を rAF 2段階でリセットし、常にカード先頭がファーストビューになるよう再調整（`public/js/main.js`）。`scrollIntoView` も併用。
- 確認ポイント: 任意カードを開いた直後、必ず先頭から表示され、下部が初期表示にならないこと。

## 2025-12-24 18:27 (JST)
- 変更内容: ギャラリーページで main と footer の間に下余白を付与（`public/css/pages/gallery.css`）。PCは4rem、SPは3remのパディングボトムを追加。
- 確認ポイント: `gallery.html` で main 下に余白が入り、フッターが窮屈にくっつかないこと。

## 2025-12-24 18:33 (JST)
- 変更内容: フッターテキストのフォントサイズを小さめ（0.85rem）に調整し、レタースペーシングを付与（`public/css/main.css`）。フッター全体の読みやすさを確保。
- 確認ポイント: 全ページのフッターで文言が小ぶりになり、デザインとバランスが取れていること。
## 2025-12-24 16:59 (JST)
- 変更内容: アルタールリンクカード中央の赤い縦ラインを削除（`css/main.css` の `.altar-links::after` を除去）し、不要な装飾をなくした。
- 手順メモ:
  1. 対象スタイルを確認: `sed -n '630,720p' css/main.css`
  2. 中央線を描画していた疑似要素 `.altar-links::after` ブロックを削除（`apply_patch`）。
  3. 削除確認: `rg "altar-links::after" -n css/main.css` で該当定義がないことを確認。
- 確認ポイント: `public/main.html` の「アルタールリンク」セクションをブラウザで再読み込みし、カード中央の赤い線が表示されないことを確認。キャッシュが効く場合はハードリロード推奨。
