#!/usr/bin/env python3
"""
Webサイトのサイトマップを生成するスクリプト
Usage: python web_scraper_sitemap.py <URL>
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import sys
from collections import defaultdict
import json

class SitemapGenerator:
    def __init__(self, base_url, max_depth=3):
        self.base_url = base_url
        self.max_depth = max_depth
        self.visited = set()
        self.sitemap = defaultdict(list)
        self.domain = urlparse(base_url).netloc

    def is_valid_url(self, url):
        """同じドメイン内のURLかチェック"""
        parsed = urlparse(url)
        return parsed.netloc == self.domain and parsed.scheme in ['http', 'https']

    def normalize_url(self, url):
        """URLを正規化（フラグメント削除など）"""
        parsed = urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}{parsed.path}"

    def scrape_page(self, url, depth=0):
        """ページをスクレイピングしてリンクを抽出"""
        if depth > self.max_depth or url in self.visited:
            return

        self.visited.add(url)
        print(f"{'  ' * depth}Scraping: {url}")

        try:
            # SSL証明書の検証を無効化（自己署名証明書対応）
            response = requests.get(url, timeout=10, verify=False,
                                   headers={'User-Agent': 'Mozilla/5.0'})
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # ページタイトル取得
            title = soup.find('title')
            title_text = title.get_text().strip() if title else 'No Title'

            # ページ情報を保存
            self.sitemap[url] = {
                'title': title_text,
                'depth': depth,
                'links': []
            }

            # すべてのリンクを抽出
            links = soup.find_all('a', href=True)

            for link in links:
                href = link.get('href')
                absolute_url = urljoin(url, href)
                normalized_url = self.normalize_url(absolute_url)

                if self.is_valid_url(normalized_url) and normalized_url not in self.visited:
                    link_text = link.get_text().strip()
                    self.sitemap[url]['links'].append({
                        'url': normalized_url,
                        'text': link_text
                    })

                    # 再帰的にスクレイピング
                    if depth < self.max_depth:
                        self.scrape_page(normalized_url, depth + 1)

        except requests.exceptions.SSLError as e:
            print(f"  SSL Error on {url}: {e}")
        except requests.exceptions.RequestException as e:
            print(f"  Error scraping {url}: {e}")
        except Exception as e:
            print(f"  Unexpected error on {url}: {e}")

    def generate_markdown_sitemap(self, output_file='sitemap.md'):
        """Markdown形式のサイトマップを生成"""
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"# サイトマップ: {self.base_url}\n\n")
            f.write(f"生成日時: {self.get_timestamp()}\n\n")
            f.write(f"## 発見されたページ数: {len(self.visited)}\n\n")
            f.write("---\n\n")

            # 深さごとに整理
            by_depth = defaultdict(list)
            for url, info in self.sitemap.items():
                by_depth[info['depth']].append((url, info))

            for depth in sorted(by_depth.keys()):
                f.write(f"## レベル {depth}\n\n")
                for url, info in sorted(by_depth[depth], key=lambda x: x[0]):
                    indent = "  " * depth
                    f.write(f"{indent}- **{info['title']}**\n")
                    f.write(f"{indent}  - URL: `{url}`\n")
                    if info['links']:
                        f.write(f"{indent}  - 子ページ ({len(info['links'])}):\n")
                        for link in info['links'][:10]:  # 最初の10個のみ表示
                            f.write(f"{indent}    - [{link['text']}]({link['url']})\n")
                    f.write("\n")

        print(f"\n✅ サイトマップを生成しました: {output_file}")

    def generate_tree_view(self):
        """ツリー形式でサイトマップを表示"""
        print("\n" + "="*80)
        print("サイトマップ構造:")
        print("="*80 + "\n")

        by_depth = defaultdict(list)
        for url, info in self.sitemap.items():
            by_depth[info['depth']].append((url, info))

        for depth in sorted(by_depth.keys()):
            for url, info in sorted(by_depth[depth], key=lambda x: x[0]):
                indent = "  " * depth
                print(f"{indent}{'└─ ' if depth > 0 else ''}📄 {info['title']}")
                print(f"{indent}   {url}")
                if info['links']:
                    print(f"{indent}   ({len(info['links'])} リンク)")

    def generate_json_sitemap(self, output_file='sitemap.json'):
        """JSON形式のサイトマップを生成"""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(dict(self.sitemap), f, ensure_ascii=False, indent=2)
        print(f"✅ JSONサイトマップを生成しました: {output_file}")

    @staticmethod
    def get_timestamp():
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def main():
    if len(sys.argv) < 2:
        print("Usage: python web_scraper_sitemap.py <URL> [max_depth]")
        print("Example: python web_scraper_sitemap.py http://example.com 2")
        sys.exit(1)

    url = sys.argv[1]
    max_depth = int(sys.argv[2]) if len(sys.argv) > 2 else 2

    print(f"🔍 サイトマップを生成中: {url}")
    print(f"📊 最大深度: {max_depth}\n")

    # SSL警告を抑制
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    generator = SitemapGenerator(url, max_depth=max_depth)
    generator.scrape_page(url)

    # 結果を出力
    generator.generate_tree_view()
    generator.generate_markdown_sitemap()
    generator.generate_json_sitemap()

    print(f"\n✨ 完了! {len(generator.visited)} ページを解析しました。")


if __name__ == "__main__":
    main()
