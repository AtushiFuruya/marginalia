# Reference ディレクトリ

このディレクトリには、プロジェクトの参考資料、分析データ、ドキュメントが整理されています。

## 📁 ディレクトリ構成

```
reference/
├── analyzed-sites/        # 参考サイトの分析データ
├── production-docs/       # 本番環境用ドキュメント
├── development-guides/    # 開発ガイド・マニュアル
└── screenshots/           # スクリーンショット
```

---

## 📊 各ディレクトリの説明

### 1. analyzed-sites/ - 参考サイト分析
参考にしたサイトの構造分析、スクレイピングデータ

**サブディレクトリ:**
- `bug-system/` - 真愛の百合は赤く染まる（参考サイト）

**用途:**
- デザイン参考
- 構造理解
- 実装のヒント

---

### 2. production-docs/ - 本番環境用ドキュメント
実装に直接使用するドキュメント

**含まれるファイル:**
- `requirements.md` - 要件定義書
- `implementation-plan.md` - 実装計画
- `walking-skeleton-flow.md` - Walking Skeleton仕様
- `production-sitemap.md` - 本番用サイトマップ
- `sitemap-visual.md` - ビジュアルサイトマップ

**用途:**
- 実装時の参照
- Issue作成の基準
- 機能仕様の確認

---

### 3. development-guides/ - 開発ガイド
開発プロセス、ツール、ベストプラクティス

**含まれるファイル:**
- `prompting-manual.md` - AIプロンプティングマニュアル
- `conversation-analysis.md` - 会話履歴の分析
- `openmemory-setup-guide.md` - OpenMemoryセットアップ
- `shared-memory-architecture.md` - 共有メモリアーキテクチャ

**用途:**
- 開発手順の確認
- AI活用方法
- プロセス改善

---

### 4. screenshots/ - スクリーンショット
参考サイトやデザイン案のスクリーンショット

**用途:**
- ビジュアルリファレンス
- デザイン比較
- プレゼンテーション

---

## 🎯 使い方

### 実装を開始する場合
1. `production-docs/requirements.md` で要件を確認
2. `production-docs/production-sitemap.md` でサイト構造を理解
3. `production-docs/implementation-plan.md` で実装手順を確認

### 参考サイトを確認する場合
1. `analyzed-sites/bug-system/sitemap.md` でサイト構造を確認
2. `screenshots/` で実際の見た目を確認

### AIに指示を出す場合
1. `development-guides/prompting-manual.md` でベストプラクティスを確認
2. 明確な指示を作成

---

## 📝 ファイル命名規則

- **分析データ**: `site-analysis-*.json`, `sitemap.md`
- **ドキュメント**: `*-plan.md`, `*-flow.md`, `requirements.md`
- **ガイド**: `*-manual.md`, `*-guide.md`, `*-architecture.md`
- **スクリーンショット**: `[サイト名]-screenshot.png`

---

## ⚠️ 注意事項

- このディレクトリのファイルは**読み取り専用**として扱ってください
- 変更が必要な場合は、バージョンを残して新しいファイルを作成
- 本番環境にデプロイする際は、このディレクトリを除外してください

---

**最終更新**: 2025-11-06
