# Workflow Auto-Save Rules

- 参照元: `reference/issues.md`, `reference/production-docs/implementation-plan.md`, `reference/changes-log.md`
- 保存タイミング:
  - Codex CLI で Issue 状況を更新した直後
  - ドキュメントに仕様変更を加えた直後
  - セッション終了時に会話サマリーを書き出す
- 保存先: `.memory/workflows/workflow-log.json`
- 同期: `.memory-config.json` の `workflow.autoCapture` が `true` の場合は OpenMemory へ即時 push
- 付随情報: 各エントリに `summary`, `status`, `relatedFiles`, `nextActions` を必須フィールドとして付与
