/**
 * Boys be maid メンバーセクション手動詳細抽出
 *
 * スクリーンショットで確認した要素を手動で抽出
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function manualExtraction() {
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

      await new Promise(resolve => setTimeout(resolve, 2000));

      // DOM構造を詳細に調査
      const measurements = await page.evaluate(() => {
        const section = document.querySelector('section.member, section#member');
        if (!section) return null;

        const sectionRect = section.getBoundingClientRect();
        const sectionStyles = window.getComputedStyle(section);

        // すべてのリンクとa要素を取得
        const allLinks = Array.from(section.querySelectorAll('a'));

        // 画像を含むリンクのみをフィルタ
        const imageLinks = allLinks.filter(link => {
          const img = link.querySelector('img');
          return img && img.complete && img.naturalWidth > 0;
        });

        console.log('Found image links:', imageLinks.length);

        let characterData = null;
        if (imageLinks.length > 0) {
          const firstLink = imageLinks[0];
          const linkRect = firstLink.getBoundingClientRect();
          const linkStyles = window.getComputedStyle(firstLink);

          const img = firstLink.querySelector('img');
          const imgRect = img.getBoundingClientRect();
          const imgStyles = window.getComputedStyle(img);

          // 親要素（画像のコンテナ）を探す
          let imageContainer = img.parentElement;
          while (imageContainer && imageContainer !== firstLink) {
            const containerStyles = window.getComputedStyle(imageContainer);
            if (containerStyles.borderRadius !== '0px' ||
                containerStyles.overflow === 'hidden' ||
                containerStyles.clipPath !== 'none') {
              break;
            }
            imageContainer = imageContainer.parentElement;
          }

          const containerStyles = imageContainer ? window.getComputedStyle(imageContainer) : null;
          const containerRect = imageContainer ? imageContainer.getBoundingClientRect() : null;

          // テキスト要素を探す
          const nameElement = firstLink.querySelector('[class*="name"], h3, h4, span');
          const nameStyles = nameElement ? window.getComputedStyle(nameElement) : null;

          characterData = {
            link: {
              width: Math.round(linkRect.width),
              height: Math.round(linkRect.height),
              padding: linkStyles.padding,
              margin: linkStyles.margin,
              backgroundColor: linkStyles.backgroundColor,
              transform: linkStyles.transform,
              transition: linkStyles.transition
            },
            imageContainer: containerRect ? {
              width: Math.round(containerRect.width),
              height: Math.round(containerRect.height),
              borderRadius: containerStyles.borderRadius,
              overflow: containerStyles.overflow,
              clipPath: containerStyles.clipPath,
              backgroundColor: containerStyles.backgroundColor,
              aspectRatio: (containerRect.width / containerRect.height).toFixed(3)
            } : null,
            image: {
              width: Math.round(imgRect.width),
              height: Math.round(imgRect.height),
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              objectFit: imgStyles.objectFit,
              aspectRatio: (imgRect.width / imgRect.height).toFixed(3)
            },
            text: nameStyles ? {
              content: nameElement.textContent.trim(),
              fontSize: nameStyles.fontSize,
              lineHeight: nameStyles.lineHeight,
              fontWeight: nameStyles.fontWeight,
              color: nameStyles.color,
              writingMode: nameStyles.writingMode,
              textOrientation: nameStyles.textOrientation
            } : null,
            totalLinks: imageLinks.length
          };
        }

        // ギャップやスペーシングを測定
        let gapData = null;
        if (imageLinks.length >= 2) {
          const first = imageLinks[0].getBoundingClientRect();
          const second = imageLinks[1].getBoundingClientRect();
          gapData = {
            horizontalGap: Math.round(second.left - first.right),
            verticalGap: Math.round(second.top - first.bottom)
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
          character: characterData,
          gap: gapData
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
        if (measurements.character) {
          console.log(`   リンク数: ${measurements.character.totalLinks}`);
          if (measurements.character.imageContainer) {
            console.log(`   コンテナサイズ: ${measurements.character.imageContainer.width}x${measurements.character.imageContainer.height}px`);
            console.log(`   border-radius: ${measurements.character.imageContainer.borderRadius}`);
          }
          console.log(`   画像サイズ: ${measurements.character.image.width}x${measurements.character.image.height}px`);
        }
      }

      // スクリーンショット
      const screenshotPath = path.join(__dirname, `screenshots/boysbemaid-manual-${viewport.name.toLowerCase()}.png`);
      await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
      await page.screenshot({ path: screenshotPath, fullPage: false });

    } catch (error) {
      console.error(`❌ ${viewport.name} エラー:`, error.message);
      console.error(error.stack);
    }
  }

  if (page && !page.isClosed()) {
    await page.close().catch(() => {});
  }

  await browser.close();

  // 結果をJSONで保存
  const reportPath = path.join(__dirname, 'boysbemaid-manual-report.json');
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 レポート保存: ${reportPath}`);

  // Markdownレポート生成
  await generateMarkdownReport(results);

  return results;
}

async function generateMarkdownReport(results) {
  let md = `# Boys be maid メンバーセクション - 手動詳細測定レポート

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

    if (m.data.character) {
      md += `#### キャラクターリンク全体
- **表示数**: ${m.data.character.totalLinks}個
- **幅**: ${m.data.character.link.width}px
- **高さ**: ${m.data.character.link.height}px
- **padding**: ${m.data.character.link.padding}
- **margin**: ${m.data.character.link.margin}
- **背景色**: ${m.data.character.link.backgroundColor}
- **transition**: ${m.data.character.link.transition}

`;

      if (m.data.character.imageContainer) {
        md += `#### 画像コンテナ（楕円クリッピング）
- **幅**: ${m.data.character.imageContainer.width}px
- **高さ**: ${m.data.character.imageContainer.height}px
- **アスペクト比**: ${m.data.character.imageContainer.aspectRatio}
- **border-radius**: ${m.data.character.imageContainer.borderRadius}
- **overflow**: ${m.data.character.imageContainer.overflow}
- **clip-path**: ${m.data.character.imageContainer.clipPath}
- **背景色**: ${m.data.character.imageContainer.backgroundColor}

`;
      }

      md += `#### 画像
- **表示サイズ**: ${m.data.character.image.width}x${m.data.character.image.height}px
- **元画像サイズ**: ${m.data.character.image.naturalWidth}x${m.data.character.image.naturalHeight}px
- **アスペクト比**: ${m.data.character.image.aspectRatio}
- **object-fit**: ${m.data.character.image.objectFit}

`;

      if (m.data.character.text) {
        md += `#### テキスト（キャラクター名）
- **内容**: "${m.data.character.text.content}"
- **font-size**: ${m.data.character.text.fontSize}
- **line-height**: ${m.data.character.text.lineHeight}
- **font-weight**: ${m.data.character.text.fontWeight}
- **color**: ${m.data.character.text.color}
- **writing-mode**: ${m.data.character.text.writingMode}
- **text-orientation**: ${m.data.character.text.textOrientation}

`;
      }
    }

    if (m.data.gap) {
      md += `#### スペーシング
- **水平ギャップ**: ${m.data.gap.horizontalGap}px
- **垂直ギャップ**: ${m.data.gap.verticalGap}px

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
    return value ?? 'N/A';
  };

  const items = [
    { label: 'セクション幅', path: 'section.width' },
    { label: 'コンテナ幅', path: 'character.imageContainer.width' },
    { label: 'コンテナ高さ', path: 'character.imageContainer.height' },
    { label: 'border-radius', path: 'character.imageContainer.borderRadius' },
    { label: '画像幅', path: 'character.image.width' },
    { label: '画像高さ', path: 'character.image.height' },
    { label: 'フォントサイズ', path: 'character.text.fontSize' },
    { label: 'writing-mode', path: 'character.text.writingMode' }
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

## 🎯 重要な発見

### 楕円形クリッピング
画像コンテナのborder-radiusプロパティにより、キャラクター画像が楕円形にクリップされています。

### 背景色の彩度
ホバー時の背景色変化については、transition プロパティを確認してください。

### テキストの向き
キャラクター名のwriting-modeプロパティで縦書き・横書きが制御されています。
`;

  const reportPath = path.join(__dirname, 'BOYSBEMAID-MANUAL-REPORT.md');
  await fs.writeFile(reportPath, md);
  console.log(`📄 Markdownレポート: ${reportPath}`);
}

// 実行
manualExtraction().catch(console.error);
