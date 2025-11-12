/**
 * Component Extractor - メインクラス
 *
 * Playwright/Puppeteer + CDP を使用して、
 * ターゲット要素のDOM/CSS/JS構造を自動抽出
 */

const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');

// Playwright はオプション（アニメーション無効化機能用）
let playwright = null;
try {
  playwright = require('playwright');
} catch (e) {
  // Playwright未インストールの場合は無視
  console.warn('Playwright未インストール: --disable-animations オプションは使用できません');
}

class ComponentExtractor {
  constructor(options = {}) {
    this.options = {
      url: options.url,
      selector: options.selector,
      outputDir: options.outputDir || './extracted-components',
      headless: options.headless !== undefined ? options.headless : true,
      disableAnimations: options.disableAnimations || false,
      coverage: options.coverage !== undefined ? options.coverage : true,
      events: options.events !== undefined ? options.events : true,
      screenshot: options.screenshot !== undefined ? options.screenshot : true,
      waitTime: options.waitTime || 2000,
    };

    this.browser = null;
    this.page = null;
    this.cdpSession = null;
  }

  /**
   * メイン抽出処理
   */
  async extract() {
    try {
      // 出力ディレクトリ作成
      await this.ensureOutputDir();

      // Puppeteer（CDP + Coverage用）
      const puppeteerBrowser = await puppeteer.launch({
        headless: this.options.headless ? 'new' : false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const puppeteerPage = await puppeteerBrowser.newPage();

      // CDPセッション接続
      const client = await puppeteerPage.target().createCDPSession();
      this.cdpSession = client;

      // Coverage開始
      let coverageData = null;
      if (this.options.coverage) {
        await client.send('DOM.enable');
        await client.send('CSS.enable');
        await client.send('DOMDebugger.enable');
        await puppeteerPage.coverage.startJSCoverage();
        await puppeteerPage.coverage.startCSSCoverage();
      }

      // ページアクセス
      await puppeteerPage.goto(this.options.url, { waitUntil: 'networkidle2' });
      await puppeteerPage.waitForTimeout(this.options.waitTime);

      // スクリーンショット取得
      if (this.options.screenshot) {
        await puppeteerPage.screenshot({
          path: path.join(this.options.outputDir, 'screenshot.png'),
          fullPage: true,
        });
      }

      // ターゲット要素の存在確認
      const elementExists = await puppeteerPage.$(this.options.selector);
      if (!elementExists) {
        throw new Error(`セレクタ "${this.options.selector}" に一致する要素が見つかりません`);
      }

      // DOMSnapshot取得
      const domSnapshot = await this.captureDOMSnapshot(client, this.options.selector);

      // CSS適用ルール取得
      const cssRules = await this.getMatchedStyles(client, puppeteerPage, this.options.selector);

      // イベントリスナ取得
      let eventListeners = null;
      if (this.options.events) {
        eventListeners = await this.getEventListeners(client, puppeteerPage, this.options.selector);
      }

      // Coverage停止・取得
      if (this.options.coverage) {
        const [jsCoverage, cssCoverage] = await Promise.all([
          puppeteerPage.coverage.stopJSCoverage(),
          puppeteerPage.coverage.stopCSSCoverage(),
        ]);
        coverageData = { js: jsCoverage, css: cssCoverage };
      }

      // ブラウザクローズ
      await puppeteerBrowser.close();

      // 結果を整形して保存
      const result = await this.saveResults({
        dom: domSnapshot,
        css: cssRules,
        events: eventListeners,
        coverage: coverageData,
      });

      return {
        ...result,
        outputDir: this.options.outputDir,
      };

    } catch (error) {
      if (this.browser) {
        await this.browser.close();
      }
      throw error;
    }
  }

  /**
   * DOMSnapshot.captureSnapshot 実行
   */
  async captureDOMSnapshot(client, selector) {
    try {
      const snapshot = await client.send('DOMSnapshot.captureSnapshot', {
        computedStyles: ['width', 'height', 'display', 'position', 'opacity', 'transform', 'transition', 'animation'],
      });

      return {
        snapshot,
        elementCount: snapshot.documents?.[0]?.nodes?.nodeName?.length || 0,
      };
    } catch (error) {
      console.error('DOMSnapshot取得エラー:', error.message);
      return { snapshot: null, elementCount: 0 };
    }
  }

  /**
   * CSS.getMatchedStylesForNode 実行
   */
  async getMatchedStyles(client, page, selector) {
    try {
      // セレクタからノードID取得
      const element = await page.$(selector);
      if (!element) {
        throw new Error(`要素が見つかりません: ${selector}`);
      }

      // DOM.getDocumentでルートノード取得
      const { root } = await client.send('DOM.getDocument', { depth: -1 });

      // セレクタでノード検索
      const { nodeIds } = await client.send('DOM.querySelectorAll', {
        nodeId: root.nodeId,
        selector: selector,
      });

      if (!nodeIds || nodeIds.length === 0) {
        throw new Error(`ノードIDが見つかりません: ${selector}`);
      }

      const targetNodeId = nodeIds[0];

      // マッチしたスタイル取得
      const matchedStyles = await client.send('CSS.getMatchedStylesForNode', {
        nodeId: targetNodeId,
      });

      return {
        matchedStyles,
        ruleCount: matchedStyles.matchedCSSRules?.length || 0,
      };
    } catch (error) {
      console.error('CSS取得エラー:', error.message);
      return { matchedStyles: null, ruleCount: 0 };
    }
  }

  /**
   * DOMDebugger.getEventListeners 実行
   */
  async getEventListeners(client, page, selector) {
    try {
      const element = await page.$(selector);
      if (!element) {
        throw new Error(`要素が見つかりません: ${selector}`);
      }

      const { root } = await client.send('DOM.getDocument', { depth: -1 });
      const { nodeIds } = await client.send('DOM.querySelectorAll', {
        nodeId: root.nodeId,
        selector: selector,
      });

      if (!nodeIds || nodeIds.length === 0) {
        return { listeners: [], listenerCount: 0 };
      }

      const objectId = await client.send('DOM.resolveNode', {
        nodeId: nodeIds[0],
      });

      const listeners = await client.send('DOMDebugger.getEventListeners', {
        objectId: objectId.object.objectId,
      });

      return {
        listeners: listeners.listeners || [],
        listenerCount: listeners.listeners?.length || 0,
      };
    } catch (error) {
      console.error('EventListener取得エラー:', error.message);
      return { listeners: [], listenerCount: 0 };
    }
  }

  /**
   * 結果を保存
   */
  async saveResults(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const componentName = this.sanitizeSelector(this.options.selector);
    const outputDir = path.join(this.options.outputDir, `${componentName}_${timestamp}`);

    await fs.mkdir(outputDir, { recursive: true });

    // HTML保存（DOMSnapshot）
    const htmlContent = this.generateHTMLFromSnapshot(data.dom);
    await fs.writeFile(path.join(outputDir, 'component.html'), htmlContent);

    // CSS保存（MatchedStyles）
    const cssContent = this.generateCSSFromMatched(data.css);
    await fs.writeFile(path.join(outputDir, 'styles.css'), cssContent);

    // JS保存（Coverage）
    const jsContent = this.generateJSFromCoverage(data.coverage);
    await fs.writeFile(path.join(outputDir, 'scripts.js'), jsContent);

    // メタデータ保存
    const metadata = {
      extractedAt: new Date().toISOString(),
      url: this.options.url,
      selector: this.options.selector,
      dom: {
        elementCount: data.dom?.elementCount || 0,
      },
      css: {
        ruleCount: data.css?.ruleCount || 0,
      },
      js: {
        fileCount: data.coverage?.js?.length || 0,
      },
      events: {
        listenerCount: data.events?.listenerCount || 0,
        listeners: data.events?.listeners || [],
      },
    };

    await fs.writeFile(
      path.join(outputDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    return metadata;
  }

  /**
   * DOMSnapshotからHTML生成
   */
  generateHTMLFromSnapshot(domData) {
    if (!domData || !domData.snapshot) {
      return '<!-- DOMSnapshot取得失敗 -->';
    }

    // 簡易HTML生成（実際の実装ではより詳細な変換が必要）
    return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Extracted Component</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!--
    抽出元: ${this.options.url}
    セレクタ: ${this.options.selector}
    要素数: ${domData.elementCount}
  -->

  <!-- DOMSnapshotデータはmetadata.jsonを参照 -->
  <div class="extracted-component">
    <!-- ここに実際のDOM構造を挿入 -->
  </div>

  <script src="scripts.js"></script>
</body>
</html>`;
  }

  /**
   * MatchedStylesからCSS生成
   */
  generateCSSFromMatched(cssData) {
    if (!cssData || !cssData.matchedStyles) {
      return '/* CSS取得失敗 */';
    }

    let cssContent = `/* 抽出元: ${this.options.url} */\n`;
    cssContent += `/* セレクタ: ${this.options.selector} */\n`;
    cssContent += `/* ルール数: ${cssData.ruleCount} */\n\n`;

    // MatchedCSSRulesから実際のCSSルールを抽出
    const rules = cssData.matchedStyles.matchedCSSRules || [];
    rules.forEach((rule, index) => {
      if (rule.rule && rule.rule.selectorList && rule.rule.style) {
        const selectors = rule.rule.selectorList.selectors.map(s => s.text).join(', ');
        cssContent += `/* ルール ${index + 1} */\n`;
        cssContent += `${selectors} {\n`;

        rule.rule.style.cssProperties.forEach(prop => {
          cssContent += `  ${prop.name}: ${prop.value};\n`;
        });

        cssContent += `}\n\n`;
      }
    });

    return cssContent;
  }

  /**
   * CoverageからJS生成
   */
  generateJSFromCoverage(coverageData) {
    if (!coverageData || !coverageData.js) {
      return '// JS Coverage取得失敗';
    }

    let jsContent = `// 抽出元: ${this.options.url}\n`;
    jsContent += `// 使用JSファイル数: ${coverageData.js.length}\n\n`;

    coverageData.js.forEach((entry, index) => {
      const url = entry.url;
      const usedBytes = entry.ranges.reduce((sum, range) => sum + (range.end - range.start), 0);
      const usagePercent = ((usedBytes / entry.text.length) * 100).toFixed(2);

      jsContent += `/* ファイル ${index + 1}: ${url} */\n`;
      jsContent += `/* 使用率: ${usagePercent}% (${usedBytes} / ${entry.text.length} bytes) */\n\n`;

      // 使用された範囲のコードを抽出
      entry.ranges.forEach((range, rangeIndex) => {
        const code = entry.text.substring(range.start, range.end);
        jsContent += `/* 範囲 ${rangeIndex + 1} (${range.start}-${range.end}) */\n`;
        jsContent += `${code}\n\n`;
      });

      jsContent += '\n';
    });

    return jsContent;
  }

  /**
   * セレクタをファイル名として使用可能な文字列に変換
   */
  sanitizeSelector(selector) {
    return selector
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase();
  }

  /**
   * 出力ディレクトリ確認・作成
   */
  async ensureOutputDir() {
    await fs.mkdir(this.options.outputDir, { recursive: true });
  }
}

module.exports = ComponentExtractor;
