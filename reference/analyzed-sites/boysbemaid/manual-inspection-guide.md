# Boys be maid - Chrome DevTools 手動検証ガイド

> **目的**: 実際のサイトからHTML/CSS/JavaScriptコードを抽出する
> **対象URL**: https://boysbemaid.jp/member/takashinaranto/
> **所要時間**: 約15-20分

---

## 🎯 このガイドで抽出できるもの

1. ✅ **正確なHTML構造** - 実際のDOM要素とクラス名
2. ✅ **実際のCSS** - メディアクエリ、アニメーション、レスポンシブ設定
3. ✅ **JavaScriptコード** - イベントリスナー、アニメーション処理
4. ✅ **ブレークポイント値** - 実際の幅指定
5. ✅ **アニメーションタイミング** - duration, delay, easing

---

## 📋 準備

### 必要なもの
- Google Chrome ブラウザ
- メモ帳またはテキストエディタ

### 推奨設定
```
Chrome DevTools設定:
1. F12キーでDevToolsを開く
2. 右上の⚙（設定）→ Preferences
3. ☑ Enable CSS source maps
4. ☑ Show user agent shadow DOM
```

---

## 🔍 ステップ1: メンバービジュアルのHTML抽出

### 手順

1. **サイトを開く**
   ```
   https://boysbemaid.jp/member/takashinaranto/
   ```

2. **DevToolsを開く**
   - `F12` キーを押す
   - または右クリック → "検証"

3. **Elementsタブで要素を選択**
   - 左上の要素選択ツール（矢印アイコン）をクリック
   - ページ上のキャラクター画像にマウスを合わせる
   - クリックしてDOM要素を選択

4. **HTML構造をコピー**
   ```
   選択された要素を右クリック → Copy → Copy outerHTML
   ```

5. **探すべきクラス名**
   ```html
   .member_single__visual
   .member_single__visual__ph
   .member_single__visual__ph__item
   ```

### 確認ポイント

- [ ] `data-id` 属性の値
- [ ] 画像パス（`src`属性）
- [ ] alt属性の内容
- [ ] 親要素の構造

---

## 🎨 ステップ2: CSSスタイルの抽出

### 手順

1. **Stylesタブを確認**
   - Elementsタブで要素が選択された状態で
   - 右側のStylesパネルを確認

2. **関連するCSS を探す**
   ```css
   /* 探すべきプロパティ */
   - opacity
   - transform
   - transition
   - animation
   - @keyframes
   ```

3. **メディアクエリの確認**
   - Stylesパネル上部の Device Mode切り替え
   - 画面幅を変更して適用されるCSSを確認

4. **CSSファイルを開く**
   - Stylesパネルでルールの右側に表示されるファイル名をクリック
   - 例: `main.css:234`

### CSS抽出例

```css
/* Stylesパネルに表示されているものをコピー */
.member_single__visual__ph__item {
  opacity: 0;  /* 初期状態 */
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(...);
}

.member_single__visual__ph__item.is-visible {
  opacity: 1;  /* アニメーション後 */
  transform: translateY(0);
}
```

---

## 💻 ステップ3: JavaScriptコードの抽出

### 手順

1. **Sourcesタブを開く**
   - DevToolsの"Sources"タブをクリック

2. **JavaScriptファイルを探す**
   ```
   左側のファイルツリー:
   └── wp-content
       └── themes
           └── boysbemaid
               └── assets
                   └── js
                       └── main.js (または bundle.js)
   ```

3. **検索機能を使う**
   - `Ctrl + Shift + F` (Windows) または `Cmd + Shift + F` (Mac)
   - 検索キーワード:
     ```
     member_single__visual__ph__item
     IntersectionObserver
     classList.add
     setTimeout
     ```

4. **ブレークポイントを設定**
   - 該当行の行番号をクリック
   - ページをリロードしてコードの実行を確認

### 抽出すべきコード

```javascript
// 探すべきパターン
1. Intersection Observer の設定
2. アニメーション開始のトリガー
3. classList操作（.add, .remove）
4. setTimeout / setInterval
5. イベントリスナー（scroll, resize等）
```

---

## 📱 ステップ4: レスポンシブ設定の確認

### 手順

1. **Device Modeを有効化**
   - `Ctrl + Shift + M` (Windows) または `Cmd + Shift + M` (Mac)
   - またはDevToolsの左上のデバイスアイコンをクリック

2. **ブレークポイントを確認**
   ```
   デバイス幅を手動で変更:
   - 320px (Mobile Small)
   - 375px (Mobile Medium)
   - 768px (Tablet)
   - 1024px (Desktop)
   - 1440px (Large Desktop)
   ```

3. **Stylesパネルで@media確認**
   - 各幅でStylesパネルを確認
   - 適用されている`@media`ルールをメモ

4. **Computed タブで実際の値を確認**
   - ElementsタブのComputedタブをクリック
   - width, height, padding, marginの実数値を確認

### 記録すべき情報

