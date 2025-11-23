# CLAUDE.md

Claude Code / Codex CLI がこのリポジトリで作業する際のガイドラインです。必ず内容を確認してから作業を開始してください。

## 言語ポリシー

- **回答は常に日本語**で行うこと（ユーザーからの指示言語に関係なく翻訳不要）。
- 依頼に必要な最小限の情報に絞る。

## 作業プロセス

1. **理解の確認** – 依頼内容を簡潔に纏め、解釈が合っているか確認。
2. **前提のチェック** – 必要ファイルや仕様（`reference/production-docs/*` 等）を確認。
3. **不明点の質問** – 性格で不確定要素の少ない作業を考え、あいまいさや不足情報、複数解釈がある場合は必ず質問し、合意を得てから実装。合意は大事。基本必ず実行前に確認をして、OKが出たら作業をする。
4. **小さなステップで実装** – 変更ごとにローカル確認（ブラウザ/DevTools）→結果共有。
5. **検証と報告** – 行った変更について初心者向けにシンプルに解説、確認方法、残課題を明確に伝える。

## 開発上の注意

- UI/CSS 作業は **Chrome DevTools での描画確認**を必須とし、必要に応じてスクリーンショットを貼付。
- JavaScript/アニメーション修正は可能な限りブラウザ上で動作確認し、挙動を文章で説明。
- 画像やフォントなどアセット変更時は `images/`, `public/images/`, `characters/` など該当ディレクトリ構造に従う。
- レスポンシブ/アクセシビリティ要件は `reference/production-docs/requirements.md` と `web-development-prompting-best-practices.md` を参照。
- 実装計画は `reference/production-docs/implementation-plan.md`、Issue分割は `reference/issues.md` を優先。

## リポジトリ概要

```
├── index.html / opening.html / main.html / characters/*.html  # 各ページ本体
├── css/ / public/css/ / css/pages/                            # ページ別スタイル
├── js/                                                        # ページ用スクリプト
├── images/, public/images/, assets/                           # 画像・動画アセット
├── reference/                                                 # 仕様・ガイドライン
├── FireAnimationTest/, test-pages/                            # 実験用ページ
└── tools/, scripts/, tests/                                   # 補助ツール
```

- メイン導線: `index.html`（年齢確認）→ `opening.html` → `main.html`
- キャラクターページは `characters/` 以下の個別HTML + `css/pages/characters.css`
- ギャラリーやテスト用HTMLは `public/` 配下にも存在するため、作業対象を間違えないこと

## ツール/連携

- **OpenMemory MCP**: `.claude/config.toml` で `openmemory` サーバーを登録済み。必要に応じて再起動して接続状態を確認。
- **Chrome DevTools MCP**: `/Users/furuyaatsushi/.codex/config.toml` に設定済み。ブラウザ検証が必要なタスクで使用。
- Mem0 / ローカルメモリ (`.memory/`) に仕様・会話履歴が保存されている。参照する際は内容を上書きしない。

## ドキュメント参照

- 要件: `reference/production-docs/requirements.md`
- 実装計画: `reference/production-docs/implementation-plan.md`
- サイトマップ: `reference/production-docs/production-sitemap.md`
- 画像ガイド: `reference/production-docs/image-assets-guide.md`
- プロンプト指針: `reference/development-guides/prompting-manual.md`

必要に応じてこれらを更新し、変更点は `reference/changes-log.md` に追記してください。
