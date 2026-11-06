const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const source=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
function setup({ hash = '', reduce = false, quiz = false, stored = null, storageFails = false, fetchFails = false } = {}) {
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
    setPointerCapture() {}
    dispatchEvent(event) {return this.fire(event.type);}
    get id() { return this.attrs.id; }
    get value() { return this.attrs.value; }
    remove() { if(this.parent) this.parent.children = this.parent.children.filter(c=>c!==this); }
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
        if (s.includes(' ')) { const parts=s.split(/\s+/); const last=parts.pop(); return this.matches(last) && Boolean(this.parent?.closest(parts.join(' '))); }
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
  const storage = new Map(stored ? [['travel-edit.quiz.v1', stored]] : []), downloads = [];
  let serial=0;
  const context = { document: doc, window: win, console, Event, setTimeout: fn=>fn(), crypto: {randomUUID:()=>`test-attempt-${String(++serial).padStart(16,'0')}`}, Blob,
    URL: {createObjectURL: blob=>{downloads.push(blob);return 'blob:test';},revokeObjectURL(){}},
    sessionStorage: {getItem:k=>{if(storageFails)throw Error('blocked');return storage.get(k)||null;},setItem:(k,v)=>{if(storageFails)throw Error('blocked');storage.set(k,v);}},
    fetch: ()=>fetchFails?Promise.reject(Error('offline')):Promise.resolve({ok:true,json:()=>Promise.resolve(JSON.parse(fs.readFileSync(path.join(root,'data/quiz-v1.json'),'utf8')))}) };
  doc.body=doc.querySelector('body');
  if(quiz){vm.runInNewContext(fs.readFileSync(path.join(root,'js/sample-interactions.js'),'utf8'),context);win.TravelQuiz=require('../../js/quiz-core.js');vm.runInNewContext(fs.readFileSync(path.join(root,'js/quiz-ui.js'),'utf8'),context);}
  vm.runInNewContext(source, context);
  const loaded = async () => {for(let i=0;i<10;i++)await Promise.resolve();};
  return { doc, win, media, storage, downloads, loaded, el: id => doc.querySelector(`#${id}`), all: s => doc.querySelectorAll(s), key: (key, target = doc.activeElement || doc) => doc.fire('keydown', { key, target }) };
}

function active(t) { return t.all('.slide').filter(s => !s.hidden).map(s => s.id); }

module.exports={setup,active};