| 幅 | レイアウト | グリッドカラム | 特徴的なCSS |
|----|----------|--------------|------------|
| 320-767px | 1カラム | `grid-template-columns: 1fr` | パディング小 |
| 768-1023px | 2カラム | `grid-template-columns: 1fr 2fr` | 横並び開始 |
| 1024-1439px | 3カラム | `grid-template-columns: 300px 1fr 200px` | フル横並び |
| 1440px+ | 3カラム（広） | 余白増加 | max-width設定 |

---

## 🔄 ステップ5: ナビゲーション遷移の確認

### 手順

1. **Networkタブを開く**
   - DevToolsの"Network"タブをクリック
   - "Preserve log" にチェック

2. **ナビゲーションリンクをクリック**
   - "次のキャラクター"または"前のキャラクター"をクリック
   - Networkタブで通信を確認

3. **確認ポイント**
   ```
   AJAX通信の場合:
   - Type: XHR or Fetch
   - Request URL: /wp-admin/admin-ajax.php
   - Response: JSON or HTML

   通常遷移の場合:
   - Type: document
   - Full page reload
   ```

4. **Consoleタブでエラー確認**
   - 遷移時にJavaScriptエラーがないか確認

---

## 🎬 ステップ6: アニメーションの詳細確認

### 手順

1. **Animationsパネルを開く**
   - DevToolsの"..."メニュー → More tools → Animations
   - またはConsole横の"Animations"タブ

2. **ページをリロード**
   - アニメーションが記録される

3. **タイムラインを確認**
   ```
   記録すべき情報:
   - Duration (継続時間)
   - Delay (遅延)
   - Easing (イージング関数)
   - Animated properties (opacity, transform等)
   ```

4. **スローモーション再生**
   - Animationsパネル上部のスライダーで再生速度を調整
   - 25%, 10%でアニメーションを詳細確認

---

## 📝 ステップ7: 抽出データの整理

### 整理シート

```markdown
## 抽出結果サマリー

### 1. HTML構造
[ここにコピーしたHTMLを貼り付け]

### 2. CSS
[ここに関連CSSを貼り付け]

#### メディアクエリ
- Mobile: @media (max-width: XXXpx)
- Tablet: @media (min-width: XXXpx) and (max-width: XXXpx)
- Desktop: @media (min-width: XXXpx)

### 3. JavaScript
[ここに関連JavaScriptを貼り付け]

### 4. アニメーション詳細
- Duration: XXXms
- Delay: XXXms
- Easing: cubic-bezier(...)
- Properties: opacity, transform

### 5. ブレークポイント
- Mobile: 0-XXXpx
- Tablet: XXX-XXXpx
- Desktop: XXX-XXXpx
- Large: XXXpx+
```

---

## 🛠️ トラブルシューティング

### Q: CSSファイルが見つからない

**A**: minifyされている可能性があります
```
解決方法:
1. Stylesパネルから直接コピー
2. Source Mapsが有効か確認
3. bundle.css や main.min.css を探す
```

### Q: JavaScriptがminifyされて読めない

**A**: Pretty printを使用
```
手順:
1. Sourcesタブでファイルを開く
2. 左下の { } ボタンをクリック
3. フォーマットされたコードが表示される
```

### Q: アニメーションが記録されない

**A**: リロードのタイミング
```
手順:
1. Animationsパネルを先に開く
2. その状態でページをリロード
3. アニメーション発火のタイミングで記録開始
```

### Q: モバイル表示が確認できない

**A**: User Agentを変更
```
手順:
1. Device Modeで"Responsive"を選択
2. "..."メニュー → Add device type
3. "Mobile"を選択
```

---

## ✅ 抽出完了チェックリスト

### HTML
- [ ] `.member_single__visual__ph__item`の完全な構造
- [ ] `data-*`属性の確認
- [ ] 親要素・子要素の関係性

### CSS
- [ ] 初期状態のスタイル（opacity, transform）
- [ ] アニメーション後のスタイル（.is-visible等）
- [ ] transition/animationプロパティ
- [ ] 全ブレークポイントの@mediaルール
- [ ] グリッドレイアウトの設定

### JavaScript
- [ ] アニメーション開始のトリガーコード
- [ ] Intersection Observer設定（使用されている場合）
- [ ] イベントリスナー
- [ ] AJAX通信コード（ナビゲーション遷移）

### アニメーション詳細
- [ ] Duration値
- [ ] Delay値
- [ ] Easing関数
- [ ] スタッガー効果の間隔

---

## 📤 次のステップ

抽出したデータを以下のファイルに整理：

1. **extracted-html.md** - HTML構造
2. **extracted-css.md** - CSSコード
3. **extracted-js.md** - JavaScriptコード
4. **implementation-notes.md** - 実装時の注意点

これらを基に、Karin_gamesiteへの統合実装を行います。

---

## 🔗 関連ドキュメント

- [ANALYSIS-SUMMARY.md](ANALYSIS-SUMMARY.md) - 分析結果詳細
- [visual-animation.md](visual-animation.md) - アニメーション実装ガイド
- [responsive-info.md](responsive-info.md) - レスポンシブ実装ガイド

---

**所要時間**: 約15-20分
**難易度**: ★★☆☆☆（初級〜中級）
**次のアクション**: Chrome DevToolsを開いてステップ1から開始

---

**このガイドに従うことで、実際のサイトから正確なコードを抽出できます** 🔍
