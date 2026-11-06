"""Static foundation checks. This is test tooling, not the planned Python analysis.
Run from any directory: python3 tests/check_foundation.py
"""
from html.parser import HTMLParser
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]


class Audit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.references = []
        self.links = []
        self.slides = []
        self.language = None

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == 'html':
            self.language = attributes.get('lang')
        if 'id' in attributes:
            self.ids.append(attributes['id'])
        for key in ('aria-labelledby', 'aria-controls'):
            self.references.extend(attributes.get(key, '').split())
        if tag in ('script', 'img', 'link', 'use'):
            self.links.append(attributes.get('src', attributes.get('href', '')))
        if tag == 'img':
            assert 'alt' in attributes, 'Missing image alternative text'
        if tag == 'section' and 'slide' in attributes.get('class', '').split():
            self.slides.append(attributes)


def luminance(hex_color):
    rgb = [int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    linear = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in rgb]
    return sum(channel * weight for channel, weight in zip(linear, (.2126, .7152, .0722)))


def contrast(a, b):
    light, dark = sorted((luminance(a), luminance(b)), reverse=True)
    return (light + .05) / (dark + .05)


audit = Audit()
audit.feed((ROOT / 'index.html').read_text())
assert audit.language == 'en'
assert len(audit.ids) == len(set(audit.ids)), 'Duplicate IDs'
assert all(ref in audit.ids for ref in audit.references), 'Broken ARIA reference'
assert [slide['id'] for slide in audit.slides] == ['welcome', 'priorities', 'mood', 'boarding', *[f'q{i}' for i in range(1, 8)], 'match']
assert sum('hidden' not in slide for slide in audit.slides) == 1
for link in audit.links:
    assert not link.startswith(('https:', 'http:', '//')), f'External dependency: {link}'
    filename, _, fragment = link.partition('#')
    asset = ROOT / filename
    assert asset.is_file(), f'Missing asset: {link}'
    if fragment:
        ids = {element.get('id') for element in ET.parse(asset).iter()}
        assert fragment in ids, f'Missing SVG symbol: {link}'
for svg in (ROOT / 'assets/illustrations').glob('*.svg'):
    ET.parse(svg)
print('PASS: English document, slide count, unique IDs, ARIA references, alt text, local assets, SVG syntax/symbols.')

# Representative design-token combinations, not a complete rendered contrast audit.
for label, foreground, background in [
    ('White on sky-blue action', '#FFFFFF', '#285B73'),
    ('White on coral action', '#FFFFFF', '#904632'),
    ('White on mint action', '#FFFFFF', '#326552'),
    ('Sky-blue text on blue', '#285B73', '#E4F0F5'),
    ('Coral text on peach', '#904632', '#FAEBDD'),
    ('Mint text on mint', '#326552', '#E4EFE5'),
    ('Primary text on cream', '#29243D', '#FFF8EE'),
    ('Secondary text on cream', '#665C74', '#FFF8EE'),
    ('White on primary action', '#FFFFFF', '#6240A5'),
    ('Card copy on lavender', '#6B5C76', '#EBE5F4'),
    ('Card copy on blue', '#6B5C76', '#E3EDF5'),
    ('Card copy on pink', '#6B5C76', '#F5E3E9'),
    ('Card copy on sand', '#6B5C76', '#F5ECDC'),
]:
    ratio = contrast(foreground, background)
    assert ratio >= 4.5, f'{label}: {ratio:.2f}:1'
    print(f'PASS: {label}: {ratio:.2f}:1')
