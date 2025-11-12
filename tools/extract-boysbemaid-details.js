/**
 * Boys be maid メンバーセクション詳細サイズ抽出
 *
 * 抽出項目:
 * - レスポンシブ時の画像サイズ
 * - 線の太さ（border-width）
 * - border-radius値
 * - セクションサイズ
 * - 背景色（彩度含む）
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function extractDetailedSizing() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1024, height: 768 },
    { name: 'Large', width: 1440, height: 900 }
  ];

  const results = {
    timestamp: new Date().toISOString(),
    url: 'https://boysbemaid.jp/',
    measurements: []
  };

  let page = null;

  for (const viewport of viewports) {
    console.log(`\n📐 測定中: ${viewport.name} (${viewport.width}x${viewport.height})`);

    try {
      if (page && !page.isClosed()) {
        await page.close().catch(() => {});
      }
      page = await browser.newPage();
      await page.setViewport(viewport);

      await page.goto('https://boysbemaid.jp/', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // メンバーセクションまでスクロール
      await page.evaluate(() => {
        const section = document.querySelector('section.member, section#member');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // メンバーセクションの測定
      const measurements = await page.evaluate(() => {
        const section = document.querySelector('section.member, section#member');
        if (!section) return null;

        // セクション全体のサイズ
        const sectionRect = section.getBoundingClientRect();
        const sectionStyles = window.getComputedStyle(section);

        // 個別スライド要素を探す（より広範なセレクタ）
        const slides = Array.from(section.querySelectorAll(
          '[class*="slide"], [class*="item"], [class*="card"], [class*="member"], a, figure'
        )).filter(el => {
          const img = el.querySelector('img');
          return img && img.offsetWidth > 0;
        });

        let slideData = null;
        if (slides.length > 0) {
          const firstSlide = slides[0];
          const slideRect = firstSlide.getBoundingClientRect();
          const slideStyles = window.getComputedStyle(firstSlide);

          // 画像要素を探す（最初の表示されている画像）
          const image = firstSlide.querySelector('img');
          let imageData = null;

          if (image && image.offsetWidth > 0) {
            const imageRect = image.getBoundingClientRect();
            const imageStyles = window.getComputedStyle(image);
            const parentStyles = window.getComputedStyle(image.parentElement);

            imageData = {
              width: Math.round(imageRect.width),
              height: Math.round(imageRect.height),
              borderRadius: imageStyles.borderRadius,
              borderWidth: imageStyles.borderWidth,
              borderColor: imageStyles.borderColor,
              borderStyle: imageStyles.borderStyle,
              aspectRatio: (imageRect.width / imageRect.height).toFixed(3),
              // 親要素のborder-radiusもチェック（楕円クリッピングの可能性）
              parentBorderRadius: parentStyles.borderRadius,
              parentBackgroundColor: parentStyles.backgroundColor
            };
          }

          slideData = {
            width: Math.round(slideRect.width),
            height: Math.round(slideRect.height),
            padding: slideStyles.padding,
            margin: slideStyles.margin,
            backgroundColor: slideStyles.backgroundColor,
            image: imageData
          };
        }

        // テキスト要素（名前、CV）のサイズ
        const nameElement = section.querySelector('[class*="name"], h3, h2');
        let textData = null;

        if (nameElement) {
          const nameStyles = window.getComputedStyle(nameElement);
          textData = {
            fontSize: nameStyles.fontSize,
            lineHeight: nameStyles.lineHeight,
            fontWeight: nameStyles.fontWeight,
            color: nameStyles.color,
            writingMode: nameStyles.writingMode
          };
        }

        return {
          section: {
            width: Math.round(sectionRect.width),
            height: Math.round(sectionRect.height),
            padding: sectionStyles.padding,
            paddingTop: sectionStyles.paddingTop,
            paddingBottom: sectionStyles.paddingBottom,
            backgroundColor: sectionStyles.backgroundColor,
            maxWidth: sectionStyles.maxWidth
          },
          slide: slideData,
          text: textData,
          slideCount: slides.length
        };
      });

      if (measurements) {
        results.measurements.push({
          viewport: viewport.name,
          width: viewport.width,
          height: viewport.height,
          data: measurements
        });

        console.log(`✅ ${viewport.name}: 測定完了`);
        console.log(`   セクション幅: ${measurements.section.width}px`);
        if (measurements.slide && measurements.slide.image) {
          console.log(`   画像サイズ: ${measurements.slide.image.width}x${measurements.slide.image.height}px`);
          console.log(`   border-radius: ${measurements.slide.image.borderRadius}`);
          console.log(`   border-width: ${measurements.slide.image.borderWidth}`);
        }
      }

      // スクリーンショット
      const screenshotPath = path.join(__dirname, `screenshots/boysbemaid-${viewport.name.toLowerCase()}.png`);
      await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
      await page.screenshot({ path: screenshotPath, fullPage: false });

    } catch (error) {
      console.error(`❌ ${viewport.name} エラー:`, error.message);
    }
  }

  if (page && !page.isClosed()) {
    await page.close().catch(() => {});
  }

  await browser.close();

  // 結果をJSONで保存
  const reportPath = path.join(__dirname, 'boysbemaid-sizing-report.json');
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 レポート保存: ${reportPath}`);

  // Markdownレポート生成
  await generateMarkdownReport(results);

  return results;
}

async function generateMarkdownReport(results) {
  let md = `# Boys be maid メンバーセクション - 詳細サイズ測定レポート

**測定日時**: ${new Date(results.timestamp).toLocaleString('ja-JP')}
**対象URL**: ${results.url}

---

## 📊 レスポンシブ別測定結果

`;

  results.measurements.forEach(m => {
    md += `### ${m.viewport} (${m.width}x${m.height}px)

#### セクション全体
- **幅**: ${m.data.section.width}px
- **高さ**: ${m.data.section.height}px
- **padding**: ${m.data.section.padding}
- **max-width**: ${m.data.section.maxWidth}
- **背景色**: ${m.data.section.backgroundColor}

`;

    if (m.data.slide) {
      md += `#### 個別スライド
- **幅**: ${m.data.slide.width}px
- **高さ**: ${m.data.slide.height}px
- **padding**: ${m.data.slide.padding}
- **margin**: ${m.data.slide.margin}
- **背景色**: ${m.data.slide.backgroundColor}

`;

      if (m.data.slide.image) {
        md += `#### 画像
- **幅**: ${m.data.slide.image.width}px
- **高さ**: ${m.data.slide.image.height}px
- **アスペクト比**: ${m.data.slide.image.aspectRatio}
- **border-radius**: ${m.data.slide.image.borderRadius}
- **border-width**: ${m.data.slide.image.borderWidth}
- **border-color**: ${m.data.slide.image.borderColor}
- **border-style**: ${m.data.slide.image.borderStyle}
- **親要素のborder-radius**: ${m.data.slide.image.parentBorderRadius}
- **親要素の背景色**: ${m.data.slide.image.parentBackgroundColor}

`;
      }
    }

    if (m.data.text) {
      md += `#### テキスト（名前）
- **font-size**: ${m.data.text.fontSize}
- **line-height**: ${m.data.text.lineHeight}
- **font-weight**: ${m.data.text.fontWeight}
- **color**: ${m.data.text.color}
- **writing-mode**: ${m.data.text.writingMode}

`;
    }

    md += `---

`;
  });

  md += `## 📐 比較表

| 項目 | Mobile (375px) | Tablet (768px) | Desktop (1024px) | Large (1440px) |
|------|---------------|---------------|-----------------|---------------|
`;

  const getValue = (viewport, path) => {
    const m = results.measurements.find(m => m.viewport === viewport);
    if (!m) return 'N/A';

    const parts = path.split('.');
    let value = m.data;
    for (const part of parts) {
      value = value?.[part];
    }
    return value || 'N/A';
  };

  const items = [
    { label: 'セクション幅', path: 'section.width' },
    { label: '画像幅', path: 'slide.image.width' },
    { label: '画像高さ', path: 'slide.image.height' },
    { label: 'border-radius', path: 'slide.image.borderRadius' },
    { label: 'border-width', path: 'slide.image.borderWidth' },
    { label: 'フォントサイズ', path: 'text.fontSize' }
  ];

  items.forEach(item => {
    const mobile = getValue('Mobile', item.path);
    const tablet = getValue('Tablet', item.path);
    const desktop = getValue('Desktop', item.path);
    const large = getValue('Large', item.path);

    md += `| ${item.label} | ${mobile} | ${tablet} | ${desktop} | ${large} |\n`;
  });

  md += `
---

**測定完了**: ${new Date().toLocaleString('ja-JP')}
`;

  const reportPath = path.join(__dirname, 'BOYSBEMAID-SIZING-REPORT.md');
  await fs.writeFile(reportPath, md);
  console.log(`📄 Markdownレポート: ${reportPath}`);
}

// 実行
extractDetailedSizing().catch(console.error);
