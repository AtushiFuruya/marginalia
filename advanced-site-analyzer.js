#!/usr/bin/env node
/**
 * Advanced Site Analyzer using Puppeteer (Chrome DevTools)
 * Extracts complete website structure, HTML, CSS, JavaScript, and assets
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class AdvancedSiteAnalyzer {
  constructor(url, outputDir = './reference') {
    this.url = url;
    this.outputDir = outputDir;
    this.siteData = {
      url: url,
      analyzedAt: new Date().toISOString(),
      structure: {},
      html: '',
      css: [],
      javascript: [],
      images: [],
      fonts: [],
      videos: [],
      links: [],
      metadata: {},
      performance: {},
      domStructure: [],
      styles: {},
      scripts: []
    };
  }

  async analyze() {
    console.log('🚀 Starting advanced site analysis...\n');
    console.log(`🔍 Target URL: ${this.url}\n`);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--ignore-certificate-errors'
      ]
    });

    try {
      const page = await browser.newPage();

      // Enable request interception to capture resources
      await page.setRequestInterception(true);

      const resources = {
        css: [],
        js: [],
        images: [],
        fonts: [],
        videos: []
      };

      page.on('request', request => {
        const resourceType = request.resourceType();
        const url = request.url();

        if (resourceType === 'stylesheet') resources.css.push(url);
        if (resourceType === 'script') resources.js.push(url);
        if (resourceType === 'image') resources.images.push(url);
        if (resourceType === 'font') resources.fonts.push(url);
        if (resourceType === 'media') resources.videos.push(url);

        request.continue();
      });

      console.log('📄 Loading page...');
      await page.goto(this.url, { waitUntil: 'networkidle2', timeout: 60000 });
      console.log('✅ Page loaded\n');

      // Extract HTML
      console.log('📝 Extracting HTML...');
      this.siteData.html = await page.content();

      // Extract metadata
      console.log('🏷️  Extracting metadata...');
      this.siteData.metadata = await page.evaluate(() => {
        const getMeta = (name) => {
          const element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
          return element ? element.getAttribute('content') : null;
        };

        return {
          title: document.title,
          description: getMeta('description'),
          keywords: getMeta('keywords'),
          ogTitle: getMeta('og:title'),
          ogDescription: getMeta('og:description'),
          ogImage: getMeta('og:image'),
          charset: document.characterSet,
          language: document.documentElement.lang
        };
      });

      // Extract DOM structure
      console.log('🌳 Extracting DOM structure...');
      this.siteData.domStructure = await page.evaluate(() => {
        const analyzeElement = (element, depth = 0) => {
          if (depth > 10) return null; // Limit depth

          return {
            tag: element.tagName.toLowerCase(),
            id: element.id || null,
            classes: Array.from(element.classList),
            attributes: Array.from(element.attributes).reduce((acc, attr) => {
              acc[attr.name] = attr.value;
              return acc;
            }, {}),
            textContent: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3
              ? element.textContent.trim().substring(0, 100)
              : null,
            children: Array.from(element.children)
              .map(child => analyzeElement(child, depth + 1))
              .filter(Boolean)
          };
        };

        return analyzeElement(document.body);
      });

      // Extract all links
      console.log('🔗 Extracting links...');
      this.siteData.links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(link => ({
          href: link.href,
          text: link.textContent.trim(),
          title: link.title || null,
          target: link.target || null
        }));
      });

      // Extract computed styles for key elements
      console.log('🎨 Extracting styles...');
      this.siteData.styles = await page.evaluate(() => {
        const elements = document.querySelectorAll('body, header, nav, main, footer, .container, #main');
        const styles = {};

        elements.forEach(el => {
          const selector = el.id ? `#${el.id}` : el.className ? `.${Array.from(el.classList)[0]}` : el.tagName.toLowerCase();
          const computed = window.getComputedStyle(el);

          styles[selector] = {
            display: computed.display,
            position: computed.position,
            width: computed.width,
            height: computed.height,
            backgroundColor: computed.backgroundColor,
            color: computed.color,
            fontSize: computed.fontSize,
            fontFamily: computed.fontFamily,
            margin: computed.margin,
            padding: computed.padding,
            border: computed.border
          };
        });

        return styles;
      });

      // Extract inline and external scripts
      console.log('⚙️  Extracting scripts...');
      this.siteData.scripts = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('script')).map(script => ({
          src: script.src || null,
          inline: !script.src,
          type: script.type || 'text/javascript',
          async: script.async,
          defer: script.defer,
          content: !script.src ? script.textContent.substring(0, 500) : null
        }));
      });

      // Capture screenshot
      console.log('📸 Taking screenshot...');
      await page.screenshot({
        path: path.join(this.outputDir, 'site-screenshot.png'),
        fullPage: true
      });

      // Get performance metrics
      console.log('⚡ Gathering performance metrics...');
      this.siteData.performance = await page.evaluate(() => {
        const perf = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
          loadComplete: perf.loadEventEnd - perf.loadEventStart,
          domInteractive: perf.domInteractive,
          transferSize: perf.transferSize,
          encodedBodySize: perf.encodedBodySize,
          decodedBodySize: perf.decodedBodySize
        };
      });

      // Store captured resources
      this.siteData.css = resources.css;
      this.siteData.javascript = resources.js;
      this.siteData.images = resources.images;
      this.siteData.fonts = resources.fonts;
      this.siteData.videos = resources.videos;

      console.log('\n✅ Analysis complete!\n');

    } catch (error) {
      console.error('❌ Error during analysis:', error.message);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async generateMarkdownReport() {
    console.log('📄 Generating Markdown report...\n');

    const md = `# サイト構造分析レポート

## 基本情報

- **URL**: ${this.url}
- **分析日時**: ${this.siteData.analyzedAt}
- **ページタイトル**: ${this.siteData.metadata.title || 'N/A'}

---

## メタデータ

- **説明**: ${this.siteData.metadata.description || 'なし'}
- **キーワード**: ${this.siteData.metadata.keywords || 'なし'}
- **文字コード**: ${this.siteData.metadata.charset}
- **言語**: ${this.siteData.metadata.language || '未設定'}

### OGP (Open Graph Protocol)
- **og:title**: ${this.siteData.metadata.ogTitle || 'なし'}
- **og:description**: ${this.siteData.metadata.ogDescription || 'なし'}
- **og:image**: ${this.siteData.metadata.ogImage || 'なし'}

---

## リソース構成

### CSSファイル (${this.siteData.css.length}個)
${this.siteData.css.length > 0 ? this.siteData.css.map(css => `- ${css}`).join('\n') : '- なし'}

### JavaScriptファイル (${this.siteData.javascript.length}個)
${this.siteData.javascript.length > 0 ? this.siteData.javascript.map(js => `- ${js}`).join('\n') : '- なし'}

### 画像ファイル (${this.siteData.images.length}個)
${this.siteData.images.slice(0, 10).map(img => `- ${img}`).join('\n')}
${this.siteData.images.length > 10 ? `\n... 他 ${this.siteData.images.length - 10}個` : ''}

### 動画ファイル (${this.siteData.videos.length}個)
${this.siteData.videos.length > 0 ? this.siteData.videos.map(vid => `- ${vid}`).join('\n') : '- なし'}

### フォントファイル (${this.siteData.fonts.length}個)
${this.siteData.fonts.length > 0 ? this.siteData.fonts.map(font => `- ${font}`).join('\n') : '- なし'}

---

## DOM構造

### ボディ構造
\`\`\`
${this.formatDOMTree(this.siteData.domStructure, 0)}
\`\`\`

---

## リンク構造 (${this.siteData.links.length}個)

### 内部リンク
${this.siteData.links.filter(link => link.href.includes(new URL(this.url).hostname)).slice(0, 20).map(link =>
  `- [${link.text || 'リンク'}](${link.href})`
).join('\n')}

### 外部リンク
${this.siteData.links.filter(link => !link.href.includes(new URL(this.url).hostname) && link.href.startsWith('http')).slice(0, 10).map(link =>
  `- [${link.text || '外部リンク'}](${link.href})`
).join('\n')}

---

## スタイル情報

### 主要要素のスタイル
${Object.entries(this.siteData.styles).map(([selector, styles]) => `
#### ${selector}
- **表示**: ${styles.display}
- **位置**: ${styles.position}
- **サイズ**: ${styles.width} × ${styles.height}
- **背景色**: ${styles.backgroundColor}
- **文字色**: ${styles.color}
- **フォント**: ${styles.fontFamily} (${styles.fontSize})
`).join('\n')}

---

## スクリプト情報

### 外部スクリプト
${this.siteData.scripts.filter(s => s.src).map(script =>
  `- ${script.src} ${script.async ? '(async)' : ''} ${script.defer ? '(defer)' : ''}`
).join('\n') || '- なし'}

### インラインスクリプト (${this.siteData.scripts.filter(s => s.inline).length}個)

---

## パフォーマンス

- **DOM構築時間**: ${this.siteData.performance.domContentLoaded?.toFixed(2) || 'N/A'} ms
- **ページ読み込み時間**: ${this.siteData.performance.loadComplete?.toFixed(2) || 'N/A'} ms
- **転送サイズ**: ${(this.siteData.performance.transferSize / 1024).toFixed(2) || 'N/A'} KB
- **デコード後サイズ**: ${(this.siteData.performance.decodedBodySize / 1024).toFixed(2) || 'N/A'} KB

---

## スクリーンショット

![サイトスクリーンショット](./site-screenshot.png)

---

## HTMLソース

HTMLの全文は \`site-source.html\` に保存されています。

---

**分析ツール**: Advanced Site Analyzer (Puppeteer + Chrome DevTools)
`;

    return md;
  }

  formatDOMTree(node, depth = 0) {
    if (!node) return '';

    const indent = '  '.repeat(depth);
    let result = `${indent}<${node.tag}`;

    if (node.id) result += ` id="${node.id}"`;
    if (node.classes.length > 0) result += ` class="${node.classes.join(' ')}"`;

    result += '>';

    if (node.textContent) {
      result += ` ${node.textContent}`;
    }

    if (node.children && node.children.length > 0 && depth < 5) {
      result += '\n';
      result += node.children.map(child => this.formatDOMTree(child, depth + 1)).join('\n');
      result += `\n${indent}`;
    }

    result += `</${node.tag}>`;

    return result;
  }

  async save() {
    console.log('💾 Saving analysis results...\n');

    // Save Markdown report
    const markdown = await this.generateMarkdownReport();
    await fs.writeFile(path.join(this.outputDir, 'sitemap.md'), markdown);
    console.log('✅ Saved: sitemap.md');

    // Save JSON data
    await fs.writeFile(
      path.join(this.outputDir, 'site-analysis.json'),
      JSON.stringify(this.siteData, null, 2)
    );
    console.log('✅ Saved: site-analysis.json');

    // Save HTML source
    await fs.writeFile(
      path.join(this.outputDir, 'site-source.html'),
      this.siteData.html
    );
    console.log('✅ Saved: site-source.html');

    console.log('\n🎉 All files saved successfully!\n');
  }
}

// Main execution
async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error('Usage: node advanced-site-analyzer.js <URL>');
    process.exit(1);
  }

  const analyzer = new AdvancedSiteAnalyzer(url);

  try {
    await analyzer.analyze();
    await analyzer.save();

    console.log('📊 Summary:');
    console.log(`   - CSS files: ${analyzer.siteData.css.length}`);
    console.log(`   - JavaScript files: ${analyzer.siteData.javascript.length}`);
    console.log(`   - Images: ${analyzer.siteData.images.length}`);
    console.log(`   - Videos: ${analyzer.siteData.videos.length}`);
    console.log(`   - Links: ${analyzer.siteData.links.length}`);
    console.log('');
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = AdvancedSiteAnalyzer;
