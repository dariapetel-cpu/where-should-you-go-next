"""Static prototype structure, local dependencies and color checks; not product analytics."""
from html.parser import HTMLParser
from pathlib import Path
import json
ROOT = Path(__file__).resolve().parents[1]
class Audit(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.refs=[]; self.assets=[]; self.panels=[]; self.language=None
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='html': self.language=a.get('lang')
        if 'id' in a: self.ids.append(a['id'])
        for k in ('aria-controls','aria-labelledby'): self.refs.extend(a.get(k,'').split())
        if tag in ('script','link') and (a.get('src') or a.get('href')): self.assets.append(a.get('src',a.get('href','')))
        if 'data-panel' in a: self.panels.append(a)
a=Audit();a.feed((ROOT/'prototype/index.html').read_text())
assert a.language=='en'
assert len(a.ids)==len(set(a.ids))
assert all(r in a.ids for r in a.refs)
assert [p['data-panel'] for p in a.panels]==['0','1','2','3']
assert sum('hidden' not in p for p in a.panels)==1
for path in a.assets:
    assert not path.startswith(('https:','http:','//'))
    assert (ROOT/'prototype'/path).is_file(),path
c=json.loads((ROOT/'prototype/catalog.json').read_text())
assert len(c['questions'])==7 and len(c['destinations'])==15
for d in c['destinations']:
    assert len(d['affinities'])==7 and len(set(d['attractions']))==3
    assert d['source'].startswith('https://')
def lum(h):
    channels=[int(h[i:i+2],16)/255 for i in (1,3,5)]
    return sum((x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4)*w for x,w in zip(channels,[.2126,.7152,.0722]))
for fg,bg in [('#FFF9EF','#245E70'),('#FFF9EF','#954B32'),('#FFF9EF','#24645F'),('#52666C','#E6EFF0'),('#745A4D','#F5E7D9'),('#52695F','#F3EBDC')]:
    x,y=sorted([lum(fg),lum(bg)],reverse=True); assert (x+.05)/(y+.05)>=4.5
print('PASS: isolated four-panel structure, English, local assets, ARIA IDs, 15 destinations, content shape, selected contrast pairs.')
for name in ('destinations.html', 'destination-checks.html'):
    page=Audit(); page.feed((ROOT/'prototype'/name).read_text())
    assert page.language=='en'
    assert len(page.ids)==len(set(page.ids))
    assert all(ref in page.ids for ref in page.refs)
    for asset in page.assets:
        assert not asset.startswith(('http:','https:','//'))
        assert (ROOT/'prototype'/asset).is_file(), asset
print('PASS: destination gallery and GPU-check page use valid English markup and existing local assets.')
