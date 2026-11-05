/* Dependency-free interaction checks against app.js and the actual HTML.
 * This minimal DOM adapter does not render CSS or replace browser testing.
 * Run: node --test tests/foundation.test.cjs
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');

function setup({ hash = '', reduce = false } = {}) {
  let doc;
  class Element {
    constructor(tag, attrs = {}) {
      this.tagName = tag; this.attrs = attrs; this.children = []; this.events = {};
      this.hidden = 'hidden' in attrs; this.disabled = 'disabled' in attrs;
      this.dataset = Object.fromEntries(Object.entries(attrs).filter(([k]) => k.startsWith('data-')).map(([k,v]) => [k.slice(5).replace(/-([a-z])/g, (_,c) => c.toUpperCase()),v]));
      this.classes = new Set((attrs.class || '').split(/\s+/));
      this.classList = { add: v => this.classes.add(v), remove: v => this.classes.delete(v) };
      this.style = { setProperty(k,v) { this[k] = v; } };
    }
    get id() { return this.attrs.id; }
    set className(v) { this.classes = new Set(v.split(/\s+/)); }
    get textContent() { return (this.text || '') + this.children.map(c => typeof c === 'string' ? c : c.textContent).join(''); }
    set textContent(v) { this.text = v; this.children = []; }
    append(...items) { for (const item of items) { this.children.push(item); if (typeof item !== 'string') item.parent = this; } }
    replaceChildren(...items) { this.text = ''; this.children = []; this.append(...items); }
    setAttribute(k,v) { this.attrs[k] = String(v); }
    getAttribute(k) { return this.attrs[k] ?? null; }
    removeAttribute(k) { delete this.attrs[k]; }
    matches(selector) {
      return selector.split(',').some(s => {
        s = s.trim();
        if (s.startsWith('#')) return this.id === s.slice(1);
        if (s.startsWith('.')) return this.classes.has(s.slice(1));
        const attr = s.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);
        if (attr) return attr[2] === undefined ? attr[1] in this.attrs : this.attrs[attr[1]] === attr[2];
        return this.tagName === s;
      });
    }
    querySelectorAll(s) { return this.children.flatMap(c => typeof c === 'string' ? [] : [...(c.matches(s) ? [c] : []), ...c.querySelectorAll(s)]); }
    querySelector(s) { return this.querySelectorAll(s)[0] || null; }
    closest(s) { return this.matches(s) ? this : this.parent?.closest(s); }
    addEventListener(type, fn) { (this.events[type] ||= []).push(fn); }
    fire(type, props = {}) { const event = { target: this, preventDefault() { this.defaultPrevented = true; }, ...props }; (this.events[type] || []).forEach(fn => fn(event)); return event; }
    click() { if (!this.disabled) this.fire('click'); }
    focus() { doc.activeElement = this; }
    showModal() { this.open = true; this.opener = doc.activeElement; }
    close() { this.open = false; this.opener?.focus(); }
    getBoundingClientRect() { return {left:10,right:500,top:10,bottom:500}; }
  }
  doc = new Element('document');
  const stack = [doc];
  const voids = new Set(['meta','link','img','br','input','hr']);
  for (const token of html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g)) {
    if (token.startsWith('<!')) continue;
    if (token.startsWith('</')) { stack.pop(); continue; }
    if (!token.startsWith('<')) { stack.at(-1).append(token); continue; }
    const tag = token.match(/^<([\w-]+)/)[1];
    const attrs = Object.fromEntries([...token.slice(tag.length + 1).matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(m => [m[1], m[2] ?? '']));
    const el = new Element(tag, attrs); stack.at(-1).append(el);
    if (!voids.has(tag) && !token.endsWith('/>')) stack.push(el);
  }
  doc.documentElement = doc.querySelector('html');
  doc.createElement = tag => new Element(tag);
  doc.createTextNode = s => s;
  const media = new Element('media'); media.matches = reduce;
  const win = new Element('window'); win.location = { hash };
  win.matchMedia = () => media;
  win.history = { entries: [], pushState(_state, _title, value) { win.location.hash = value; this.entries.push(value); } };
  win.scrollTo = options => { win.lastScroll = options; };
  vm.runInNewContext(source, { document: doc, window: win });
  return { doc, win, media, el: id => doc.querySelector(`#${id}`), all: s => doc.querySelectorAll(s), key: (key, target = doc.activeElement || doc) => doc.fire('keydown', { key, target }) };
}

function active(t) { return t.all('.slide').filter(s => !s.hidden).map(s => s.id); }
test('initial state exposes only the introduction and truthful three-slide progress', () => {
  const t = setup(); assert.deepEqual(active(t), ['welcome']);
  assert.equal(t.el('previous-slide').disabled, true);
  assert.equal(t.el('slide-progress').getAttribute('aria-valuemax'), '3');
  assert.equal(t.el('slide-counter').textContent, 'Slide 1 of 3');
  assert.equal(t.all('.overview-link').length, 3);
});
test('CTA, Back and Next update visibility, focus, counter, URL and progress together', () => {
  const t = setup(); t.el('hero-action').click(); t.el('hero-action').click();
  assert.deepEqual(active(t), ['priorities']); assert.equal(t.doc.activeElement.id, 'priorities-heading');
  assert.equal(t.el('welcome').inert, true); assert.equal(t.el('priorities').inert, false);
  assert.equal(t.win.location.hash, '#priorities'); assert.equal(t.el('slide-counter').textContent, 'Slide 2 of 3');
  assert.equal(t.el('slide-progress').getAttribute('aria-valuenow'), '2');
  assert.ok(Math.abs(parseFloat(t.el('progress-fill').style.width) - 66.6667) < .001);
  t.el('previous-slide').click(); assert.deepEqual(active(t), ['welcome']);
  t.el('next-slide').click(); t.el('next-slide').click(); assert.deepEqual(active(t), ['mood']);
});
test('rapid navigation and chapter boundaries never expose nonexistent slides', () => {
  const t = setup(); for (let i = 0; i < 20; i++) t.el('next-slide').click();
  assert.deepEqual(active(t), ['mood']); assert.equal(t.el('next-slide').disabled, true);
  assert.equal(t.el('progress-fill').style.width, '100%');
  for (let i = 0; i < 20; i++) t.el('previous-slide').click();
  assert.deepEqual(active(t), ['welcome']); assert.equal(t.el('previous-slide').disabled, true);
});
test('deep links restore the correct slide; invalid initial hashes safely fall back', () => {
  assert.deepEqual(active(setup({hash:'#mood'})), ['mood']);
  assert.deepEqual(active(setup({hash:'#quiz'})), ['welcome']);
});
test('browser history changes restore slide state; the skip anchor does not reset it', () => {
  const t = setup({hash:'#mood'}); t.win.location.hash = '#priorities'; t.win.fire('popstate');
  assert.deepEqual(active(t), ['priorities']);
  t.win.location.hash = '#presentation'; t.win.fire('hashchange');
  assert.deepEqual(active(t), ['priorities']);
  t.win.location.hash = ''; t.win.fire('popstate');
  assert.deepEqual(active(t), ['welcome']);
});
test('keyboard shortcuts work from headings and do not hijack buttons or dialogs', () => {
  const t = setup(); t.key('ArrowRight'); assert.deepEqual(active(t), ['priorities']);
  t.key('ArrowRight', t.all('[data-preference]')[0]); assert.deepEqual(active(t), ['priorities']);
  t.el('overview-open').click(); t.key('End'); assert.deepEqual(active(t), ['priorities']);
  t.el('overview-close').click(); t.key('End'); assert.deepEqual(active(t), ['mood']);
  t.key('Home'); assert.deepEqual(active(t), ['welcome']);
});
test('overview selects a slide, closes, restores heading focus and marks the current item', () => {
  const t = setup(); t.el('overview-open').focus(); t.el('overview-open').click();
  t.all('.overview-link')[2].click(); assert.equal(t.el('slide-overview').open, false);
  assert.deepEqual(active(t), ['mood']); assert.equal(t.doc.activeElement.id, 'mood-heading');
  assert.equal(t.all('.overview-link')[2].getAttribute('aria-current'), 'step');
});
test('all four postcards reveal distinct scenarios; selection survives slide navigation', () => {
  const t = setup({hash:'#priorities'}); const messages = new Set();
  for (const card of t.all('[data-preference]')) {
    card.click(); messages.add(t.el('preference-text').textContent);
    assert.equal(t.all('[data-preference]').filter(b => b.getAttribute('aria-pressed') === 'true').length, 1);
  }
  assert.equal(messages.size, 4); t.el('next-slide').click(); t.el('previous-slide').click();
  assert.equal(t.all('[data-preference]')[3].getAttribute('aria-pressed'), 'true');
});
test('Surprise me cycles all four captions and wraps without changing slide progress', () => {
  const t = setup({hash:'#mood'}); const original = t.el('mood-caption').textContent; const captions = new Set();
  for (let i = 0; i < 4; i++) { t.el('surprise-button').click(); captions.add(t.el('mood-caption').textContent); }
  assert.equal(captions.size, 4); assert.equal(t.el('mood-caption').textContent, original);
  assert.equal(t.el('slide-counter').textContent, 'Slide 3 of 3');
});
test('restart returns to the opening without implementing quiz or scoring state', () => {
  const t = setup({hash:'#mood'}); t.el('restart-slides').click(); assert.deepEqual(active(t), ['welcome']);
});
test('motion toggle updates its state and reduced-motion preference always wins', () => {
  const t = setup(); t.el('motion-toggle').click(); assert.equal(t.doc.documentElement.dataset.motion, 'off');
  t.el('motion-toggle').click(); assert.equal(t.doc.documentElement.dataset.motion, 'on');
  const reduced = setup({reduce:true}); assert.equal(reduced.doc.documentElement.dataset.motion, 'off');
  assert.equal(reduced.el('motion-toggle').disabled, true);
  reduced.el('motion-toggle').click(); assert.equal(reduced.doc.documentElement.dataset.motion, 'off');
  t.media.matches = true; t.media.fire('change'); assert.equal(t.doc.documentElement.dataset.motion, 'off');
});

test('suitcase opens and closes without navigation; its primary action then continues', () => {
  const t = setup(); t.el('suitcase-stage').click();
  assert.equal(t.el('suitcase-stage').getAttribute('aria-pressed'), 'true');
  assert.match(t.el('suitcase-status').textContent, /Curiosity packed/);
  assert.deepEqual(active(t), ['welcome']);
  t.el('suitcase-stage').click(); assert.equal(t.el('suitcase-stage').getAttribute('aria-pressed'), 'false');
  t.el('hero-action').click(); assert.deepEqual(active(t), ['welcome']);
  t.el('hero-action').click(); assert.deepEqual(active(t), ['priorities']);
});
test('all three view controls provide feedback without changing the open state', () => {
  const t = setup(); t.el('rotate-left').click(); assert.match(t.el('suitcase-status').textContent, /left/);
  t.el('rotate-right').click(); assert.match(t.el('suitcase-status').textContent, /right/);
  t.el('reset-view').click(); assert.match(t.el('suitcase-status').textContent, /starting view/);
  assert.equal(t.el('suitcase-stage').getAttribute('aria-pressed'), 'false');
});
test('a selected preference carries the matching mood to the globe', () => {
  for (const [index, expected] of ['A day well planned','The scenic route','Slow mornings','A taste of somewhere'].entries()) {
    const t = setup({hash:'#priorities'});
    assert.equal(t.el('preference-continue').disabled, true);
    t.all('[data-preference]')[index].click(); assert.equal(t.el('preference-continue').disabled, false);
    t.el('preference-continue').click(); assert.deepEqual(active(t), ['mood']);
    assert.equal(t.el('mood-name').textContent, expected);
  }
});
