#!/usr/bin/env node

/**
 * Component Extractor CLI
 *
 * グローバルコマンド: component-extract
 *
 * 使用例:
 *   component-extract --url https://example.com --selector ".my-component"
 *   component-extract --url https://example.com --selector "#header" --output ./extracted
 *   component-extract --config ./extractor-config.json
 */

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs');
const ComponentExtractor = require('../src/index.js');

const program = new Command();

program
  .name('component-extract')
  .description('DOM/CSS/JS構造を自動抽出するツール（Playwright/Puppeteer + CDP使用）')
  .version('1.0.0');

program
  .option('-u, --url <url>', 'ターゲットURL')
  .option('-s, --selector <selector>', 'CSSセレクタ（抽出対象要素）')
  .option('-o, --output <path>', '出力ディレクトリ', './extracted-components')
  .option('-c, --config <path>', '設定ファイルパス（JSON）')
  .option('--headless <boolean>', 'ヘッドレスモード', true)
  .option('--disable-animations', 'アニメーション無効化（Playwright）', false)
  .option('--coverage', 'Coverage収集有効化', true)
  .option('--events', 'イベントリスナ抽出有効化', true)
  .option('--screenshot', 'スクリーンショット保存', true)
  .option('--wait <ms>', 'ページ読み込み後の待機時間（ms）', '2000')
  .action(async (options) => {
    // 設定ファイルからオプション読み込み
    let config = {};
    if (options.config) {
      try {
        const configPath = path.resolve(options.config);
        config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        console.log(chalk.blue(`📄 設定ファイル読み込み: ${configPath}`));
      } catch (error) {
        console.error(chalk.red(`❌ 設定ファイル読み込みエラー: ${error.message}`));
        process.exit(1);
      }
    }

    // CLIオプションと設定ファイルをマージ（CLIオプションが優先）
    const mergedOptions = {
      url: options.url || config.url,
      selector: options.selector || config.selector,
      outputDir: options.output || config.outputDir || './extracted-components',
      headless: options.headless !== undefined ? options.headless : (config.headless !== undefined ? config.headless : true),
      disableAnimations: options.disableAnimations || config.disableAnimations || false,
      coverage: options.coverage !== undefined ? options.coverage : (config.coverage !== undefined ? config.coverage : true),
      events: options.events !== undefined ? options.events : (config.events !== undefined ? config.events : true),
      screenshot: options.screenshot !== undefined ? options.screenshot : (config.screenshot !== undefined ? config.screenshot : true),
      waitTime: parseInt(options.wait) || config.waitTime || 2000,
    };

    // 必須パラメータチェック
    if (!mergedOptions.url) {
      console.error(chalk.red('❌ エラー: --url または設定ファイルでURLを指定してください'));
      process.exit(1);
    }

    if (!mergedOptions.selector) {
      console.error(chalk.red('❌ エラー: --selector または設定ファイルでCSSセレクタを指定してください'));
      process.exit(1);
    }

    // 実行情報表示
    console.log(chalk.green.bold('\n🚀 Component Extractor 起動\n'));
    console.log(chalk.cyan('📋 抽出設定:'));
    console.log(`   URL: ${chalk.yellow(mergedOptions.url)}`);
    console.log(`   セレクタ: ${chalk.yellow(mergedOptions.selector)}`);
    console.log(`   出力先: ${chalk.yellow(path.resolve(mergedOptions.outputDir))}`);
    console.log(`   Coverage: ${mergedOptions.coverage ? chalk.green('有効') : chalk.gray('無効')}`);
    console.log(`   Events: ${mergedOptions.events ? chalk.green('有効') : chalk.gray('無効')}`);
    console.log(`   Screenshot: ${mergedOptions.screenshot ? chalk.green('有効') : chalk.gray('無効')}`);
    console.log('');

    const spinner = ora('ブラウザ起動中...').start();

    try {
      // Component Extractor実行
      const extractor = new ComponentExtractor(mergedOptions);
      const result = await extractor.extract();

      spinner.succeed(chalk.green('✅ 抽出完了！'));

      // 結果サマリー表示
      console.log(chalk.green.bold('\n📊 抽出結果サマリー:\n'));
      console.log(chalk.cyan(`   HTML要素数: ${chalk.yellow(result.dom.elementCount || 'N/A')}`));
      console.log(chalk.cyan(`   適用CSSルール数: ${chalk.yellow(result.css.ruleCount || 'N/A')}`));
      console.log(chalk.cyan(`   使用JSファイル数: ${chalk.yellow(result.js.fileCount || 'N/A')}`));
      console.log(chalk.cyan(`   イベントリスナ数: ${chalk.yellow(result.events?.listenerCount || 'N/A')}`));
      console.log('');

      // 出力ファイル一覧
      console.log(chalk.green.bold('📁 出力ファイル:\n'));
      const outputFiles = [
        `${result.outputDir}/component.html`,
        `${result.outputDir}/styles.css`,
        `${result.outputDir}/scripts.js`,
        `${result.outputDir}/metadata.json`,
      ];

      if (mergedOptions.screenshot) {
        outputFiles.push(`${result.outputDir}/screenshot.png`);
      }

      outputFiles.forEach(file => {
        if (fs.existsSync(file)) {
          const size = (fs.statSync(file).size / 1024).toFixed(2);
          console.log(`   ${chalk.green('✓')} ${file} ${chalk.gray(`(${size} KB)`)}`);
        }
      });

      console.log(chalk.green.bold('\n✨ 完了しました！\n'));

    } catch (error) {
      spinner.fail(chalk.red('❌ 抽出失敗'));
      console.error(chalk.red(`\nエラー: ${error.message}`));
      console.error(chalk.gray(error.stack));
      process.exit(1);
    }
  });

program.parse(process.argv);

// 引数なしの場合はヘルプ表示
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
