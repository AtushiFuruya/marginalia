# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Preference

**IMPORTANT**: Always respond in Japanese (日本語) regardless of the language used in the user's question. This is the default communication language for this project.

## Response Guidelines

- 回答はユーザーの依頼に必要な情報のみを満たす最小限の内容に留め、不要な選択肢やオプションを付与しないこと。
- 明示的な指示が無い限り、どの言語で質問されても説明は必ず日本語で行うこと。
- 不明点・曖昧な点・多義的な指示がある場合は必ず作業前にユーザーへ確認し、明確な指針を得るまで着手しないこと。
- UI/CSS など表示に関する作業では、Google DevTools で実際に要素を検証し（必要に応じてスクリーンショット取得を含む）確認したうえで対応内容を決定すること。
- CSS/JS 修正時は DevTools で描画確認 → 必要ならスクショ添付 → 報告までを一連のセットとして実施すること。
- 変更対象を小さなステップに分解し、それぞれテスト（ブラウザ確認・ロジック確認等）してから次のステップに進むこと。
- 仕様変更や新しい要件を受けたら、作業着手前に端的な要約を提示し、自分が理解した内容をユーザーと共有してから実装すること。

## Work Process Guidelines

各作業工程において、以下のステップを必ず含めること：

1. **指示内容の理解確認**: ユーザーの依頼内容を正確に理解したことを簡潔に確認
2. **セルフチェック**: 作業を正しく実行できるか、必要な情報が揃っているかを確認
3. **不明点の質問（必須）**: 以下の場合は**必ず**作業前にユーザーに質問すること
   - 指示内容に不明点がある場合
   - 指示内容に曖昧な表現がある場合
   - 複数の解釈が可能な多義的な指示の場合
   - 前提条件や制約が明示されていない場合
4. **作業実行**: 上記が完了し、指示内容が完全に明確になってから実際の作業を開始

## Repository Overview

This is an asset repository for a game/website project called "Karin_gamesite". The repository contains visual assets including character artwork, background images, and video elements.

## Repository Structure

```
HP素材集/          # Main assets directory
  ├── Character artwork (PNG files)
  ├── Scene/background images (JPG files)
  ├── Logo and main visuals
  └── Video assets (MP4 files)
```

## Asset Categories

**Character Assets:**
- Character portraits and sprites (イレーヌ.png, マリィ.png, クリスタ.png, ポーリン.png, etc.)
- Character designs for グルマン, 司教長, 異端審問官ギース

**Scene Assets:**
- Background images (大聖堂 - cathedral scenes in different lighting conditions)
- Event CG and scene illustrations

**Branding:**
- Logo variations (ロゴ改変 2.png)
- Main visual/key art (メインビジュアル01.jpg, メインビジュアル002 2.png)

**Video Assets:**
- Animation files (扉動き 2.mp4 - door animation)

## Working with Assets

This repository contains only asset files with no build system or development tooling. When working with these assets:

1. All assets are located in the `HP素材集/` directory
2. Image formats are PNG (for transparency-enabled assets) and JPG (for backgrounds and photos)
3. File names use Japanese characters - ensure proper encoding support when scripting
4. Assets appear to be for a visual novel or similar narrative game project

## Notes

- This is an asset-only repository with no source code
- No version control history is present (not a git repository)
- Consider adding source code structure if this project expands to include HTML/JS/CSS or game engine code
