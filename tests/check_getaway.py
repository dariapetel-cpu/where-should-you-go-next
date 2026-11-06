"""Static complete-presentation checks. Does not perform browser or GPU verification."""
from html.parser import HTMLParser
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
class Audit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids=[]; self.refs=[]; self.assets=[]; self.slides=[]; self.lang=None
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='html': self.lang=a.get('lang')
        if 'id' in a: self.ids.append(a['id'])
        for key in ('aria-labelledby','aria-controls','for'):
            self.refs.extend(a.get(key,'').split())
        if 'data-slide' in a: self.slides.append(a)
        if tag in ('script','link','img'):
            p=a.get('src',a.get('href',''))
            if p and not p.startswith(('https:', '#')): self.assets.append(p)
        if tag=='img': assert a.get('alt'), 'Missing image alt text'
a=Audit(); a.feed((ROOT/'getaway.html').read_text())
assert a.lang=='en'
assert len(a.ids)==len(set(a.ids))
assert set(a.refs)<=set(a.ids)
assert [s['data-slide'] for s in a.slides]==list(map(str,range(16)))
assert sum('hidden' not in s for s in a.slides)==1
for p in a.assets: assert (ROOT/p).is_file(), p
catalog=json.loads((ROOT/'prototype/catalog.json').read_text())
content=json.loads((ROOT/'data/getaway-content.json').read_text())
assert set(content['destinations'])=={d['id'] for d in catalog['destinations']}
assert sorted(d['tile'] for d in content['destinations'].values())==list(range(15))
for d in content['destinations'].values():
    assert len(d['areas'])==3
    for area in d['areas']:
        assert {v['interest'] for v in area['activities']}==set('abcd')
        assert all(v['title'] and v['source'].startswith('https://') for v in area['activities'])
manifest=json.loads((ROOT/'assets/destinations/manifest.json').read_text())
for item in manifest['files']:
    p=ROOT/'assets/destinations'/item['path']
    assert p.stat().st_size==item['bytes']
    assert hashlib.sha256(p.read_bytes()).hexdigest()==item['sha256']
assert sum((ROOT/f'assets/destinations/atlas-{i}.jpg').stat().st_size for i in range(4))<5_000_000
print('PASS: 16 English slides, IDs/ARIA, local dependencies, 15 complete content packages, 180 activity options, artwork checksums and <5 MB runtime image budget.')
# Token-pair checks, not a claim of rendered screenshot contrast.
def luminance(value):
    rgb=[int(value[i:i+2],16)/255 for i in (1,3,5)]
    values=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
    return sum(v*w for v,w in zip(values,(.2126,.7152,.0722)))
def contrast(a,b):
    x,y=sorted((luminance(a),luminance(b)))
    return (y+.05)/(x+.05)
for background,accent in [('#ffe0d6','#a13024'),('#cff4ef','#005d56'),('#fff0ac','#66500b'),('#def0ff','#22539a'),('#ffdce9','#962752'),('#ddf2dc','#246039'),('#e8dcff','#57318c')]:
    assert contrast('#202a3b',background)>=7
    assert contrast('#ffffff',accent)>=4.5
    assert contrast(accent,background)>=4.5
print('PASS: seven question palettes meet text/selected-control contrast targets.')
