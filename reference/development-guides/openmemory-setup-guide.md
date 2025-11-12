# OpenMemory セットアップガイド

## ✅ 完了した作業

1. **OpenMemory CLIのグローバルインストール完了**
   ```bash
   npm install -g @openmemory/install
   ```

2. **APIキーの取得完了**
   - API Key: `m0-r0Q6tu9mlIIN2FHseHc3cnZenf4atIJ0ci97WBgZ`

---

## 🔧 手動セットアップ方法

自動インストールでTTYエラーが発生したため、手動で設定する必要があります。

### Claude Desktop用の設定

#### ステップ1: 設定ファイルの場所を確認

Claude Desktopの設定ファイルは通常以下の場所にあります：

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/claude/claude_desktop_config.json
```

#### ステップ2: 設定ファイルを編集

`claude_desktop_config.json` ファイルを開いて、以下の内容を追加します：

```json
{
  "mcpServers": {
    "openmemory": {
      "command": "npx",
      "args": [
        "-y",
        "@openmemory/server"
      ],
      "env": {
        "OPENMEMORY_API_KEY": "m0-r0Q6tu9mlIIN2FHseHc3cnZenf4atIJ0ci97WBgZ"
      }
    }
  }
}
```

**既存の設定がある場合:**

既に他のMCPサーバーが設定されている場合は、`mcpServers`オブジェクトに`openmemory`セクションを追加してください：

```json
{
  "mcpServers": {
    "existing-server": {
      "command": "...",
      "args": ["..."]
    },
    "openmemory": {
      "command": "npx",
      "args": [
        "-y",
        "@openmemory/server"
      ],
      "env": {
        "OPENMEMORY_API_KEY": "m0-r0Q6tu9mlIIN2FHseHc3cnZenf4atIJ0ci97WBgZ"
      }
    }
  }
}
```

#### ステップ3: Claude Desktopを再起動

設定ファイルを保存したら、Claude Desktopアプリケーションを完全に終了し、再起動してください。

---

## 🔍 Claude Code (VSCode Extension) 用の設定

VSCode拡張機能版のClaude Codeを使用している場合：

### 方法1: VSCode設定ファイル

1. VSCodeの設定を開く（`Cmd/Ctrl + ,`）
2. 「MCP Servers」を検索
3. 以下の設定を追加：

```json
{
  "claude-code.mcpServers": {
    "openmemory": {
      "command": "npx",
      "args": ["-y", "@openmemory/server"],
      "env": {
        "OPENMEMORY_API_KEY": "m0-r0Q6tu9mlIIN2FHseHc3cnZenf4atIJ0ci97WBgZ"
      }
    }
  }
}
```

### 方法2: ワークスペース設定

プロジェクトの `.vscode/settings.json` に追加：

```json
{
  "claude-code.mcpServers": {
    "openmemory": {
      "command": "npx",
      "args": ["-y", "@openmemory/server"],
      "env": {
        "OPENMEMORY_API_KEY": "m0-r0Q6tu9mlIIN2FHseHc3cnZenf4atIJ0ci97WBgZ"
      }
    }
  }
}
```

---

## ✅ 動作確認

セットアップ完了後、以下の方法で動作を確認できます：

### 1. MCPサーバーの状態確認

Claude Code/Desktopで新しい会話を開始し、以下を確認：
- MCPサーバーのステータスインジケーターが表示されるか
- OpenMemoryが「接続済み」と表示されるか

### 2. メモリ機能のテスト

Claudeに以下のように尋ねてみてください：

```
「私の名前は〇〇です。これを覚えておいてください」
```

その後、新しい会話で：

```
「私の名前を覚えていますか？」
```

OpenMemoryが正しく動作していれば、以前の会話を記憶しているはずです。

---

## 🔧 トラブルシューティング

### エラー: "Command not found: npx"

Node.jsがインストールされていない可能性があります：

```bash
# Node.jsのインストール確認
node --version
npm --version

# インストールされていない場合
brew install node  # macOS
```

### エラー: "Module not found: @openmemory/server"

サーバーパッケージを手動でインストール：

```bash
npm install -g @openmemory/server
```

その後、設定ファイルの `command` を以下に変更：

```json
{
  "command": "openmemory-server",
  "args": []
}
```

### MCPサーバーが起動しない

1. Claude Desktop/Codeを完全に再起動
2. 設定ファイルのJSON構文が正しいか確認（カンマ、括弧の位置）
3. APIキーが正しいか確認

---

## 📚 参考リンク

- **OpenMemory公式ドキュメント**: https://docs.mem0.ai/openmemory/
- **OpenMemoryダッシュボード**: https://app.openmemory.dev
- **GitHub**: https://github.com/mem0ai/mem0

---

## 🎯 次のステップ

1. 上記の手動セットアップ手順に従って設定ファイルを編集
2. Claude Desktop/Codeを再起動
3. メモリ機能をテスト
4. 問題があれば、エラーメッセージを共有してください

---

**APIキーは安全に保管してください。このキーは外部に共有しないでください。**
