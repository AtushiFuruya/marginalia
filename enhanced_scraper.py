#!/usr/bin/env python3
"""
Enhanced Web Scraper with Deep Structure Analysis
Extracts complete HTML structure, CSS, JavaScript, and assets
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
import re
from collections import defaultdict
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class EnhancedScraper:
    def __init__(self, url):
        self.url = url
        self.data = {
            'url': url,
            'title': '',
            'html_structure': {},
            'css_files': [],
            'js_files': [],
            'images': [],
            'videos': [],
            'links': [],
            'forms': [],
            'meta_tags': {},
            'inline_styles': [],
            'inline_scripts': [],
            'dom_tree': None
        }

    def analyze(self):
        print(f"🔍 Analyzing: {self.url}\n")

        try:
            response = requests.get(
                self.url,
                verify=False,
                headers={'User-Agent': 'Mozilla/5.0'},
                timeout=30
            )
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Basic info
            self.data['title'] = soup.title.string if soup.title else 'No Title'
            print(f"📄 Title: {self.data['title']}")

            # Meta tags
            self._extract_meta_tags(soup)

            # CSS
            self._extract_css(soup)

            # JavaScript
            self._extract_javascript(soup)

            # Images
            self._extract_images(soup)

            # Videos
            self._extract_videos(soup)

            # Links
            self._extract_links(soup)

            # Forms
            self._extract_forms(soup)

            # HTML Structure
            self._analyze_html_structure(soup)

            # DOM Tree
            self.data['dom_tree'] = self._build_dom_tree(soup.body if soup.body else soup)

            print("\n✅ Analysis complete!")

        except Exception as e:
            print(f"❌ Error: {e}")
            raise

    def _extract_meta_tags(self, soup):
        print("🏷️  Extracting meta tags...")
        meta_tags = soup.find_all('meta')
        for meta in meta_tags:
            name = meta.get('name') or meta.get('property') or meta.get('http-equiv')
            content = meta.get('content')
            if name and content:
                self.data['meta_tags'][name] = content

    def _extract_css(self, soup):
        print("🎨 Extracting CSS...")
        # External CSS
        for link in soup.find_all('link', rel='stylesheet'):
            href = link.get('href')
            if href:
                full_url = urljoin(self.url, href)
                self.data['css_files'].append(full_url)

        # Inline styles
        for style in soup.find_all('style'):
            if style.string:
                self.data['inline_styles'].append(style.string[:500])

        print(f"   - {len(self.data['css_files'])} external CSS files")
        print(f"   - {len(self.data['inline_styles'])} inline style blocks")

    def _extract_javascript(self, soup):
        print("⚙️  Extracting JavaScript...")
        # External JS
        for script in soup.find_all('script', src=True):
            src = script.get('src')
            if src:
                full_url = urljoin(self.url, src)
                self.data['js_files'].append({
                    'src': full_url,
                    'async': script.has_attr('async'),
                    'defer': script.has_attr('defer')
                })

        # Inline scripts
        for script in soup.find_all('script', src=False):
            if script.string:
                self.data['inline_scripts'].append({
                    'content': script.string[:500],
                    'length': len(script.string)
                })

        print(f"   - {len(self.data['js_files'])} external JS files")
        print(f"   - {len(self.data['inline_scripts'])} inline script blocks")

    def _extract_images(self, soup):
        print("🖼️  Extracting images...")
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src')
            if src:
                self.data['images'].append({
                    'src': urljoin(self.url, src),
                    'alt': img.get('alt', ''),
                    'title': img.get('title', ''),
                    'width': img.get('width'),
                    'height': img.get('height')
                })
        print(f"   - {len(self.data['images'])} images found")

    def _extract_videos(self, soup):
        print("🎬 Extracting videos...")
        # <video> tags
        for video in soup.find_all('video'):
            src = video.get('src')
            if src:
                self.data['videos'].append({
                    'src': urljoin(self.url, src),
                    'type': 'video_tag',
                    'autoplay': video.has_attr('autoplay'),
                    'loop': video.has_attr('loop'),
                    'muted': video.has_attr('muted')
                })

            # <source> tags inside video
            for source in video.find_all('source'):
                src = source.get('src')
                if src:
                    self.data['videos'].append({
                        'src': urljoin(self.url, src),
                        'type': source.get('type', 'unknown'),
                        'parent': 'video'
                    })

        print(f"   - {len(self.data['videos'])} videos found")

    def _extract_links(self, soup):
        print("🔗 Extracting links...")
        for link in soup.find_all('a', href=True):
            self.data['links'].append({
                'href': urljoin(self.url, link['href']),
                'text': link.get_text(strip=True),
                'title': link.get('title', ''),
                'target': link.get('target', '')
            })
        print(f"   - {len(self.data['links'])} links found")

    def _extract_forms(self, soup):
        print("📝 Extracting forms...")
        for form in soup.find_all('form'):
            form_data = {
                'action': urljoin(self.url, form.get('action', '')),
                'method': form.get('method', 'GET').upper(),
                'inputs': []
            }

            for input_tag in form.find_all(['input', 'select', 'textarea']):
                form_data['inputs'].append({
                    'type': input_tag.get('type', input_tag.name),
                    'name': input_tag.get('name', ''),
                    'id': input_tag.get('id', ''),
                    'required': input_tag.has_attr('required')
                })

            self.data['forms'].append(form_data)
        print(f"   - {len(self.data['forms'])} forms found")

    def _analyze_html_structure(self, soup):
        print("🏗️  Analyzing HTML structure...")
        structure = {
            'doctype': str(soup.contents[0]) if soup.contents else 'unknown',
            'html_lang': soup.html.get('lang') if soup.html else None,
            'head_elements': {},
            'body_elements': {}
        }

        # Head elements
        if soup.head:
            structure['head_elements'] = {
                'title': bool(soup.head.find('title')),
                'meta_count': len(soup.head.find_all('meta')),
                'link_count': len(soup.head.find_all('link')),
                'script_count': len(soup.head.find_all('script')),
                'style_count': len(soup.head.find_all('style'))
            }

        # Body elements
        if soup.body:
            structure['body_elements'] = {
                'header': bool(soup.body.find('header')),
                'nav': bool(soup.body.find('nav')),
                'main': bool(soup.body.find('main')),
                'footer': bool(soup.body.find('footer')),
                'article_count': len(soup.body.find_all('article')),
                'section_count': len(soup.body.find_all('section')),
                'div_count': len(soup.body.find_all('div')),
                'total_elements': len(soup.body.find_all())
            }

        self.data['html_structure'] = structure

    def _build_dom_tree(self, element, depth=0, max_depth=5):
        if depth > max_depth or not element.name:
            return None

        node = {
            'tag': element.name,
            'id': element.get('id'),
            'classes': element.get('class', []),
            'attributes': {k: v for k, v in element.attrs.items() if k not in ['id', 'class']},
            'children': []
        }

        # Only include direct text content (not from children)
        text = ''.join([str(c) for c in element.children if isinstance(c, str)]).strip()
        if text:
            node['text'] = text[:100]

        # Recursively build children
        for child in element.children:
            if hasattr(child, 'name') and child.name:
                child_node = self._build_dom_tree(child, depth + 1, max_depth)
                if child_node:
                    node['children'].append(child_node)

        return node

    def generate_markdown_report(self):
        print("\n📄 Generating Markdown report...")

        md = f"""# 完全サイト構造分析レポート

