# 変更ログ（changes-log）

このファイルは作業で追加・更新した主要ドキュメントの記録です。

## 2025-11-07
- 追加: `reference/.memory/context/project-context-20251107.md` — プロジェクトのローカルコンテキストを保存
- 更新: `reference/development-guides/prompting-manual.md` — MVP/WordPress運用・アクセシビリティ・セキュリティ・テスト等を反映して全面更新
- 追加: `reference/issues.md` — MVP 向け Issue 分割一覧（P0〜P2）を作成
- 追加: `reference/changes-log.md` — この変更ログ
 - 追加: `reference/production-docs/integration-notes.md` — トップページの8秒ムービー年齢確認、SNS連携、WordPress導入手順、GitHubデプロイ手順を追加

## 2025-11-12
- 更新: `.memory-config.json` — OpenMemory APIキーを `m0-r0Q6tu9mlIIN2FHseHc3cnZenf4atIJ0ci97WBgZ` に更新し、workflow自動保存セクションを追加
- 更新: `.gitignore` — `.memory-config.json` をGit追跡対象から除外
- 更新: `reference/development-guides/openmemory-setup-guide.md` / `shared-memory-architecture.md` / `conversation-analysis.md` / `user-prompts-timeline-dated.md` — 新APIキーと最新フローに同期
- 追加: `.memory/code-snippets/*`, `.memory/user-preferences/*`, `.memory/sync/*`, `.memory/workflows/*` — 自動保存コンテキスト/ワークフロー用の初期テンプレートとルールを配置
- 更新: `.memory/MEMORY-SYSTEM-REVIEW.md` — OpenMemory設定セクションを最新キーで更新

## 備考
- 上記はローカルでのドキュメント編集のみで、コードやアセットの変更は行っていません。
- 今後、Issue に従ってファイル（HTML/CSS/JS）やスニペットを作成していきます。
