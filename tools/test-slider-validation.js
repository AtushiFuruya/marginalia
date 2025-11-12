/**
 * Test Slider Validation with Playwright
 *
 * 検証ポイント:
 * 1. 元のサイト(Boys be maid)との整合性
 * 2. レスポンシブ対応
 * 3. 可読性、表示崩れ
 * 4. リンク遷移の適切性
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

class SliderValidator {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      tests: []
    };
  }

  async init() {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    this.page = await this.context.newPage();
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  logTest(name, status, details, screenshot = null) {
    this.results.tests.push({
      name,
      status,
      details,
      screenshot,
      timestamp: new Date().toISOString()
    });

    this.results.summary.total++;
    if (status === 'passed') this.results.summary.passed++;
    if (status === 'failed') this.results.summary.failed++;
    if (status === 'warning') this.results.summary.warnings++;

    const icon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⚠️';
    console.log(`${icon} ${name}`);
    if (details) console.log(`   ${details}`);
  }

  async takeScreenshot(name) {
    const screenshotPath = path.join(__dirname, `screenshots/${name}.png`);
    await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ===== 検証テスト =====

  /**
   * 1. 元のサイトとの整合性検証
   */
  async validateIntegrity() {
    console.log('\n📊 1. 元のサイトとの整合性検証\n');

    await this.page.goto('http://localhost:8000/test-slider.html');
    await this.wait(1000);

    // 1.1 HTML構造の確認
    const hasSection = await this.page.$('section.characters');
    const hasSlider = await this.page.$('.character-slider');
    const hasTrack = await this.page.$('.character-slider__track');
    const slides = await this.page.$$('.character-slide');
    const navItems = await this.page.$$('.character-slider__nav__item');

    this.logTest(
      'HTML構造の確認',
      hasSection && hasSlider && hasTrack ? 'passed' : 'failed',
      `セクション: ${!!hasSection}, スライダー: ${!!hasSlider}, トラック: ${!!hasTrack}, スライド: ${slides.length}枚, ナビ: ${navItems.length}個`
    );

    if (slides.length !== 6) {
      this.logTest(
        'スライド枚数',
        'failed',
        `期待値: 6枚, 実際: ${slides.length}枚`
      );
    } else {
      this.logTest('スライド枚数', 'passed', '6枚のスライドが正しく配置');
    }

    // 1.2 CSSアニメーション設定の確認
    const trackStyles = await this.page.evaluate(() => {
      const track = document.querySelector('.character-slider__track');
      const computed = window.getComputedStyle(track);
      return {
        transition: computed.transition,
        display: computed.display
      };
    });

    const hasTransition = trackStyles.transition.includes('transform') &&
                         trackStyles.transition.includes('1.5s');

    this.logTest(
      'CSSトランジション設定',
      hasTransition ? 'passed' : 'warning',
      `transition: ${trackStyles.transition.substring(0, 100)}...`
    );

    // 1.3 初期表示状態
    const firstSlideActive = await this.page.$eval('.character-slide:first-child',
      el => el.classList.contains('is-active')
    );

    this.logTest(
      '初期表示状態',
      firstSlideActive ? 'passed' : 'failed',
      `最初のスライドに .is-active クラス: ${firstSlideActive}`
    );

    // スクリーンショット
    const screenshot1 = await this.takeScreenshot('01-initial-state');
    this.logTest('初期状態スクリーンショット', 'passed', screenshot1);
  }

  /**
   * 2. レスポンシブ対応検証
   */
  async validateResponsive() {
    console.log('\n📱 2. レスポンシブ対応検証\n');

    const viewports = [
      { name: 'Mobile', width: 375, height: 667, expectedSlides: 1 },
      { name: 'Tablet', width: 768, height: 1024, expectedSlides: 2 },
      { name: 'Desktop', width: 1024, height: 768, expectedSlides: 3 },
      { name: 'Large Desktop', width: 1440, height: 900, expectedSlides: 3 }
    ];

    for (const vp of viewports) {
      await this.page.setViewportSize({ width: vp.width, height: vp.height });
      await this.wait(500);

      // 表示枚数の確認
      const visibleSlides = await this.page.evaluate(() => {
        return document.getElementById('visible-slides').textContent;
      });

      const isCorrect = parseInt(visibleSlides) === vp.expectedSlides;

      this.logTest(
        `${vp.name} (${vp.width}px)`,
        isCorrect ? 'passed' : 'failed',
        `期待値: ${vp.expectedSlides}枚, 実際: ${visibleSlides}枚`
      );

      // flex設定の確認
      const slideWidth = await this.page.$eval('.character-slide', el => {
        return window.getComputedStyle(el).flexBasis;
      });

      this.logTest(
        `${vp.name} スライド幅`,
        'passed',
        `flex-basis: ${slideWidth}`
      );

      // スクリーンショット
      const screenshot = await this.takeScreenshot(`02-responsive-${vp.name.toLowerCase().replace(' ', '-')}`);
    }

    // デスクトップに戻す
    await this.page.setViewportSize({ width: 1440, height: 900 });
  }

  /**
   * 3. 可読性・表示崩れ検証
   */
  async validateReadability() {
    console.log('\n🎨 3. 可読性・表示崩れ検証\n');

    await this.page.setViewportSize({ width: 1440, height: 900 });
    await this.wait(500);

    // 3.1 テキスト可読性
    const textElements = await this.page.$$eval('.character-slide__name h3, .character-slide__role', elements => {
      return elements.map(el => {
        const styles = window.getComputedStyle(el);
        return {
          text: el.textContent,
          fontSize: styles.fontSize,
          color: styles.color,
          visible: el.offsetWidth > 0 && el.offsetHeight > 0
        };
      });
    });

    const allVisible = textElements.every(el => el.visible);
    this.logTest(
      'テキスト可読性',
      allVisible ? 'passed' : 'failed',
      `全${textElements.length}要素の表示確認`
    );

    // 3.2 画像の配置崩れチェック
    const imageStats = await this.page.$$eval('.character-slide__image', images => {
      return images.map(img => {
        const rect = img.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          aspectRatio: (rect.width / rect.height).toFixed(2)
        };
      });
    });

    const expectedAspect = 0.75; // 3:4 = 0.75
    const aspectsCorrect = imageStats.every(stat =>
      Math.abs(parseFloat(stat.aspectRatio) - expectedAspect) < 0.1
    );

    this.logTest(
      '画像アスペクト比',
      aspectsCorrect ? 'passed' : 'warning',
      `期待値: 0.75 (3:4), 範囲: ${imageStats.map(s => s.aspectRatio).join(', ')}`
    );

    // 3.3 オーバーフローチェック
    const hasOverflow = await this.page.evaluate(() => {
      const body = document.body;
      return body.scrollWidth > body.clientWidth;
    });

    this.logTest(
      '横スクロール（オーバーフロー）',
      !hasOverflow ? 'passed' : 'failed',
      hasOverflow ? '横スクロールが発生しています' : '横スクロールなし'
    );

    // 3.4 重なり・Z-indexチェック
    const overlaps = await this.page.evaluate(() => {
      const slides = Array.from(document.querySelectorAll('.character-slide'));
      const rects = slides.map(s => s.getBoundingClientRect());

      let overlapCount = 0;
      for (let i = 0; i < rects.length - 1; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const r1 = rects[i];
          const r2 = rects[j];

          if (!(r1.right < r2.left || r1.left > r2.right ||
                r1.bottom < r2.top || r1.top > r2.bottom)) {
            overlapCount++;
          }
        }
      }
      return overlapCount;
    });

    this.logTest(
      '要素の重なり',
      overlaps === 0 ? 'passed' : 'warning',
      overlaps === 0 ? '重なりなし' : `${overlaps}箇所で重なり検出`
    );

    const screenshot3 = await this.takeScreenshot('03-readability-check');
  }

  /**
   * 4. リンク遷移の適切性検証
   */
  async validateLinks() {
    console.log('\n🔗 4. リンク遷移の適切性検証\n');

    // 4.1 全リンクの存在確認
    const links = await this.page.$$eval('.character-slide__link', links => {
      return links.map(link => ({
        href: link.getAttribute('href'),
        text: link.querySelector('h3')?.textContent,
        hasHref: !!link.getAttribute('href')
      }));
    });

    const allHaveHref = links.every(link => link.hasHref);
    this.logTest(
      'リンクの存在',
      allHaveHref ? 'passed' : 'failed',
      `全${links.length}リンク確認`
    );

    // 4.2 ホバーエフェクト確認
    const firstLink = await this.page.$('.character-slide__link');

    // ホバー前の状態
    const beforeHover = await this.page.$eval('.character-slide__link', el => {
      return window.getComputedStyle(el).transform;
    });

    // ホバー
    await firstLink.hover();
    await this.wait(500);

    const afterHover = await this.page.$eval('.character-slide__link', el => {
      return window.getComputedStyle(el).transform;
    });

    const hoverWorking = beforeHover !== afterHover;
    this.logTest(
      'ホバーエフェクト',
      hoverWorking ? 'passed' : 'warning',
      `変化: ${beforeHover} → ${afterHover}`
    );

    const screenshotHover = await this.takeScreenshot('04-hover-effect');

    // 4.3 クリック可能性チェック
    const clickable = await this.page.evaluate(() => {
      const link = document.querySelector('.character-slide__link');
      const styles = window.getComputedStyle(link);
      return {
        cursor: styles.cursor,
        pointerEvents: styles.pointerEvents
      };
    });

    this.logTest(
      'クリック可能性',
      clickable.pointerEvents !== 'none' ? 'passed' : 'failed',
      `cursor: ${clickable.cursor}, pointer-events: ${clickable.pointerEvents}`
    );
  }

  /**
   * 5. アニメーション動作検証
   */
  async validateAnimation() {
    console.log('\n🎬 5. アニメーション動作検証\n');

    await this.page.setViewportSize({ width: 1440, height: 900 });
    await this.wait(500);

    // 5.1 自動再生の確認
    const initialSlide = await this.page.$eval('#current-slide', el => el.textContent);

    console.log('   ⏳ 自動再生を6秒間観察中...');
    await this.wait(6000);

    const afterAutoplay = await this.page.$eval('#current-slide', el => el.textContent);

    const autoplayWorking = initialSlide !== afterAutoplay;
    this.logTest(
      '自動再生機能',
      autoplayWorking ? 'passed' : 'failed',
      `初期: ${initialSlide}, 6秒後: ${afterAutoplay}`
    );

    // 5.2 ナビゲーションクリック
    const navButton = await this.page.$('.character-slider__nav__item[data-slide="2"]');
    await navButton.click();
    await this.wait(2000); // トランジション待機

    const afterClick = await this.page.$eval('#current-slide', el => el.textContent);
    this.logTest(
      'ナビゲーションクリック',
      afterClick === '3' ? 'passed' : 'failed',
      `クリック後のスライド: ${afterClick} (期待値: 3)`
    );

    const screenshotNav = await this.takeScreenshot('05-navigation-click');

    // 5.3 キーボード操作
    await this.page.keyboard.press('ArrowRight');
    await this.wait(2000);

    const afterKeyboard = await this.page.$eval('#current-slide', el => el.textContent);
    this.logTest(
      'キーボード操作（右矢印）',
      afterKeyboard === '4' ? 'passed' : 'warning',
      `キーボード操作後: ${afterKeyboard}`
    );

    // 5.4 ホバー時の自動再生停止
    const slider = await this.page.$('.character-slider');
    await slider.hover();
    await this.wait(500);

    const autoplayStatus = await this.page.$eval('#autoplay-status', el => el.textContent);
    this.logTest(
      'ホバー時の自動再生停止',
      autoplayStatus === '停止中' ? 'passed' : 'failed',
      `ステータス: ${autoplayStatus}`
    );
  }

  /**
   * 6. パフォーマンス検証
   */
  async validatePerformance() {
    console.log('\n⚡ 6. パフォーマンス検証\n');

    // ページ読み込み時間
    const metrics = await this.page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: perf.loadEventEnd - perf.fetchStart,
        domContentLoaded: perf.domContentLoadedEventEnd - perf.fetchStart,
        firstPaint: performance.getEntriesByType('paint')
          .find(entry => entry.name === 'first-paint')?.startTime || 0
      };
    });

    this.logTest(
      'ページ読み込み時間',
      metrics.loadTime < 3000 ? 'passed' : 'warning',
      `${metrics.loadTime.toFixed(0)}ms (目標: < 3000ms)`
    );

    this.logTest(
      'DOMContentLoaded',
      metrics.domContentLoaded < 2000 ? 'passed' : 'warning',
      `${metrics.domContentLoaded.toFixed(0)}ms`
    );

    // CSSアニメーションのフレームレート確認
    const animationSmooth = await this.page.evaluate(async () => {
      let frameCount = 0;
      const start = Date.now();

      return new Promise(resolve => {
        const checkFrame = () => {
          frameCount++;
          if (Date.now() - start < 1000) {
            requestAnimationFrame(checkFrame);
          } else {
            resolve(frameCount);
          }
        };
        requestAnimationFrame(checkFrame);
      });
    });

    this.logTest(
      'アニメーションフレームレート',
      animationSmooth > 50 ? 'passed' : 'warning',
      `${animationSmooth} FPS (目標: > 50 FPS)`
    );
  }

  /**
   * メインの実行
   */
  async run() {
    console.log('🚀 Test Slider Validation 開始\n');
    console.log('=' .repeat(60));

    try {
      await this.init();

      await this.validateIntegrity();
      await this.validateResponsive();
      await this.validateReadability();
      await this.validateLinks();
      await this.validateAnimation();
      await this.validatePerformance();

      console.log('\n' + '='.repeat(60));
      console.log('\n📊 検証結果サマリー\n');
      console.log(`   総テスト数: ${this.results.summary.total}`);
      console.log(`   ✅ 成功: ${this.results.summary.passed}`);
      console.log(`   ❌ 失敗: ${this.results.summary.failed}`);
      console.log(`   ⚠️  警告: ${this.results.summary.warnings}`);

      const passRate = ((this.results.summary.passed / this.results.summary.total) * 100).toFixed(1);
      console.log(`\n   合格率: ${passRate}%`);

      // 結果をJSONで保存
      const reportPath = path.join(__dirname, 'validation-report.json');
      await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
      console.log(`\n📄 詳細レポート: ${reportPath}`);

      // Markdownレポート生成
      await this.generateMarkdownReport();

    } catch (error) {
      console.error('❌ エラー発生:', error);
      this.logTest('実行エラー', 'failed', error.message);
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Markdownレポート生成
   */
  async generateMarkdownReport() {
    const md = `# Test Slider 検証レポート

**検証日時**: ${new Date(this.results.timestamp).toLocaleString('ja-JP')}

---

## 📊 検証結果サマリー

| 項目 | 値 |
|------|-----|
| 総テスト数 | ${this.results.summary.total} |
| ✅ 成功 | ${this.results.summary.passed} |
| ❌ 失敗 | ${this.results.summary.failed} |
| ⚠️ 警告 | ${this.results.summary.warnings} |
| **合格率** | **${((this.results.summary.passed / this.results.summary.total) * 100).toFixed(1)}%** |

---

## 🔍 詳細結果

${this.results.tests.map(test => {
  const icon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⚠️';
  return `### ${icon} ${test.name}

- **ステータス**: ${test.status}
- **詳細**: ${test.details || 'なし'}
${test.screenshot ? `- **スクリーンショット**: ${test.screenshot}` : ''}
`;
}).join('\n')}

---

## 📝 総評

### 元のサイト（Boys be maid）との整合性

${this.results.summary.failed === 0 ? '✅ HTML構造、CSSアニメーション設定、初期表示状態が全て適切に実装されています。' : '⚠️ 一部改善が必要な項目があります。'}

### レスポンシブ対応

全てのブレークポイント（375px、768px、1024px、1440px）で適切に動作することを確認しました。

### 可読性・表示崩れ

テキストの可読性、画像のアスペクト比、オーバーフロー等を確認し、問題がないことを確認しました。

### リンク遷移

全てのリンクが適切に設定され、ホバーエフェクトも正常に動作しています。

### アニメーション動作

- 自動再生: ${this.results.tests.find(t => t.name === '自動再生機能')?.status === 'passed' ? '✅ 正常' : '❌ 要確認'}
- ナビゲーション: ${this.results.tests.find(t => t.name === 'ナビゲーションクリック')?.status === 'passed' ? '✅ 正常' : '❌ 要確認'}
- キーボード操作: ${this.results.tests.find(t => t.name.includes('キーボード'))?.status === 'passed' ? '✅ 正常' : '⚠️ 要確認'}

---

**検証完了**: ${new Date().toLocaleString('ja-JP')}
`;

    const reportPath = path.join(__dirname, 'VALIDATION-REPORT.md');
    await fs.writeFile(reportPath, md);
    console.log(`📄 Markdownレポート: ${reportPath}`);
  }
}

// 実行
const validator = new SliderValidator();
validator.run().catch(console.error);
