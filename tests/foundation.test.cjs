/* Shell regression tests using a minimal DOM adapter, not a browser renderer. */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {setup,active}=require('./helpers/dom.cjs');
test('initial state exposes only the introduction and truthful twelve-slide progress', () => {
  const t = setup(); assert.deepEqual(active(t), ['welcome']);
  assert.equal(t.el('previous-slide').disabled, true);
  assert.equal(t.el('slide-progress').getAttribute('aria-valuemax'), '12');
  assert.equal(t.el('slide-counter').textContent, 'Slide 1 of 12');
  assert.equal(t.all('.overview-link').length, 12);
});
test('CTA, Back and Next update visibility, focus, counter, URL and progress together', () => {
  const t = setup(); t.el('hero-action').click(); t.el('hero-action').click();
  assert.deepEqual(active(t), ['priorities']); assert.equal(t.doc.activeElement.id, 'priorities-heading');
  assert.equal(t.el('welcome').inert, true); assert.equal(t.el('priorities').inert, false);
  assert.equal(t.win.location.hash, '#priorities'); assert.equal(t.el('slide-counter').textContent, 'Slide 2 of 12');
  assert.equal(t.el('slide-progress').getAttribute('aria-valuenow'), '2');
  assert.ok(Math.abs(parseFloat(t.el('progress-fill').style.width) - 16.6667) < .001);
  t.el('previous-slide').click(); assert.deepEqual(active(t), ['welcome']);
  t.el('next-slide').click(); t.el('next-slide').click(); assert.deepEqual(active(t), ['mood']);
});
test('rapid navigation and chapter boundaries never expose nonexistent slides', () => {
  const t = setup(); for (let i = 0; i < 20; i++) t.el('next-slide').click();
  assert.deepEqual(active(t), ['match']); assert.equal(t.el('next-slide').disabled, true);
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
  t.el('overview-close').click(); t.key('End'); assert.deepEqual(active(t), ['match']);
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
  assert.equal(t.el('slide-counter').textContent, 'Slide 3 of 12');
});
test('shell restart returns to the opening without changing exploration selections', () => {
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