## 基本情報

- **URL**: {self.url}
- **タイトル**: {self.data['title']}
- **言語**: {self.data['html_structure'].get('html_lang', '未設定')}

---

## メタデータ

"""

        if self.data['meta_tags']:
            for name, content in self.data['meta_tags'].items():
                md += f"- **{name}**: {content}\n"
        else:
            md += "- メタタグなし\n"

        md += f"""
---

## HTML構造

### DOCTYPE
```
{self.data['html_structure'].get('doctype', 'unknown')}
```

### HEAD要素
{self._format_dict(self.data['html_structure'].get('head_elements', {}))}

### BODY要素
{self._format_dict(self.data['html_structure'].get('body_elements', {}))}

---

## リソース

### CSSファイル ({len(self.data['css_files'])}個)
"""

        for css in self.data['css_files']:
            md += f"- {css}\n"

        if self.data['inline_styles']:
            md += f"\n### インラインスタイル ({len(self.data['inline_styles'])}個)\n"
            md += "- 存在します（詳細はJSONファイル参照）\n"

        md += f"""
---

### JavaScriptファイル ({len(self.data['js_files'])}個)
"""

        for js in self.data['js_files']:
            attrs = []
            if js.get('async'): attrs.append('async')
            if js.get('defer'): attrs.append('defer')
            attr_str = f" [{', '.join(attrs)}]" if attrs else ""
            md += f"- {js['src']}{attr_str}\n"

        if self.data['inline_scripts']:
            md += f"\n### インラインスクリプト ({len(self.data['inline_scripts'])}個)\n"
            total_size = sum(s['length'] for s in self.data['inline_scripts'])
            md += f"- 合計サイズ: {total_size} 文字\n"

        md += f"""
