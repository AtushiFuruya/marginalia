# 画像アセット編成ガイド

## ディレクトリ構造

```
assets/
└── images/
    ├── characters/     # キャラクター関連画像
    ├── story/          # ストーリーシーン画像
    ├── opening/        # オープニング動画とエフェクト
    └── main/          # メインページ背景画像
```

## 画像仕様

### 共通要件

- すべての画像は以下のレスポンシブ対応が必要:
  - デスクトップPC: 1920x1080, 1366x768
  - タブレット: 768x1024
  - スマートフォン: 375x667, 360x640
- ファイル形式: PNG（最適化済み、画像あたり最大500KB）
- パフォーマンスのための画像最適化が必須
- モダンブラウザ向けにWebP形式も用意

### ファイル命名規則

1. **キャラクター画像**
   - プレフィックス: `character_`
   - 形式: `character_[名前]_[ポーズ]_[バリエーション].png`
   - 例: `character_alice_standing_normal.png`
   - スマートフォン要件:
     - 縦表示に最適化すること
     - 縦長画面比率に対応すること

2. **ストーリーシーン画像**
   - プレフィックス: `scene_`
   - 形式: `scene_[チャプター]_[シーン番号].png`
   - 例: `scene_ch1_001.png`

3. **オープニング動画/エフェクト**
   - プレフィックス: `opening_`
   - 形式: `opening_[シーケンス番号].mp4` または `opening_[エフェクト名].png`
   - 例: `opening_001.mp4`, `opening_transition_flash.png`

4. **メインページ背景**
   - プレフィックス: `main_`
   - 形式: `main_[セクション]_[バリエーション].png`
   - 例: `main_bg_dark.png`

## メディアクエリ仕様

### デスクトップ (1920x1080, 1366x768)
```css
@media screen and (min-width: 1024px) {
    /* デスクトップ向け画像スタイル */
}
```

### タブレット (768x1024)
```css
@media screen and (min-width: 768px) and (max-width: 1023px) {
    /* タブレット向け画像スタイル */
}
```

### スマートフォン (375x667, 360x640)
```css
@media screen and (max-width: 767px) {
    /* スマートフォン向け画像スタイル */
}
```

## Image Optimization Guidelines

1. **Size Optimization**
   - Maximum file size: 500KB per image
   - Use appropriate compression tools
   - Implement lazy loading for better performance

2. **Resolution Requirements**
   - Desktop: Full resolution (1920x1080 max)
   - Tablet: Mid-resolution version
   - Mobile: Optimized smaller version

3. **Art Direction**
   - Use different crops/aspects for different screen sizes
   - Maintain focal points across all devices
   - Ensure readability of text overlays

4. **Technical Implementation**
   - Use `srcset` and `sizes` attributes for responsive images
   - Implement `picture` element for art direction
   - Use CSS `object-fit` for maintaining aspect ratios

## Usage Instructions

1. **Character Images**
   ```html
   <picture>
     <source media="(min-width: 1024px)" srcset="assets/images/characters/character_name_large.png">
     <source media="(min-width: 768px)" srcset="assets/images/characters/character_name_medium.png">
     <img src="assets/images/characters/character_name_small.png" alt="Character Name">
   </picture>
   ```

2. **Story Scenes**
   ```html
   <div class="scene-container">
     <img src="assets/images/story/scene_ch1_001.png" 
          srcset="assets/images/story/scene_ch1_001_large.png 1920w,
                  assets/images/story/scene_ch1_001_medium.png 1024w,
                  assets/images/story/scene_ch1_001_small.png 768w"
          sizes="(max-width: 767px) 100vw,
                 (max-width: 1023px) 100vw,
                 100vw"
          alt="Chapter 1 Scene 1">
   </div>
   ```

3. **Main Background**
   ```css
   .main-background {
     background-image: url('../assets/images/main/main_bg.png');
     background-size: cover;
     background-position: center;
   }

   @media (max-width: 767px) {
     .main-background {
       background-image: url('../assets/images/main/main_bg_mobile.png');
     }
   }
   ```

## Performance Considerations

1. **Lazy Loading**
   - Implement for all non-critical images
   - Use loading="lazy" attribute
   - Consider IntersectionObserver for custom implementations

2. **Caching Strategy**
   - Set appropriate cache headers
   - Use versioned file names for cache busting
   - Implement service worker for offline support

3. **Progressive Loading**
   - Use progressive JPEGs where applicable
   - Implement blur-up technique for preview images
   - Consider using WebP with fallbacks