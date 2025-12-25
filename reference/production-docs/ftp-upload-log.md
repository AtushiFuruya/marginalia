# FTP Upload Log

- **Date (UTC)**: 2025-12-17 09:24:24
  - **Host**: sv6103.wpx.ne.jp
  - **User**: wp700713
  - **Command**: `lftp -u wp700713,<user-supplied-password> sv6103.wpx.ne.jp` + `mirror --reverse --delete --verbose . /home/wp700713/marginalia-108.com/public_html`
  - **Local source**: `public/`
  - **Remote target**: `/home/wp700713/marginalia-108.com/public_html/`
- **Mode**: passive FTP
- **Result**: Upload completed; warning `chmod: Access failed: 550 ./background: No such file or directory (./background )` due to a directory name with a trailing space (`images/background `). Files still transferred.

- **Date (UTC)**: 2025-12-17 09:28:26
  - **Host**: sv6103.wpx.ne.jp
  - **User**: wp700713
  - **Command**: `lftp -u wp700713,<user-supplied-password> sv6103.wpx.ne.jp` + `mirror --reverse --delete --verbose . /home/wp700713/marginalia-108.com/public_html`
  - **Local source**: `public/` (macOS `.DS_Store` removed locally before sync)
  - **Remote target**: `/home/wp700713/marginalia-108.com/public_html/`
  - **Mode**: passive FTP
  - **Result**: Re-upload and remote cleanup completed (`--delete` removed stale files including remote `.DS_Store`). Same warning remains: `chmod: Access failed: 550 ./background: No such file or directory (./background )` because of the trailing-space directory name `images/background `. Transfer otherwise successful.

- **Date (UTC)**: 2025-12-17 09:31:04
  - **Host**: sv6103.wpx.ne.jp
  - **User**: wp700713
  - **Command**: `mirror --reverse --delete /tmp/empty .` (after `cd /home/wp700713/marginalia-108.com/public_html`) to fully clear remote
  - **Local source**: `/tmp/empty` (empty dir)
  - **Remote target**: `/home/wp700713/marginalia-108.com/public_html/`
  - **Mode**: passive FTP
  - **Result**: Remote public_html cleaned (only `.` and `..` remain).

- **Date (UTC)**: 2025-12-17 09:37:14
  - **Host**: sv6103.wpx.ne.jp
  - **User**: wp700713
  - **Command**: `mirror --reverse --delete /Users/furuyaatsushi/Documents/Karin_gamesite/public .` (after `cd /home/wp700713/marginalia-108.com/public_html`)
  - **Local source**: `/Users/furuyaatsushi/Documents/Karin_gamesite/public` (with `.DS_Store` removed locally)
  - **Remote target**: `/home/wp700713/marginalia-108.com/public_html/`
- **Mode**: passive FTP
- **Result**: Full site uploaded and old files removed. Warning persists: `chmod: Access failed: 550 ./background: No such file or directory (./background )` due to trailing-space directory `images/background `. Files transferred.

- **Date (UTC)**: 2025-12-25 01:32
  - **Host**: sv6103.wpx.ne.jp
  - **User**: wp700713
  - **Command**: `mirror --reverse --delete --verbose /tmp/empty .` (after `cd /home/wp700713/marginalia-108.com/public_html`)
  - **Local source**: `/tmp/empty` (empty dir)
  - **Remote target**: `/home/wp700713/marginalia-108.com/public_html/` *(旧・誤ったドキュメントルート。整理のため空に初期化)*
  - **Mode**: passive FTP
  - **Result**: 旧ディレクトリを空に初期化し、以後は使用しない前提に変更。

- **Date (UTC)**: 2025-12-25 01:35
  - **Host**: sv6103.wpx.ne.jp
  - **User**: wp700713
  - **Command**: `mirror --reverse --delete --no-perms --verbose /Users/furuyaatsushi/Documents/Karin_gamesite/public .` (after `cd /marginalia-108.com/public_html`)
  - **Local source**: `/Users/furuyaatsushi/Documents/Karin_gamesite/public` ( `.DS_Store` 除外)
  - **Remote target**: `/marginalia-108.com/public_html/` *(本番配信に使用する正しいドキュメントルート)*
  - **Mode**: passive FTP
  - **Result**: サイト一式を正しいドキュメントルートに再デプロイ。`.htaccess` で HTML に no-cache ヘッダを付与。キャッシュバスター付きで CSS を参照。