---

## メディアファイル

### 画像 ({len(self.data['images'])}個)
"""

        for i, img in enumerate(self.data['images'][:20], 1):
            alt = f" - {img['alt']}" if img['alt'] else ""
            size = f" ({img['width']}x{img['height']})" if img['width'] and img['height'] else ""
            md += f"{i}. {img['src']}{alt}{size}\n"

        if len(self.data['images']) > 20:
            md += f"\n... 他 {len(self.data['images']) - 20}個\n"

        md += f"""
### 動画 ({len(self.data['videos'])}個)
"""

        for video in self.data['videos']:
            attrs = []
            if video.get('autoplay'): attrs.append('autoplay')
            if video.get('loop'): attrs.append('loop')
            if video.get('muted'): attrs.append('muted')
            attr_str = f" [{', '.join(attrs)}]" if attrs else ""
            md += f"- {video['src']}{attr_str}\n"

        md += f"""
---

## リンク構造

### 内部リンク
"""

        domain = urlparse(self.url).netloc
        internal_links = [l for l in self.data['links'] if domain in l['href']]

        for link in internal_links[:20]:
            text = link['text'] or '[テキストなし]'
            md += f"- [{text}]({link['href']})\n"

        md += f"""
### 外部リンク
"""

        external_links = [l for l in self.data['links'] if domain not in l['href'] and l['href'].startswith('http')]

        for link in external_links[:10]:
            text = link['text'] or '[テキストなし]'
            md += f"- [{text}]({link['href']})\n"

        md += f"""
---

## フォーム ({len(self.data['forms'])}個)
"""

        for i, form in enumerate(self.data['forms'], 1):
            md += f"""
### Form {i}
- **Action**: {form['action']}
- **Method**: {form['method']}
- **入力フィールド**: {len(form['inputs'])}個
"""

        md += """
---

## DOM ツリー構造

```json
"""
        md += json.dumps(self.data['dom_tree'], indent=2, ensure_ascii=False)
        md += """
```

---

**生成ツール**: Enhanced Web Scraper
"""

        return md

    def _format_dict(self, d):
        return '\n'.join([f"- **{k}**: {v}" for k, v in d.items()])

    def save(self, output_dir='./reference'):
        print(f"\n💾 Saving to {output_dir}...")

        # Markdown
        md = self.generate_markdown_report()
        with open(f"{output_dir}/sitemap.md", 'w', encoding='utf-8') as f:
            f.write(md)
        print("✅ Saved: sitemap.md")

        # JSON
        with open(f"{output_dir}/site-analysis-full.json", 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
        print("✅ Saved: site-analysis-full.json")

        print("\n🎉 Complete!")

def main():
    import sys

    if len(sys.argv) < 2:
        print("Usage: python enhanced_scraper.py <URL>")
        sys.exit(1)

    url = sys.argv[1]
    scraper = EnhancedScraper(url)

    try:
        scraper.analyze()
        scraper.save()

        print("\n📊 Summary:")
        print(f"   - CSS files: {len(scraper.data['css_files'])}")
        print(f"   - JS files: {len(scraper.data['js_files'])}")
        print(f"   - Images: {len(scraper.data['images'])}")
        print(f"   - Videos: {len(scraper.data['videos'])}")
        print(f"   - Links: {len(scraper.data['links'])}")
        print(f"   - Forms: {len(scraper.data['forms'])}")

    except Exception as e:
        print(f"\n❌ Failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
